---
title: Qualified identifiers (qids)
desc: An ARN-like alternative to UUIDs and serial columns
layout: essay
---

For database IDs, I like to use "qualified identifiers" (or "qids") with a schema as follows:

```
qid:<reserved>:<service-or-domain-prefix>:<entity-type>:<unique-identifier>
```

Examples:

```
qid::ta:tenant:869e7dad-4e92-4e7c-9325-f2e4bc4cbf7b
qid::ta:user:869e7dad-4e92-4e7c-9325-f2e4bc4cbf7b
qid::nt:organization:1798e34f-2b49-4b73-afbb-9205e5387cb5
qid::nt:location:893febfb-e7ba-4d7c-b576-18f2c907868b
```

The format is similar to [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) and the more general [Universal Resource Name (URN)](https://en.wikipedia.org/wiki/Uniform_Resource_Name) format. I first learned about the idea from Dana Powers, who introduced something similar at Flexport.

The `<unique-identifier>` is typically but not necessarily a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

Within the context of the example system, the domain prefixes "ta" (tenant administration) and "nt" (transportation network) would be familiar to engineers and technically-oriented users, akin to s3 or ec2 in the AWS ecosystem.

## Use cases

Qids are globally unique and fully qualified, and these properties offer some advantages over plain UUIDs or serial numeric identifiers.

**Global lookup** – The qid format supports global entity resolution: given a qid, get its value. This is useful for implementing the [GraphQL global object specification](https://graphql.org/learn/global-object-identification/) as well as tooling for developers to quickly load qids and traverse associations. This can work across network-isolated services so long as there is a global registry somewhere.

**Logs and error messaging** – When searching through logs, you can filter on a qid and see all logs related to that particular entity. Conversely, if you encounter a qid in a log or error message, it’s easy to resolve it to a value using the global lookup.

**Data analytics** – When joining rows from different tables or services, having qid values instead of unqualified values makes it easier to manage and understand the result of complex joins.

**Data validation** – If you know an association is supposed to be to an entity of a particular type, you can parse qids to validate that expectation, even in situations where database-level foreign key constraints are not possible or desired.

**Clearer field and column names** – The term "id" is overloaded. In the past I’ve seen collisions between the GraphQL global "ID" concept and serial primary database IDs, as well as between the IDs of internal systems and external systems. With qids, these can all be separate concepts. An "id" can be an opaque GraphQL-specific concept, while a "qid" means something different and precise in all parts of the system: GraphQL API, database column names, REST API, gRPC, etc.


## Persistence

There are two main persistence options. Qids can be stored in full in a primary key `qid` TEXT-type column in Postgres, or just the UUID part can be stored in isolation in a UUID-type column. The latter may offer better [storage and runtime performance](https://stackoverflow.com/a/44101628), but it requires additional application logic to construct/deconstruct qids from UUIDs. To avoid this complexity, I prefer to use dedicated qid columns and have foreign references also held in columns ending in `_qid`.


## Global look up

Global qid lookup can be implemented with a registry of query services, either gRPC or simply in-memory services within a monolith application.

## Go links

Having go/ links related to qids can be helpful. For example:

* `go/qid/<qid>` - main product page for the entity that end users visit
* `go/q/<qid>` - a raw entity viewer / traversal UI with raw JSON

For development, it’s nice to have versions that resolve to the development URL path (for example, localhost:4000) `go/dqid/<qid>` and `go/dq/<qid>`.
