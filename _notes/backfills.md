---
title: Backfills
desc: A pattern for changing production data
layout: note
---

Backfills are scripts run via the command line that change data in the production database. Backfills should be idempotent. There are two kinds of backfills:

- One-off backfills - intended to be run once (example: fix a data quality in a particular table)
- Repeat backfills - intended to be executed multiple times (example: persist the roles in role.registry.ts to the database – we need to run this each time we add a new role)

Ideally backfills use service class methods rather than directly editing the database so that authorization, revision history, and logging codepaths are triggered consistently. But if they need to directly read/write from the database, that can be ok sometimes, especially for one-off backfills.
