---
title: Jest custom matchers
layout: post
tags: ["software patterns"]
---

Jest [custom matchers](https://jestjs.io/docs/expect#expectextendmatchers) make it easy to extend the test framework's functionality. For example, to assert that a value is a QID of a certain type:

```ts
  expect(entity.qid).toBeQid(EntityType.USER);
```

Defining a custom matcher requires a bit of configuration. In, say `backend/jest-setup/custom-matchers.ts`, a file like this:

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

And then in `jest.config.ts`:

```ts
{
  // ...
  setupFilesAfterEnv: ['<rootDir>/jest-setup/custom-matchers.ts'],
}
```

This will make the matchers available in all tests.
