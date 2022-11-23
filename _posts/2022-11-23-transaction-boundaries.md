---
title: Transaction boundaries
layout: note
tags: ["software patterns"]
---

Database transactions are useful for making an atomic update that writes multiple pieces of data. The _transaction boundary_ refers to the borders of the transaction -- where it begins and ends.

Complex business operations may be implemented with one or multiple database transactions. Therefore a question arises during implementation as to where to place transaction boundaries.

## Narrow transaction boundaries

To keep a system modular, I find it's best to limit the scope of transaction boundaries to the narrowest boundary allowed by business requirements. If two pieces of data do not need to be written in a single transaction, they shouldn't be, especially across domains.

This leaves open the option of pulling out separate microservices for each domain by changing in-memory service calls to gRPC methods, without refactoring transaction boundaries. Broadly, I think of query and mutate services as placeholder microservice boundaries that we may actually want to split into microservices someday to scale.

## Use cases for database transactions with wide boundaries

Certainly, there is a place for transactions that span multiple tables. These are valid use cases:

- For a single entity: updating the entity table, publishing an event to an outbox table, creating a revision row in a revision history table.
- For multiple entities of the same type: batch writes of the same use case, for performance reasons.
- For highly coupled entities within the same domain: writes across multiple tables. For example, to handle invoice correction writes may need to be made into several tables: `invoice`, `invoice_line_item`, and `invoice_correction`. I tend to be wary of the long-term maintenance burden of these kinds of coupled entities, but in some cases, as in the correction case, the business requirement dictate atomic writes across all these tables at once and it should be implemented as such.

In all these cases, I prefer the raw database operations that can be coalesced into a single transaction are exposed only by:

- Private class methods on public services
- Private services that are not exported by the module

This will prevent cross-domain transactions across service boundaries.
