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
  API_SERVER: "API_SERVER",

  // The backend is running in a short-lived capacity to execute a CLI command
  // triggered by an engineer.
  CLI_COMMAND: "CLI_COMMAND",

  // The backend is running in a long-lived capacity as a poller, with
  // setInterval() calls triggering various pollers to run periodically.
  POLLER: "POLLER",
});

export type BackendRunMode = EnumValue<typeof BackendRunMode>;
```

## Module dependencies

Some modules and services are necessary regardless of the run mode: database client, user service, tenant service, etc.

Some modules may only be relevant in specific run modes. For example, there’s no need to load all the REST controllers and GraphQL resolvers when executing a CLI command.

To improve loading times, some modules can only be loaded or initialized in certain run modes.

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
