---
title: Prefixed env vars
layout: note
tags: ["software patterns"]
---

When creating custom environment variables, it's best practice to prefix them in a way that indicates that they are made up. The company name can be used for this purpose. Or some other made up term like "INTERNAL\_":

```
INTERNAL_INITIAL_BOOTSTRAP_USER_PASSWORD
INTERNAL_LOCALHOST_SSL_CERT_PATH
INTERNAL_LOCALHOST_SSL_KEY_PATH
```
