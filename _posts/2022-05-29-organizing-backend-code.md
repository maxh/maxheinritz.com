---
title: Organizing backend code
layout: note
tags: ["software patterns"]
---

I’ve come to prefer a backend codebase structure that involves six top-level directories, arranged in an ordered dependency hierarchy:

- `app/` - high-level stateless code that ties things together but is largely domain-agnostic
- `domain/` - stateful code that is specific to the application domain model
- `system/` - domain-agnostic stateful code for things like revision history, event log, bots
- `gateway/` - API clients for external systems include the database, cache, etc as well as remote APIs
- `common/` - low-level stateless libraries, utilities, and constants
- `isomorphic/` - common code synced to to the frontend

Code in `app/` can depend on all other code; code in `domain/` can depend on anything except `app/`; etc.

Dependency restrictions can be enforced with tools like [eslint's `no-restricted-imports`](https://eslint.org/docs/rules/no-restricted-imports) or [ArchUnit for Java](https://www.archunit.org/).

Let’s walk through these directories in detail, starting from the bottom up.

## Common and isomophic code

I've included these two in the same section because the only difference between them is that isomorphic code gets synced to the frontend repo.

Examples of code in these layers include:

- Pure function utilities for things like string or list manipulation
- Widely used standardized constants such as ISO country codes
- Application-specific constants such as `EntityType` and types such as `Qid`

Common code could be easily bundled up and distributed as packages or libraries via npm, maven, etc. Indeed, reusing open source external packages instead of hand rolling common code is generally the best approach. But in every codebase I’ve worked in, we’ve ended up with some components that are library-like in nature but still specific to our particular application.

Common code is often domain-agnostic, but not always. For example, it might include enums for transportation mode, currency code, etc.

Common and isomorphic code should be stateless and unaware of the dependency-injection system.

## Gateway code

Examples of gateway code include:

- A Redis client
- A Prisma client
- A client for talking to a bank's API
- A observability or logging module that connects to a remote system

Generally these are instantiated in a dependency injection container and available for user throughout the application.

Similar to common code, gateway code is usually but not always domain-agnostic. For example, if you are working on a payments company, you might have a `common/psp-clients` directory that holds client libraries for various payment service providers.

Gateway code is almost always domain-_model_-agnostic. For example, the client libraries for the PSPs should be written in a way that conforms to the external PSP rather than the team's own domain model.

## System code

Examples of system code:

- An entity revision history tracking system
- An event logging system backed by Postgres
- A file upload system
- A email outbox system

The difference between "system" and "common" is stateful vs stateless. When I say "stateful", I mean the component "owns" persistent data store like PostgreSQL, Redis, Elasticsearch.

A Redis client library wrapper would live in "gateway". A durable event system that uses the Redis client library to write messages for consumers to read in our database -- that would be a system-level component.

## Domain code

The contents of the domain directory will vary based on the application problem domain. For example:

- For a restaurant app, it could contain components for managing reservations, menus, order tracking, etc
- For a freight forwarding app, it could contain components for booking management, freight execution, contract and pricing controls, etc
- For a property management app, it could contain components leasing, rent payments, work orders, etc

One way to think about `domain` code is: if a concept is part of your domain model shared with business stakeholders, it should be within the domain directory. If a concept is exposed to end users in the product, it should live within the domain directory. End users do not care about which logging library you use (at the gateway layer) or which web server runner you use (at the app layer). End users do care about the domain concepts they manipulate through the product (at the domain layer).

For this reason, I tend to include in the domain directory any modules responsible for tenants, users, and roles. While these are domain-agnostic in the sense that any software system needs them, they are domain-model-specific in that the behavior of such modules heavily impacts product behavior and is an important part of users' mental models of the system.

## App code

The app directory is the orchestrator of the system. It is like the common directory in that it doesn’t deal directly with domain concepts, but it differs in that it depends on the domain code. Here are some examples of things that live at the app layer:

- Web server entry point that loads web-facing components and starts listening for requests
- Command line utility entry point that loads CLI components and dispatches commands to the relevant components
- An authentication component, perhaps in the form of a token issuer or a session manager
- A GraphQL global node query resolver that can resolve any entity from any part of the domain
- A health check endpoint that verifies the status of different components across the entire system

Unlike the common code, app code cannot simply be copied from one codebase to another. But the parts that reference the domain code can be built in a configurable way that is easy to swap out for other domains.

## Tying it all together

A codebase for a restaurant SaaS application might look something like:

```
app/
  authentication
  entity-lookup
  gql-server
  http-server-entry
  cli-entry

domain/
  reservations
  menu
  orders
  seating-layout
  users
  tenants

system/
  durable-event
  revision-history
  system-bots

gateway/
  db-client
  metrics-client
  s3-client

common/
  string-util
```

These buckets provide the high-level scaffolding for an application, and other techniques for code organization within these buckets merit their own descriptions.
