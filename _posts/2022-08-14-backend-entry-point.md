---
title: Backend entry point
layout: note
tags: ["software patterns"]
---

I use the term "entry point" to refer to the action that invoked a particular backend request context. The entry point is set on `ctx.entryPoint` and can be used to write into the entity revision source the details about where a certain database mutation came from.

## Entry point root

The "entry point root" is the type of entrypoint.

```ts
export const CtxEntryPointRoot = Enum({
  BOOTSTRAP: "BOOTSTRAP",
  CLI: "CLI",
  GRAPHQL_MUTATION: "GRAPHQL_MUTATION",
  GRAPHQL_QUERY: "GRAPHQL_QUERY",
  GRAPHQL_SUBSCRIPTION: "GRAPHQL_SUBSCRIPTION",
  GRPC_REQUEST: "GRPC_REQUEST",
  REST_DELETE: "REST_DELETE",
  REST_GET: "REST_GET",
  REST_PATCH: "REST_PATCH",
  REST_POST: "REST_POST",
  REST_PUT: "REST_PUT",
  EVENT_HANDLER: "EVENT_HANDLER",
  INTEGRATION_TEST: "INTEGRATION_TEST",
  POLLER: "POLLER",
});
```

## Entry point

The entry point itself includes the root and request-specific information about the method or endpoint.

```ts
import { CtxEntryPointRoot } from "src/common/util/ctx/entry-point-root";

export type CtxEntryPoint =
  | CtxBootstrapEntryPoint
  | CtxCliEntryPoint
  | CtxEventHandlerEntryPoint
  | CtxGraphQLEntryPoint
  | CtxGrpcEntryPoint
  | CtxRestEntryPoint
  | CtxIntegrationTestEntryPoint
  | CtxPollerEntryPoint;

export type CtxBootstrapEntryPoint = {
  root: typeof CtxEntryPointRoot.BOOTSTRAP;
};

export type CtxCliEntryPoint = {
  root: typeof CtxEntryPointRoot.CLI;
  runner: string;
};

export type CtxGraphQLEntryPoint = {
  root:
    | typeof CtxEntryPointRoot.GRAPHQL_MUTATION
    | typeof CtxEntryPointRoot.GRAPHQL_QUERY
    | typeof CtxEntryPointRoot.GRAPHQL_SUBSCRIPTION;
  operationName: string | null;
};

export type CtxGrpcEntryPoint = {
  root: typeof CtxEntryPointRoot.GRPC_REQUEST;
  method: string;
};

export type CtxRestEntryPoint = {
  root:
    | typeof CtxEntryPointRoot.Rest_DELETE
    | typeof CtxEntryPointRoot.Rest_GET
    | typeof CtxEntryPointRoot.Rest_PATCH
    | typeof CtxEntryPointRoot.Rest_POST
    | typeof CtxEntryPointRoot.Rest_PUT;
  endpoint: string;
};

export type CtxIntegrationTestEntryPoint = {
  root: typeof CtxEntryPointRoot.INTEGRATION_TEST;
};

export type CtxPollerEntryPoint = {
  root: typeof CtxEntryPointRoot.POLLER;
  poller: string;
};

export type CtxEventHandlerEntryPoint = {
  root: typeof CtxEntryPointRoot.EVENT_HANDLER;
  eventHandler: string;
  eventType: string;
  consumerKey: string;
};
```

## In the revision source

The entry point appears alongside user information in a database row's revision source.

```json
{
  "userQid": "qid::user:761034c0-3395-49b4-95a9-5deb2be19345",
  "entryPoint": {
    "root": "GRAPHQL_MUTATION",
    "operationName": "createUser"
  }
}
```

## Hypernit

The term is "entry point" (two words) not "entrypoint" (one word).
