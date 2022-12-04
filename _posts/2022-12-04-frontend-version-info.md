---
title: Frontend version info
layout: post
tags: ["software patterns"]
---

A nice characteristic of web application development is the speed with which changes can be deployed. Best practice for most applications is continuous deployment, where every commit to the `main` branch kick off a new deploy (with some batching).

For backend code, server instances can be updated in a rolling fashion and guaranteed to be updated. For frontend code, however, users may have an old version of the application running in their browser even after a new version deploys. The user has to reload the web application to get the latest version.

For most frontend version changes, this behavior is acceptable. Users generally reload their browsers within a day or two. But for some frontend changes, it would be best if users reloaded right away. To nudge them in this direction, we can show a prompt to reload.

Implementation involves the concept of `frontend-version-info.json` with a explicit app versions. To show the prompt to users with old app versions, bump the explicit version number.

```json
{
  "deployDate": "<deploy-date>",
  "gitShaShort": "<git-sha-short>",
  "corpAppExplicitVersion": 1,
  "clientAppExplicitVersion": 1
}
```
