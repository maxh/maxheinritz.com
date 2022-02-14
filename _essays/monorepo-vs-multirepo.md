---
title: Monorepo vs multi-repo
layout: essay
---

Most Google engineers share a monorepo called `google3`. When I worked there in the early 2010s, it was a pleasure to develop in the monorepo environment, and I'm sure it's only gotten better. Google invests heavily in custom tooling for code search, file ownership, version control, testing, commit queue, code review, linting, etc. The code must flow.

So naturally in my jobs outside of Google I was inclined to follow the monorepo approach. But I've come to appreciate that most tooling outside of Google is built for multi-repo projects, and it's best to embrace rather than fight the tooling. Here are some examples:

- User permissions on GitHub can be set a repo level but not at a sub-repo level.
- Many projects for a single configuration at the project root, examples include Relay, Jest, ESLint, etc.
- Both local and remote Git operations start to slow down on large repos.
- CI/CD and flaky test management becomes unmanageable in large repositories without custom tooling like Google's.
- Code ownership across teams becomes unwieldy in large code bases.
- Dependency management can be enforced more easily with separate repositories.

For future projects, I'm inclined towards:

- One frontend codebase
- A backend codebase per backend network-isolated service (but limit the number of services)
- A shared library codebase (for TypeScript frontend/backend codebases)

The separate code bases are also a nice reminder about breaking changes -- backend changes to add new API features should be merged _and deployed_ before the frontend changes that use the new features are merged.

