---
title: Organizing application source code
desc: A three-bucket approach for managing complexity
layout: essay
---

I’ve come to prefer a codebase structure that involves three top-level directories, arranged in an ordered dependency hierarchy:

- `app/` - high-level code that ties things together but is largely domain-agnostic
- `domain/` - domain-specific code for the relevant problem domain
- `platform/` - low-level domain-agnostic libraries, utilities, and constants

Code in `app/` can depend on `domain/` and `platform/`. Code in `domain/` can depend on `platform/` but not `app/`. And code in `platform/` cannot depend on anything else.

Dependency restrictions can be enforced with tools such [eslint's `no-restricted-imports`](https://eslint.org/docs/rules/no-restricted-imports) or [ArchUnit for Java](https://www.archunit.org/).

Let’s walk through the three directories in detail, starting from the bottom up.

## Platform code

Examples of platform code include:

- Wrappers around external logging and monitoring libraries
- Pure function utilities for things like string or list manipulation
- An entity revision history tracking system
- Widely used standardized constants such as ISO country codes

One way to think about platform code is: if your startup pivots and you want to start a totally new codebase in a different domain, you should be able to copy over all the platform code without needing to refactor anything.

Another way to think about platform code is: it could be easily bundled up and distributed as packages or libraries on npm, maven, etc. Indeed, reusing open source external packages instead of hand rolling platform code is generally the best approach. But in every codebase I’ve worked on, we’ve ended up with some components that are platform-like in nature (ie domain-agnostic) but still specific to our particular application.

## Domain code

The domain directory will vary based on the use case the application is built for. For example:

- For a restaurant app, it could contain components for managing reservations, menus, order tracking, etc
- For a freight forwarding app, it could contain components for booking management, freight execution, contract and pricing controls, etc
- For a property management app, it could contain components leasing, rent payments, work orders, etc

One way to think about domain code is: if a concept is part of your domain model, it should be within the domain directory. Or said another way, if a concept is exposed to end users in the product, it should live within the domain directory. End users do not care about which logging library you use (at the platform layer) or which web server runner you use (at the app layer). End users do care about the domain concepts they manipulate through the product (at the domain layer).

For this reason, I tend to include in the domain directory any modules responsible for tenants, users, and roles. While on the one hand these modules might be considered domain-agnostic and therefore better fits for the platform directory, the behavior of such modules heavily impacts product behavior and therefore can be considered part of the domain model.

## App code

The app directory is orchestrator of the system. It is spiritually similar to the platform directory in that it doesn’t deal directly with domain concepts, but it differs in that it depends on the domain code. Here are some examples of things that live at the app layer:

- Web server entry point that loads web-facing components and starts listening for requests
- Command line utility entry point that loads CLI components and dispatches commands to the relevant components
- An authentication component, perhaps in the form of a token issuer or a session manager
- A GraphQL global node query resolver that can resolve any entity from any part of the domain
- A health check endpoint that verifies the status of different components across the entire system

Unlike the platform code, app code cannot simply be copied from one codebase to another. But the parts that reference the domain code can be built in a configurable way that is easy to swap out for other domains.

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

platform/
  db-client
  metrics-client
  s3-client
  string-util
```

These three buckets provide the high-level scaffolding for an application, and other techniques for code organization within these buckets merit their own descriptions.
