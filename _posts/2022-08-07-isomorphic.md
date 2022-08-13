---
title: Isomorphic JavaScript
desc: Sharing code across environments
layout: note
tags: ["software patterns"]
---

The term "isomorphic" is used to describe JavaScript code that is shared across frontend and backend, as described in [this Airbnb blog post](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc).

## Use cases

Generally, I prefer decoupling frontend and backend such that all they need to share is the GraphQL schema. This makes the interface explicit. But I've found two scenarios where sharing code outside of the GraphQL schema can be particularly powerful:

1. Global enums like user roles and entity types
2. Pure functions for things like money manipulation and qid parsing

While GraphQL does include enums, they are generated for use in code only in the context of queries and fragments. Some enums are useful outside those contexts. For example, safely generating a qid from a uuid in a path like `organizations/<uuid>` or determining visible menu items based on a user's roles.

For shared types qids and money, having a single set of well-tested pure function utilities can be nice to avoid duplicating code.

## Repo options

There are a few options for where isomorphic code lives in relation to the rest of the frontend and backend code.

1. In a single directory in a monorepo.
2. In its own repository, for example with three separate repositories: `frontend`, `backend`, `isomorphic`.
3. In a special directory within the `backend` repo.

## Build options

A related but distinct mechanism is how the code gets built into the deployed apps:

1. Directly import files and incorporate them into the frontend and backend builds. This is possible with option 1 for frontend and backend and option 3 for the backend only.
2. Publish `isomorphic` as an NPM package and depend on it from `frontend` and `backend`.
3. Copy the code verbatim wherever it's needed.

## My preference

I like having the code live in the backend repo and get built directly into the backend app. Then copy the isomorphic directory into the frontend repo.

This keeps the development loop tight on the backend (ons PR can update both the backend code and isomorphic at once) and minimizes the overhead of needing bump the version and `yarn install` on every change.

## Copying isomorphic code from backend to frontend

A simple script to copy from backend repo to frontend repo:

```
#!/bin/bash
# Set globstar
shopt -s globstar

read -r -d '' header << EOM
// DO NOT EDIT
// This file was synced from backend/src/isomorphic.
// Make any desired changes in the backend repo.
// See http://go/isomorphic for details.
EOM

# Copy all the backend files to tmp.
rm -rf backend/tmp/isomorphic
mkdir -p backend/tmp
mkdir -p backend/tmp/isomorphic
cp -r backend/src/isomorphic backend/tmp

# Within backend, uses globstar to search src/isomorphic and all subdirectories for any .ts files to iterate
for i in backend/tmp/isomorphic/**/*.ts;
# Check that $i is a file, then uses printf to add 3 predefined lines at the beginning of the file
do [ -f "$i" ] && echo "$header" > backend/tmp/isomorphic-scratch.ts
# Add the contents of the file to the scratch file.
cat "$i" >> backend/tmp/isomorphic-scratch.ts
# Write the file to tmp.
mv backend/tmp/isomorphic-scratch.ts "$i"
done

# Copy all the tmp files to the frontend.
rm -rf frontend/src/isomorphic
cp -r backend/tmp/isomorphic frontend/src

# Clean up.
rm -rf backend/tmp/isomorphic
rm -rf backend/tmp/isomorphic-scratch.ts
```

Inside the frontend `package.json` script:

```
  "copy-isomorphic": "cd .. && ./backend/scripts/copy_isomorphic_code.sh",
```

## Syncing with Github actions

It's possible to automate the copying of isomorphic code using a Github Action:

```
name: Isomorphic Sync
on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - 'src/isomorphic/**'

concurrency:
  group: isomorphic-sync
jobs:
  open-pr-for-schema:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Backend
        uses: actions/checkout@v2.3.5
        with:
          path: backend

      - name: Checkout Frontend
        uses: actions/checkout@v2.3.5
        with:
          path: frontend
          repository: foo/frontend
          # Using a Personal Access Token here is required to trigger workflows on our new commit.
          # The default GitHub token doesn't trigger any workflows.
          # See: https://github.community/t/push-from-action-does-not-trigger-subsequent-action/16854/2
          token: ${{ secrets.FOO_BOT_ISOMORPHIC_SYNC_PAT }}

      - name: copy_isomorphic_code
        run: backend/scripts/copy_isomorphic_code.sh

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4.0.2
        with:
          path: frontend
          token: ${{ secrets.FOO_BOT_ISOMORPHIC_SYNC_PAT }}
          commit-message: Sync src/isomorphic to ${{ github.sha }}
          committer: foo-bot <bot+github@foo.com>
          author: foo-bot <bot+github@foo.com>
          branch: foo-bot/isomorphic-sync
          delete-branch: true
          title: Sync src/isomorphic from ${{ github.repository }}
          body: |
            Copying isomorphic code from ${{ github.server_url }}/${{ github.repository }}/commit/${{ github.sha }}
          labels: automated
```
