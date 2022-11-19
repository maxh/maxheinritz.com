---
title: Event streaming
desc: Publishing and consuming through an ordered log of events
layout: note
tags: ["software patterns"]
---

Event streaming is a pattern for communication between software components. Two popular options are Apache Kafka and Amazon Kinesis, but the pattern itself is implemenation-agnostic.

## Use cases

### Respecting domain boundaries

For communication _down_ a [dependency hierarchy](/posts/dependency-hierarchy.html), higher-level modules can directly invoke APIs on low-level modules. For example, if the invoice module needs to check user permissions, it can call down into the user module to retrieve user roles.

For communication _up_ a dependency hierarchy, lower-level modules are not allowed to depend on high-level modules, so they cannot invoke their APIs. Instead, low-level modules can publish events, agnostic to who consumes them. Then higher level modules can consume these events; in doing so they take a dependency on the low-level module, which is fine.

### Performance

Even for communication _down_ a dependency hierarchy, events can be useful for performance reasons. They can be used as an alternative to API to calls for distributed transactions across horizontally scaled services, as described in this page:

[https://microservices.io/patterns/data/saga.html]([https://microservices.io/patterns/data/saga.html)

Two options are shown there: choreography and orchestration.

I dislike that choreography introduces a circular dependency between the customer module and the order module. In particular, the customer module consumes "order created" events, which requires it to know about the order module. Conceptually, I would expect the consumer module to live "below" the order module and not know or care about it.

In contrast, the orchestration patterns shows how events can be used as a transport mechanism while still respecting domain boundaries. The customer module doesn't know anything about the order module: it just consumes command events defined it terms of its own domain language. The customer module doesn't care who published the command event.

## Implementation in PostgreSQL

An event log is fairly straightforward to implement on top of PostgreSQL in a monolith, with no need for an external message broker.

- Two enums: one for event type, one for consumer key.
- Three database tables: an outbox, an event log, and a consumer watermark.
- When publishing events, publishers write into the outbox table as part of their transactions to entity tables. Ordering within the outbox is not guaranteed.
- A "log writer" runs in background, reading events from the outbox and writing them into the event log with a SERIALIZABLE transaction isolation level. The serializable isolation level ensures that the log entry global offset is stably ordered.
- There are many consumers running in the background, reading events from the log and upon successful consumption, update their watermark.

```prisma
// This is the event publishing outbox: publishing an event writes
// into this table. The order of events in this table is semi-
// arbitrary. Use the event log table below for a stable ordering.
model DbDurableEventOutbox {
  tenantQid      String   @map(name: "tenant_qid")
  qid            String   @id
  eventType      String   @map(name: "event_type")
  payload        Json
  createdAt      DateTime @default(now()) @map(name: "created_at")
  revisionSource Json     @map(name: "revision_source")
  isWrittenToLog Boolean  @default(false) @map(name: "is_written_to_log")

  // There is a partial index on isWrittenToLog, manually added in
  // a migration since Prisma doesn't support partial indices yet.

  @@map(name: "durable_event_outbox")
}

// This is the event log: a globally stable ordered log of events.
// Each row in the event log is an entry.
model DbDurableEventLogEntry {
  tenantQid String @map(name: "tenant_qid")

  logOffset BigInt @id @default(autoincrement()) @map(name: "log_offset")

  eventQid            String   @unique @map(name: "event_qid")
  eventType           String   @map(name: "event_type")
  eventPayload        Json     @map(name: "event_payload")
  // Note that "eventCreatedAt" may be out of order with respect to the log offset.
  eventCreatedAt      DateTime @default(now()) @map(name: "event_created_at")
  eventRevisionSource Json     @map(name: "event_revision_source")

  @@index([eventType, logOffset])
  @@map(name: "durable_event_log_entry")
}

model DbDurableEventConsumerWatermark {
  ///no-tenant-field
  consumerKey          String    @map(name: "consumer_key")
  eventType            String    @map(name: "event_type")
  isCurrentlyConsuming Boolean   @default(false) @map(name: "is_currently_consuming")
  lastEventLogOffset   BigInt    @default(0) @map(name: "last_event_log_offset")
  lastEventTimestamp   DateTime  @default(now()) @map(name: "last_event_timestamp")
  createdAt            DateTime  @default(now()) @map(name: "created_at")
  startedConsumingAt   DateTime? @map(name: "started_consuming_at")

  @@unique(fields: [consumerKey, eventType], name: "uniqueConsumerEventPair")
  @@map(name: "durable_event_consumer_watermark")
}
```
