---
title: Entity type
layout: note
tags: ["software patterns"]
---

As described in the [domain-driven design post](https://maxheinritz.com/posts/domain-driven-design.html), I think it's best for startups to have a single domain model with a global entity namespace for as long as possible. A shared global entity type enum helps with this.

## Enum

```ts
import { Enum, EnumValue } from "@kejistan/enum";

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

```ts
// https://corp.foo.com/artifacts/28d48a10-33b8-4bfa-a48e-d31e92442609
const params = useParams();
const userUuid = params.userUuid;
const qid = qidFromUuid(EntityType.ARTIFACT, nullthrows(userUuid));
```
