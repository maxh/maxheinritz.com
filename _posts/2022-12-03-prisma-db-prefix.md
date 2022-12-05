---
title: Prefixing Prisma models with Db
layout: post
tags: ["software patterns"]
---

Prisma's TypeScript type generation is a game-changer for type-safe database interactions. However, I dislike using these generated types when writing core business logic.

I prefer to write business logic with simpler serializable domain entities. There are a few reasons for this. Sometimes the idiomatic domain model entity representation differs from the idiomatic relational tables. Using a serializable entity independent of the persistence mechanism also leaves open the possibility of introducing RPC boundaries across services.

It's nice to make it clear in naming that the Prisma-generated types are tightly coupled to the database and should be avoided in business logic. You can prefix model names with `Db` and manually define a simple table name:

```
model DbTenant {
  qid        String @id
  name       String @unique
  tenantType String @map(name: "tenant_type")
  @@map(name: "tenant")
}
```
