---
title: Object–relational impedance mismatch
layout: post
tags: ["software patterns"]
---

As defined [on Wikipedia](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch):

> The object–relational impedance mismatch is a set of conceptual and technical difficulties that are often encountered when a relational database management system (RDBMS) is being served by an application program (or multiple application programs) written in an object-oriented programming language or style, particularly because objects or class definitions must be mapped to database tables defined by a relational schema.

Let's consider the persistence of users and their roles. In our application code, we want treat roles as property of a user, like this:

```ts
export class UserDto {
  readonly qid: Qid;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role[];
}
```

Where roles are slug-based:

```ts
import { Enum } from "@kejistan/enum";

export const Role = Enum({
  CORP_ADMIN: "CORP_ADMIN",
  CORP_EMPLOYEE: "CORP_EMPLOYEE",
  CLIENT_ADMIN: "CLIENT_ADMIN",
  CLIENT_EMPLOYEE: "CLIENT_EMPLOYEE",
});
```

One way to persist these concepts with three tables, shown here as Prisma models.

```prisma
model User {
  qid       String   @id
  email     String
  firstName String
  lastName  String
  userRoles DbUserRole[]
}

// Persisting roles and referencing them by qid makes
// it easier to rename them. Only one row needs to be
// backfilled, instead of every user and role.
model Role {
  qid       String @id
  slug      String @unique
  userRoles DbUserRole[]
}

// A many-to-many join between users and roles.
model UserRole {
  qid     String @id
  roleQid String
  userQid String
  role    DbRole @relation(fields: [roleQid], references: [qid])
  user    DbUser @relation(fields: [userQid], references: [qid])
  @@unique([roleQid, userQid])
}
```

This design allows us to normalize roles and query users by role. But it involves more complex interactions with the database. For example, here's what the write path may look like:

```ts
// The draft is a draft UserDto, which includes "roles".
// The user database table does not have a "roles" column,
// so we should not include it in our write data. It needs
// special treatment.
const { roles, ...rest } = draft;

// Based on the diff between the draft roles and the current
// roles for this user, we may need to create or delete rows
// in the user_role table.
const { nestedCreate, nestedDeleteMany } =
  await this.userRoleService.getNestedWriteData(ctx, draft.qid, roles);

await this.prisma.dbUser.update({
  data: {
    ...rest,
    userRoles: {
      create: nestedCreate,
      deleteMany: nestedDeleteMany,
    },
  },
});
```

And then on the read path

```ts
const getUser = (qid: Qid) => {
  const userRaw = await this.prisma.dbUser.find({
    where: { qid },
    // We need to include data from related tables.
    include: { userRoles: { include: { role: true } } },
  });
  // We need to map the database type to the DTO.
  return UserDto.from({
    ...raw,
    roles: raw.userRoles.map((r) => r.role.slug),
  });
};
```

This adds quite a bit of overhead. But it allows idiomatic use of relation tables and also domain-focused entity design.

Another use case is supplementary tables for union data. One central shipment table, with info tables for specific modes: FTL, LTL, parcel, etc. I like to suffix these table names with "info" to make it clear they are not entity tables. So for example, you might have:

```
shipment_job
shipment_job_ftl_info
shipment_job_ltl_info
shipment_job_parcel_info
```

Where `ShipmentJobDto` has `jobTypeInfo` property that is a union of the supplementary info data.
