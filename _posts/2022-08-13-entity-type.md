---
title: Entity type
layout: note
tags: ["software patterns"]
---

As described in the [Domain-driven design post](https://maxheinritz.com/posts/domain-driven-design.html), I think it's best for startups to have a single domain model with a global entity namespace for as long as possible. A shared global entity type enum helps with this.

## Motivation

As the company grows and engineers focus more narrowly on specific subsystems, it can be hard for to keep the perspective of a single domain model. It's not so much that we want everyone to understand everything -- it's more that we want to avoid egregrious collisions in terminology that would cripple collaboration and iteration in the future.

For example, the team working on "payable invoices" should be aware of the team working on "receivable invoices" and avoid overlapping terminology except when explicitly agreed upon, even if they don't fully understand the internals of each other's code. If we later realize there's some component that needs to interact with both of these subsystems, it can do so directly on top of the shared domain model without needing to build an adapter to deal with overlapping/inconsistent terminology.

## Enum

To help keep these perspective in mind, I like having a global enum like this:

```ts
import { Enum, EnumValue } from "@kejistan/enum";

/**
 * We have a global namespace for entities in our system.
 *
 * This namespace is used for Prisma models / database tables, GraphQL types,
 * qid entity types, etc.
 *
 * Please name your entities in a way that avoid global ambiguity. For example,
 * we have "payable invoice" instead of "invoice" to allow the possibility of
 * a "receivable invoice" in the near future.
 */
export const EntityType = Enum({
  ADDRESS: "ADDRESS",
  ARTIFACT: "ARTIFACT",
  // ...
  TENANT: "TENANT",
  USER: "USER",
});
```

## Use cases

Generating qids:

```ts
const qid = generateQid(EntityType.ARTIFACT);
```

Validating qids in DTOs:

```ts
class ArtifactDto {
  @Expose()
  @IsQid(EntityType.ARTIFACT);
  qid: Qid;

  // ...
}
```

Asserting qid inputs:

```ts
const qid = assertQidForEntityType(str, EntityType.ORGANIZATION_NAME_ALIAS);
```

Matching in tests:

```ts
expect(paymentDto.qid).toBeQid(EntityType.PAYMENT);
```

Constructing qids from uuids in URLs:

https://corp.foo.com/artifacts/28d48a10-33b8-4bfa-a48e-d31e92442609

```ts
const params = useParams();
const userUuid = params.userUuid;
const qid = qidFromUuid(EntityType.ARTIFACT, nullthrows(userUuid));
```
