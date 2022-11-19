---
title: Tenant type
layout: note
tags: ["software patterns"]
---

It can be useful to think in terms of tenant types. This makes it easy to filter out some tenant data during reporting and analytics. The value can be stored in a `tenant_type` column on the `tenant` database table.

```ts
import { Enum, EnumValue } from "@kejistan/enum";

/**
 * The type of tenant. This is a fixed attribute of a tenant.
 */
export const TenantType = Enum({
  /**
   * The corporate tenant.
   * There is only one tenant of this type.
   * Users in this tenant have CORP_ roles.
   * This tenant type only supports TenantEnv.LIVE.
   */
  CORP: "CORP",

  /**
   * A client tenant.
   * There are many tenants of this type.
   * Users in these tenants have CUSTOMER_ roles.
   * Users in these tenants should have real emails and secure passwords.
   * This tenant type supports all TenantEnvs.
   */
  CLIENT: "CLIENT",

  /**
   * A demo tenant.
   * There are many tenants of this type.
   * Users in these tenants have CUSTOMER_ roles.
   * Users in these tenants may have fake emails and simple passwords.
   * This tenant type only supports TenantEnv.FAKE.
   */
  DEMO: "DEMO",

  /**
   * A tenant created for internal use cases.
   * There are many tenants of this type.
   * There are no users in these tenants.
   * Only corp users may interact with these tenants, and they
   * do so by scoping.
   * This tenant type supports all TenantEnvs.
   */
  INTERNAL: "INTERNAL",

  /**
   * The system tenant.
   * There is only one tenant of this type.
   * Users in this tenant have SYSTEM_ roles (ie bots).
   * This tenant is not used in the tenant_qid column on any table other
   * than user, so TenantEnv is not supported for it.
   */
  SYSTEM: "SYSTEM",
});

export type TenantType = EnumValue<typeof TenantType>;
```
