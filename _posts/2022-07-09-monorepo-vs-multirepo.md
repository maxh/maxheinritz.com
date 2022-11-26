---
title: Monorepo vs multi-repo
desc: Monorepo vs multi-repo
layout: post
tags: ["software patterns"]
---

Most Google engineers operate in a monorepo called `google3`. It was a joy to work there in the early 2010s, and I've heard that the tooling keeps getting better. Google invests heavily in the developer experience for code search, file ownership, version control, testing, commit queue, code review, linting, etc. The code must flow.

So naturally, I have been inclined to follow the monorepo approach at later jobs and recapture that magic. But over time I've come to appreciate that most tooling outside of Google is built for multi-repo projects, and it's best to embrace rather than fight the tooling. Here are some examples:

- Many libraries expect a single configuration at the project root. Examples include Relay, Jest, ESLint, etc. If you have web code, mobile code, and backend code in the same repo, this can get a bit messy.
- Git operations start to slow down on large repos. This includes both remote operations (push, pull) and local operations (commit).
- JetBrains IDE autocompletion scales well but behaves best when the open files are well-scoped to say, one backend service or one frontend. The export namespace is global.
- User permissions on GitHub can be set a repo level but not at a sub-repo level.
- CI/CD and flaky test management can become unmanageable in large repositories without custom tooling. It sucks to have to wait 10 minutes for all the backend integration tests to run when you just need to fix a frontend label.
- Culturally, code ownership and dependency management can become unwieldy in large code bases.

For future projects, I'm inclined towards:

- One frontend codebase
- A backend codebase per backend network-isolated service (but limit the number of services)
- A shared library codebase (for TypeScript frontend/backend codebases)

The separate code bases are also a nice reminder about breaking changes -- backend changes to add new API features should be merged _and deployed_ before the frontend changes that use the new features are merged.

## Repository naming

I'm inclined toward a repository naming pattern that omits the name of the company itself. Just call the repos `backend` and `frontend`. It's easy to change the company name without needing to rename the repos or change the configuration.
