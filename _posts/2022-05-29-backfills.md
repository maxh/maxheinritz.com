---
title: Backfills
desc: A pattern for changing production data
layout: post
tags: ["software patterns"]
---

Backfills are scripts run via the command line that change production data. Backfills should be idempotent. There are two kinds of backfills:

- One-off backfills - Intended to be run once (example: fix a data quality issue in a particular table). Generally these should be prefixed by date, with old ones deleted periodically.
- Repeat backfills - Intended to be run multiple times (example: persist the roles defined in code in role.registry.ts to the database – we need to run this each time we add a new role).

Ideally backfills use service class methods rather than directly editing database data so that authorization, revision history, and logging codepaths are triggered consistently. But if they need to directly read/write from the database, that can be ok sometimes, especially for one-off backfills.

It's nice to be able to generate boilerplate for backfills. A good tool for this is [Hygen](https://www.hygen.io):

For example with a `package.json` script like this:

```
  "gen:backfill:one-off": "HYGEN_TMPLS=src/app/backfill/templates hygen backfill new --type one-off",
```

We can run `yarn gen:backfill:one-off my-one-off-backfill` to generate a file like this:

```
.../cli-backfill-2022-07-06-my-one-off-backfill.ts
```
