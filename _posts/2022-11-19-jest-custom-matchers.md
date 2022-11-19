---
title: Jest custom matchers
layout: note
tags: ["software patterns"]
---

In `backend/jest-setup/custom-matchers.ts`, a file like this:

```ts
import { EntityType } from "src/isomorphic/entity/entity-type";
import { isQidForEntityType } from "src/isomorphic/qid/qid.util";

expect.extend({
  toBeQid(received: string, entityType: EntityType) {
    return isQidForEntityType(received, entityType)
      ? {
          pass: true,
          message: () =>
            `Expected ${received} not to be a valid Qid for ${entityType}`,
        }
      : {
          pass: false,
          message: () =>
            `Expected ${received} to be a valid Qid for ${entityType}`,
        };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeQid(entityType: EntityType): R;
    }
  }
}
```

In `jest.config.ts`:

```ts
{
  // ...
  setupFilesAfterEnv: ['<rootDir>/jest-setup/custom-matchers.ts'],
}
```
