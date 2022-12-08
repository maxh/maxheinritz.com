---
title: Precommit hooks
layout: post
tags: ["software patterns"]
---

[Husky](https://typicode.github.io/husky/#/) and [lintstaged](https://github.com/okonet/lint-staged) are indispensable tools for precommit hooks. Here's an example: `.lintstagedrc.json`:

```json
{
  "*.{js,ts,tsx,jsx,json}": "prettier --write"
}
```
