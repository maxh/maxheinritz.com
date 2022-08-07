---
title: Backend ctx
desc: ctx passed around for backend operation
layout: note
tags: ["software patterns"]
---

I like to have all backend service class methods take a `ctx` parameter, similar to [Go’s context type](https://pkg.go.dev/context).

## Structure

The `ctx` looks like this:

```
export class CtxDto {
  readonly user?: CtxUserDto;
  readonly entryPoint: CtxEntryPoint;
}
```

It contains information about the current user (`ctx.user`) as well as the entry point that triggered the operation (`ctx.entryPoint`). These values are used to check authorization permissions for every operation.

## Name

Calling it `ctx` instead of `context` helps reify the concept as a first-class idea in the application, separate from other notions of context at the language or framework level. It's also fewer characters.

## Usage

Idiomatically `ctx` is passed in as the first parameter:

```
export class FooBarMutateService {
  // ...

  async create(
    ctx: CtxDto,
    createFooBarDto: CreateFooBarDto,
  ): {
    // ...
  }
}
```

The data in `ctx` is also used to populate the `revisionSource` for entity revisions, like this:

```
{
  "revisionSource": {
    "userQid": qid::user:b969be65-8425-46ed-b108-25fbef01ff0e,
    "entryPoint": {
      "root": "cli",
      "runner": "CliSeedCustomerTenant"
    }
  },
}
```
