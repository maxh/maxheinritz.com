---
title: Multiple subdomains
layout: note
tags: ["software patterns", "frontend"]
---

I like having separate applications for external vs internal users. Once scheme is:

```sh
# User-facing application.
https://app.foo.com

# Internal-facing "corporate" application.
https://corp.foo.com
```

Developing against these locally is a bit tricky.