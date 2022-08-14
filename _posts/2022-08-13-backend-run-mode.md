---
title: Backend run mode
layout: note
tags: ["software patterns"]
---

A backend codebase be run in different ways:

- Command line interface (CLI)
- API server
- Pollers
- Long-running async jobs

I call these “backend run modes”, and I like to make this a first-class concept with an enum:

```ts
import { Enum, EnumValue } from "@kejistan/enum";

export const BackendRunMode = Enum({
  // The backend is running in a long-lived capacity as an API server, responding
  // to HTTP requests for the GraphQL or REST APIs.
  SERVER: "SERVER",

  // The backend is running in a short-lived capacity to execute a CLI command
  // triggered by an engineer.
  CLI: "CLI",

  // The backend is running in a long-lived capacity as a poller, with
  // setInterval() calls triggering various pollers to run periodically.
  POLLER: "POLLER",
});

export type BackendRunMode = EnumValue<typeof BackendRunMode>;
```

## Configuring the backend run mode

The backend run mode is set by the “runner” file that gets executed first. So for example if a CLI command is initiated like this:

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

global.__BACKEND_RUN_MODE__ = BackendRunMode.CLI_COMMAND;
```

You may need to adjust `.prettierrc.rs` to ensure that import particular import comes first:

```js
  importOrder: [
    '^src/common/(.*)/configure-(.*)',
    // …
  ],
```

In other cases the run mode might be a function of both (a) the runner file and also (b) some environment variable set by the compute environment.

## Module dependencies

Some modules are only relevant in specific run modes.

For example, there’s no need to load the CLI commands, REST controllers, or GraphQL resolvers when running in poller mode. We only need the pollers and the core business logic they depend on:

![Backend Running as Poller](/images/posts/backend-running-as-poller.png)

See the [atomic backend modules post](/posts/2022-08-13-atomic-backend-modules.png) for explanation of these submodules.

And there's no need to load the pollers when running in server mode:

![Backend Running as Server](/images/posts/backend-running-as-server.png)

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

  component user {
    component [cli] as cli_user
    component [gql] as gql_user
    component [poll] as poll_user #LightBlue
    component [core] as core_user #LightBlue
    component [rest] as rest_user
  }

  component tenant {
    component [cli] as cli_tenant
    component [gql] as gql_tenant
    component [poll] as poll_tenant #LightBlue
    component [core] as core_tenant #LightBlue
    component [rest] as rest_tenant
  }
}

poller --> poll_user
poller --> poll_tenant

cli_user ---> core_user
gql_user ---> core_user
poll_user ---> core_user
rest_user --> core_user

cli_tenant ---> core_tenant
gql_tenant ---> core_tenant
poll_tenant ---> core_tenant
rest_tenant --> core_tenant
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

  component user {
    component [rest] as rest_user #LightBlue
    component [gql] as gql_user #LightBlue
    component [cli] as cli_user
    component [poll] as poll_user
    component [core] as core_user #LightBlue
  }

  component tenant {

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

rest_user --> core_user
cli_user ---> core_user
gql_user ---> core_user
poll_user ---> core_user


rest_tenant --> core_tenant
cli_tenant ---> core_tenant
gql_tenant ---> core_tenant
poll_tenant ---> core_tenant
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

  component user {
    component root #LightBlue
    component [rest] as rest_user
    component [gql] as gql_user
    component [cli] as cli_user #LightBlue
    component [poll] as poll_user
    component [core] as core_user #LightBlue
  }

  component tenant {

    component [rest] as rest_tenant
    component [gql] as gql_tenant
    component [cli] as cli_tenant
    component [poll] as poll_tenant
    component [core] as core_tenant #LightBlue

  }
}


root --> cli_user

rest_user --> core_user
cli_user ---> core_user
gql_user ---> core_user
poll_user ---> core_user


rest_tenant --> core_tenant
cli_tenant ---> core_tenant
gql_tenant ---> core_tenant
poll_tenant ---> core_tenant

core_user ---> core_tenant
@enduml
```
