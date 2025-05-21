---
title: Entity aggregates
layout: post
tags: []
---

An entity aggregate is a set of tightly coupled entities that are updated transactionally. One entity within the aggregate is considered the "aggregate root". For example, an aggregate may comprise `ReceivableInvoice` and `ReceivableInvoiceLineItem` entities, where the former is the root of that aggregate.

## Concept from DDD

The concept comes from domain-driven design, described in the DDD reference:

> It is difficult to guarantee the consistency of changes to objects in a model with complex associations.
> Objects are supposed to maintain their own internal consistent state, but they can be blind-sided by changes in other objects that are conceptually constituent parts.
> Cautious database locking schemes cause multiple users to interfere pointlessly with each other and can make a system unusable.
> Similar issues arise when distributing objects among multiple servers or designing asynchronous transactions.
>
> Therefore:
>
> Cluster the entities and value objects into aggregates and define boundaries around each.
> Choose one entity to be the root of each aggregate, and allow external objects to hold references to the root only (references to internal members passed out for use within a single operation only).
> Define properties and invariants for the aggregate as a whole and give enforcement responsibility to the root or some designated framework mechanism.
>
> Use the same aggregate boundaries to govern transactions and distribution.
>
> Within an aggregate boundary, apply consistency rules synchronously. Across boundaries, handle updates asynchronously.

Eric Evans later clarified his perspective – that when it comes to defining aggregate roots the "external reference holding" is less important than the transaction boundary. For example, it's not a problem for external systems to hold references to line items even though the receivable invoice is the aggregate root.

## Examples

- Ruleset and its rules (for digital representation of a contract).
- Invoice and its line items.
- Shipment and its route.

## Ways in which data can be grouped

How we do we decide which data to consider part of a single entity? How do we decide which entities to group together into single aggregate root? It’s a matter of judgment and satisfying business requirements. There are various dimensions along which data can be grouped, described below.

### Database table

Typically a single entity is stored in a single database table. For example, a `Tenant` entity and all its data can be stored in a `tenant` database table.

But sometimes a single entity is stored in multiple tables. For example, data for a `User` entity could be stored in the `user` table as well as role data in a "supplementary" `user_role` table. The mapping between database tables and entities is done through mappers in the application layer such as `dbUserToDto`.

Whether to split a single entity into multiple database tables is an engineering implementation consideration. For any given entity, all data could be shoved into JSONB columns on one table if we wanted. Benefits of separate tables: stricter schema, uniqueness constraints, easier analytics access. Benefits of one table: performance, colocation.

Database tables should not be queried directly from other domains. Generally service class APIs should be used instead.

### Prisma schema file

Using [Prisma](https://www.prisma.io/), we can define Prisma models in separate `.prisma` files sprinkled throughout the codebase. Generally it is best practice to keep these files narrowly focused on a single domain. Prisma just release preliminary official [support](https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support) for split schemas a few weeks ago, but we've been doing it for years with custom tooling called [prisma-fuse](https://www.npmjs.com/package/prisma-fuse).

`prisma-fuse` allows foreign key constraints between models within the same file but not across models in different files, and unlike the official support, it allows colocating Prisma files with domain directories throughout the codebase.

Models that are not aggregates can be part of the same schema file. This allows using foreign key constraints with cascading deletes for related models.

### Entity

An entity has:

- A single type definition
- A single QID, revisionNumber, revisionCreatedAt
- A single record in revision history table (a serialized data transfer object JSON blob)

### Aggregate

An aggregate has:

- A root entity
- Shared rootRevisionNumber tracking across child entities, which can be used to reconstruct revision history for the aggregate as a whole
- Note: revision history rows do not include the whole aggregate

Over the REST API, the full aggregate is returned by default when the root entity is fetched.

All data within the aggregate can be queried in full directly from other domains for batch data loading. Root entities like shipment and payable invoice can be queried as an “entity” in isolation, without fetching the whole aggregate.
