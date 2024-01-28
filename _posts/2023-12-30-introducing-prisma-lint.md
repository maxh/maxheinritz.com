---
title: Introducing prisma-lint
layout: post
tags: ["open source"]
---

A few months ago I released [prisma-lint](https://github.com/loop-payments/prisma-lint), an open source version of a tool we use internally at [Loop](https://loop.com). It's a linter for [Prisma](https://www.prisma.io/) schema files.

## Example

A schema file looks like this:

```prisma
// prisma.schema

model User {
  id String @id @default(uuid())
  firstName String
  lastName String
  emailAddress String
  createdAt DateTime
  tenantId String
  tenant Tenant @relation(fields: [tenantId], references: [qid])
}

model Tenant {
  id String @id @default(uuid())
  name String
  createdAt DateTime
}
```

The linter can enforce style preferences like singular model names (`User` not `Users`) as well as behaviors such as requiring all tables to have a `createdAt` field. Here's an example configuration:

```jsonl
// .prismalintrc.json

{ 
  "model-name-grammatical-number": ["error", { "style": "singular" }],
  "require-field": ["error", { "require": [ "createdAt" ]}]
}
```

The schema file is used to generate database migrations and application-level types. The linter can enforce rules that impact this generated code, such as requiring snake case database table names and a prefix for generated types:

```prisma
model DbUser {
  // ...
  @@map(name: "user")
}

model DbTenant {
  // ...
  @@map(name: "tenant")
}
```

```
{ 
  // ...
  "model-name-mapping-snake-case": ["error", { "trimPrefix": "Db" }],
  "model-name-prefix": ["error", { "prefix": "Db" }],
}
```

One of the more powerful rules is `require-field-index`, which can be configured to require all fields used in relations be indexed.

## Kudos

I was inspired by ESLint (especially for the configuration file schema) as well as RuboCop, which first got me hooked on developing AST-based tooling. The fast iteration cycle and immediate impact is exhilarating.

Shout out to [Jeremy Liberman](https://github.com/MrLeebo) for writing the schema [parser](https://github.com/MrLeebo/prisma-ast) used under the hood. We worked together to expose AST node location data for contextual output: [PR #25](https://github.com/MrLeebo/prisma-ast/pull/25), [PR #26](https://github.com/MrLeebo/prisma-ast/pull/26).

Shout outs also to Sean Nicolay, Shu Liu, and Evan Richards -- co-workers at Loop who wrote the initial internal implementations of a few rules.

## Livestream

The Prisma team asked me to speak about it on their livestream, which you can view [here](https://www.youtube.com/watch?v=t7jsqf0DeNc&t=2250s).

## Follow up

Some of the more fun parts of this project include tooling to automate releases and support for Neovim diagnostics. I may write follow-up posts to go deeper on those. 
