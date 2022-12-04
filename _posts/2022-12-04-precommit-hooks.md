---
title: Precommit hooks
layout: post
tags: ["software patterns"]
---

Husky and lintstaged are indispensible tools for precommit hooks. Here's an example: `.lintstagedrc.json`

```json
{
  "*.{js,ts,tsx,jsx,json}": "prettier --write"
}
```
