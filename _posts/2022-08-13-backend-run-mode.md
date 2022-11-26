---
title: Backend run mode
layout: post
tags: ["software patterns"]
---

A backend application can be instantiated in different ways:

- Command line interface (CLI)
- Server-only instance in production
- Poller-only instance in production
- A dev instance that both serves and also polls

I call these “backend run modes”, and I like to make them a first-class concept with an enum.

```ts
import { Enum, EnumValue } from "@kejistan/enum";

export const BackendRunMode = Enum({
  // Different flavors of NODE_ENV = 'development'
  DEV_INSTANCE: "DEV_INSTANCE",
  DEV_INSTANCE_INSECURE_BLACK_BOX: "DEV_INSTANCE_INSECURE_BLACK_BOX",
  DEV_REPL: "DEV_REPL",
  DEV_CLI: "DEV_CLI",

  // Different flavors of NODE_ENV = 'production'
  PROD_INSTANCE_SERVER: "PROD_INSTANCE_SERVER",
  PROD_INSTANCE_POLLER: "PROD_INSTANCE_POLLER",
  PROD_TUNNEL_CLI: "PROD_TUNNEL_CLI",
  PROD_TUNNEL_REPL_READ_ONLY: "PROD_TUNNEL_REPL_READ_ONLY",

  // Different flavors of NODE_ENV = 'test'
  TEST_UNIT: "TEST_UNIT",
  TEST_BLACK_BOX: "TEST_BLACK_BOX",
  TEST_INTEGRATION: "TEST_INTEGRATION",
});

export type BackendRunMode = EnumValue<typeof BackendRunMode>;
```

## Configuring the backend run mode

The backend run mode is set by the "runner" file that gets executed first. So for example if a CLI command is initiated like this:

```sh
yarn ts-node src/app/app-cli.runner.ts
```

Then as the first line in that file we’ll have an import like this:

```ts
import "src/common/backend-run-mode/configure-backend-run-mode-cli";
```

Which imports a file that sets the run mode.

```ts
import { BackendRunMode } from "src/common/backend-run-mode/backend-run-mode";

global.BACKEND_RUN_MODE = BackendRunMode.CLI_COMMAND;
```

You may need to adjust `.prettierrc.rs` to ensure that import particular import comes first:

```js
  importOrder: [
    '^src/common/(.*)/configure-(.*)',
    // …
  ],
```

In other cases the run mode might be a function of both (a) the runner file and also (b) some environment variable set by the compute environment.

## Conditional module loading

Some modules are only relevant in specific run modes.

### Poller

When running in poller mode, there’s no need to load the CLI commands, REST controllers, or GraphQL resolvers. We only need the pollers and the core business logic they depend on.

![Backend Running as Poller](/images/posts/backend-running-as-poller.png)

See the [atomic backend modules post](/posts/2022-08-13-atomic-backend-modules.png) for explanation of these submodules.

### Server

Similarly, there's no need to load the pollers when running in server mode:

![Backend Running as Server](/images/posts/backend-running-as-server.png)

### CLI

To further limit dependencies, separate CLI runners can limit to just what's needed for a particular CLI:

```sh
yarn ts-node src/platform/user/cli/user-cli.runner.ts
```

![Backend Running as CLI from user module](/images/posts/backend-running-as-cli-from-user-module.png)

## PlantUML

### Poller

```
@startuml
skinparam map {
  BackgroundColor white
}

skinparam componentStyle rectangle

component "backend running as poller" {
  component poller #LightBlue

  package user {
    component [cli] as cli_user
    component [gql] as gql_user
    component [poll] as poll_user #LightBlue
    component [core] as core_user #LightBlue
    component [rest] as rest_user
  }

  package tenant {
    component [cli] as cli_tenant
    component [gql] as gql_tenant
    component [poll] as poll_tenant #LightBlue
    component [core] as core_tenant #LightBlue
    component [rest] as rest_tenant
  }
}

poller --> poll_user
poller --> poll_tenant

cli_user --> core_user
gql_user --> core_user
poll_user --> core_user
rest_user --> core_user

cli_tenant --> core_tenant

poll_tenant --> core_tenant
rest_tenant --> core_tenant
gql_tenant --> core_tenant

core_user --> core_tenant
@enduml
```

### Server

```
@startuml
skinparam map {
  BackgroundColor white
}

skinparam componentStyle rectangle

component "backend running as server" {
  component server #LightBlue

  package user {
    component [rest] as rest_user #LightBlue
    component [gql] as gql_user #LightBlue
    component [cli] as cli_user
    component [poll] as poll_user
    component [core] as core_user #LightBlue
  }

  package tenant {

    component [rest] as rest_tenant #LightBlue
    component [gql] as gql_tenant #LightBlue
    component [cli] as cli_tenant
    component [poll] as poll_tenant
    component [core] as core_tenant #LightBlue

  }
}


server --> rest_tenant
server --> gql_tenant
server --> rest_user
server --> gql_user

cli_user --> core_user
gql_user --> core_user
poll_user --> core_user
rest_user --> core_user

gql_tenant --> core_tenant
rest_tenant --> core_tenant

cli_tenant --> core_tenant

poll_tenant --> core_tenant


core_user --> core_tenant
@enduml
```

### CLI

```
@startuml
skinparam map {
  BackgroundColor white
}

skinparam componentStyle rectangle

component "backend running as CLI from user module" {

  package user {
    component [rest] as rest_user
    component [gql] as gql_user
    component [cli] as cli_user #LightBlue
    component [poll] as poll_user
    component [core] as core_user #LightBlue
  }

  package tenant {

    component [rest] as rest_tenant
    component [gql] as gql_tenant
    component [cli] as cli_tenant
    component [poll] as poll_tenant
    component [core] as core_tenant #LightBlue

  }
}


rest_user --> core_user
cli_user --> core_user
gql_user --> core_user
poll_user --> core_user


rest_tenant --> core_tenant
cli_tenant --> core_tenant
gql_tenant --> core_tenant
poll_tenant --> core_tenant

core_user --> core_tenant
@enduml
```
