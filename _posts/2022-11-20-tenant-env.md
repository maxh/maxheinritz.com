---
title: Tenant env
layout: note
tags: ["software patterns"]
---

The tenant environment is a way to isolate data within a tenant for testing. Some tables like users and roles are always "LIVE", while other tables like shipments and invoices can be operated against in either "LIVE" or "TEST" environments. Each tenant-owned table should have a `tenant_env` column specifying its tenant. Each `ctx` defines its `tenantEnv`. Authorization rules based on `ctx` limit access to data within one tenant env at a time.

```ts
import { Enum, EnumValue } from "@kejistan/enum";

export const TenantEnv = Enum({
  LIVE: "LIVE",
  TEST: "TEST",
});

export type TenantEnv = EnumValue<typeof TenantEnv>;
```
