---
title: Bootstrap
layout: note
tags: ["software patterns"]
---

During development and testing, it's useful to be able to quickly spin up a backend application from an empty database. But there are typically some things that need to be persisted in the database for the app to run. These include:

- Persisted enums (such as user roles)
- A "system" tenant
- A "corp" tenant
- Bot users

A bootstrap service can be helpful for this process. Bootstrapping can be performed during integration tests, when new engineers are setting up for the first time, after resetting the database while iterating on migrations, and to bootstrap the production database for the first time.
