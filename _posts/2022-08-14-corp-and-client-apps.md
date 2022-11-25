---
title: Corp and client apps
layout: note
tags: ["software patterns", "frontend"]
---

I like having separate applications for external vs internal users, something along the lines of:

```sh
# External-facing ("client") application
https://app.foo.com

# Internal-facing ("corporate") application
https://corp.foo.com
```

## What constitutes an "app"?

All pages within a "app" have a consistent [chrome](https://www.nngroup.com/articles/browser-and-gui-chrome/) (or "UI wrapper"), but different apps can have different chromes. Each app can be implemented in its own codebase, or all apps can be implemented in a single codebase. Within an app, the available pages and menu items may be different for different users based on their permissions and configuration.

## Corp app

With the corp app, teams can move faster with less process when adding new functionality. The client app can be held to a higher bar for product research and design polish.

Within the corp app, I like to maintain a single cohesive navigational structure that is easy for any engineer to extend with a new web page for their project. The web app's surface area is globally namespaced, and a global navigate heirarchy helps remind engineers of this when adding new pages.

Rather than build a third app for contractors or partners, I find it's best to have external contractors use the corp app. This avoids drift in functionality and also gives flexibility in terms of operations work allocation. Authorization rules can be used to limit access to parts of the application and specific pieces of data.

## Client app

The client app is driven by the sales, product, and design teams rather than the engineering teams. Calling it the client app rather than the customer app leave the word "customer" open for use elsewhere in the domain model. Since many domains involve modeling clients' customer data, have a clear separation between a _client_ of our company and a _customer_ of one of our clients adds precision.

## Local development

I like to have both the frontends talking to a backend `api.foo.com` server. But working with this locally is a bit tricky in that it requires a local SSL certificate. A full tutorial is here: [https://web.dev/how-to-use-local-https](https://web.dev/how-to-use-local-https).

I like to register a domain like `dfoo.xyz` for local development. The `d` makes it easier to navigate to the URL with browser type ahead.

As part of the development set up process:

```sh
$ brew install mkcert nss gpg
$ mkcert -install
$ sudo yarn alias-localhost
$ yarn cert
```

In `package.json`:

```js
{
  // ...
  "scripts": {
    // ...
    "alias-localhost": "./scripts/ensure_all_localhost_aliases.sh",
    "cert": "./scripts/ensure_localhost_certs.sh",
  }
}
```

In `scripts/ensure_all_localhost_aliases.sh`:

```sh
#!/bin/zsh

./scripts/ensure_localhost_alias.sh api.dfoo.xyz
./scripts/ensure_localhost_alias.sh app.dfoo.xyz
./scripts/ensure_localhost_alias.sh corp.dfoo.xyz
```

In `scripts/ensure_localhost_alias.sh`:

```sh
#!/bin/zsh

ETC_HOSTS="/etc/hosts"
IP="127.0.0.1"

HOSTNAME=$1

HOST_REGEX="\(\s\+\)${HOSTNAME}\s*$"
HOST_LINE="$(grep -e "${HOST_REGEX}" ${ETC_HOSTS})"

if [ -n "${HOST_LINE}" ]; then
  echo "${HOSTNAME} already exists : ${HOST_LINE}"
else
  echo "Adding ${HOSTNAME} to your ${ETC_HOSTS} (need to be running with sudo)";
  echo -e "${IP}\t${HOSTNAME}" >> ${ETC_HOSTS} || exit 1
  echo -e "${HOSTNAME} was added successfully \n ${HOST_LINE}";
fi
```

In `scripts/ensure_localhost_certs.sh`:

```sh
rm -rf .cert
mkdir -p .cert
mkcert \
  -key-file ./.cert/localhost-key.pem \
  -cert-file ./.cert/localhost-cert.pem \
  corp.dfoo.xyz app.dfoo.xyz api.foo.xyz
```
