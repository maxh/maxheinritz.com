---
title: Entities and value objects
layout: note
---

Following the DDD philosophy, I use the term _entity_ to refer to "a set of data with its own identity that remains stable through time even as its attributes change". Or more simply, "a piece of data with a unique identifier".

In contrast to "entity", a "value object" has no unique identifier and simply represents a value akin to a primitive like a string or integer, yet as a more complex object.

Entities can be either mutable or immutable. The difference between an immutable entity and value object is simply whether an identifier is assigned.

So we have three options for representing data:

- Mutable entity
- Immutable entity
- Value object

Data can be represented in any of these ways depending on our use case and domain model. For example, let's consider different ways we could model street addresses.

## Address example

### Mutable entity

Example:

```json
{
  "qid": "qid::address:2fd38a62-5d26-401e-abf5-873f7f3e1232",
  "createdAt": "2022-06-10T16:07:01.495",
  "revisionNumber": 3,
  "revisionCreatedAt": "2022-06-11T14:07:04.234",
  "streetAddress": "123 Main St",
  "city": "Chicago",
  "state": "IL",
  "zip": "60601",
  "country": "US"
}
```

For a global map database such as Google Maps or OpenStreetMap, an address is a first-class concept. When interacting with these systems, users think about "changing an address" to fix typos and keep the map up-to-date with new construction in the real world. And indeed, this is similar how OSM stores "node" data:

https://www.openstreetmap.org/way/98952449

### Immutable entity

Example:

```json
{
  "qid": "qid::address:2fd38a62-5d26-401e-abf5-873f7f3e1232",
  "createdAt": "2022-06-10T16:07:01.495",
  "streetAddress": "123 Main St",
  "city": "Chicago",
  "state": "IL",
  "zip": "60601",
  "country": "US"
}
```

For the logistics domain, an important use case for addresses is analytics to showing all inbound shipments to a particular address both, both looking ahead and looking back. A stable identifier to an address is useful for normalization across shipments, but it should be immutable because old shipment data should not change.

To fix typos and handle rerouted shipments, new address entities can be created and the shipment entities (which can be mutable) should be updated.

Another way to handle this is make addresses mutable and have shipments store references to specific address revisions. But this adds other forms of complexity.

### Value object

Example:

```json
{
  "streetAddress": "123 Main St",
  "city": "Chicago",
  "state": "IL",
  "zip": "60601",
  "country": "US"
}
```

For a routing system built on top of geospatial database, we might have utility services like geocoding or direction routing that take addresses as input. This input will need to be serialized to be received in the system and possible stored as request logs or similar. While the request object may be given a unique identifier, the addresses themselves does not need one and can be treated like any other serialized blob of data. A new request comes in, a new value object is created, etc.

## Revision source

The revision source tracks who created which revisions to entities.

```json
{
  "userQid": "qid::user:f048070f-63d8-47e4-b957-93cdc0bb0565",
  "entryPoint": {
    "root": "CLI",
    "runner": "CliBackfill20220617BackfillFooBarFromBaz"
  }
}
```

It's a bit of a misnomer but this can be used for immutable entities even though there aren't "revisions" per se. We can think of the creation of the immutable entitiy as a single "revision". So database columns on entities:

```sh
# Mutable entity columns:
qid - Qid
createdAt - Timestamp
revisionNumber - Integer
revisionCreatedAt - Timestamp
revisionSource - JSON

# Immutable entity columns:
qid - Qid
createdAt - Timestamp
revisionSource - JSON
```
