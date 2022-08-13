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

For communication _down_ a dependency hierarchy, lower-level modules are not allowed to depend on high-level modules, so they cannot invoke their APIs. Instead, low-level modules can publish events, agnostic to who consumes them. Then higher level modules can consume these events; in doing so they take a dependency on the low-level module, which is fine.

### Performance

Even for communication _down_ a dependency hierarchy, events can be useful for performance reasons. They can be used as an alternative to API to calls for distributed transactions across horizontally scaled services, as described in this page:

[https://microservices.io/patterns/data/saga.html]([https://microservices.io/patterns/data/saga.html)

Two options are shown there: choreography and orchestration.

I dislike that choreography introduces a circular dependency between the customer module and the order module. In particular, the customer module consumes "order created" events, which requires it to know about the order module. Conceptually, I would expect the consumer module to live "below" the order module and not know or care about it.

In contrast, the orchestration patterns shows how events can be used as a transport mechanism while still respecting domain boundaries. The customer module doesn't know anything about the order module: to just consumes command events defined it terms of its own domain language. The customer module doesn't care who published the command event.
