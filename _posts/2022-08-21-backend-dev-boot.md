---
title: Backend dev boot
layout: note
tags: ["software patterns"]
---

```js
{
  "dev": "scripts/dev.sh",
  "build:generated": "mkdir -p dist/generated && cp -r generated dist/",
}
```

Where `scripts/dev.sh`:

```sh
#!/bin/sh

scripts/kill_port.sh 3000
yarn build:generated
scripts/ping_docker_services.sh
NODE_ENV=development nest start --watch
```

Where `scripts/kill_port.sh`:

```sh
#!/bin/sh

echo "Killing any existing service running on port $1..."
lsof -ti:$1 | xargs kill -9
```

Where `scripts/ping_docker_services.sh`:

```sh
#!/bin/sh

echo 'Checking that Docker services are reachable...'

if curl localhost:9200 2>&1 | grep -q 'Failed to connect to localhost'; then
  echo 'Elasticsearch is not reachable. Is Docker running?' && exit 1
fi

# https://stackoverflow.com/a/33246275
if echo PING | nc localhost 6379 2>&1 | grep -q 'Failed to connect to localhost'; then
  echo 'Redis is not reachable. Is Docker running?' && exit 1
fi

if curl localhost:5432 2>&1 | grep -q 'Failed to connect to localhost'; then
  echo 'PostgreSQL is not reachable. Is Docker running?' && exit 1
fi

```
