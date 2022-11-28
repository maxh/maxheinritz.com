---
title: Prefixed env vars
layout: post
tags: ["software patterns"]
---

When creating custom environment variables, it's best practice to prefix them in a way that indicates that they are made up. The company name can be used for this purpose. Or some other made up term like "INTERNAL\_":

```
INTERNAL_INITIAL_BOOTSTRAP_USER_PASSWORD
INTERNAL_LOCALHOST_SSL_CERT_PATH
INTERNAL_LOCALHOST_SSL_KEY_PATH
```

This helps avoid collisions with env vars expected by other libraries and tools [such as Datadog](https://docs.datadoghq.com/agent/guide/environment-variables/):

```
DD_CONTAINER_INCLUDE
DD_CONTAINER_ENV_AS_TAGS
```

Or the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html):

```
AWS_ACCESS_KEY_ID
AWS_CA_BUNDLE
```

Notice that they follow a standard prefixing pattern of their own.
