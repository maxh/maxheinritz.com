---
title: Corp and customer apps
layout: note
tags: ["software patterns", "frontend"]
---

I like having separate applications for external vs internal users, something along the lines of:

```sh
# External-facing ("customer") application.
https://app.foo.com

# Internal-facing ("corporate") application.
https://corp.foo.com
```

With the corp app, teams can move faster with less process when adding new functionality. The customer app can be held to a higher bar for product research and design polish.

Within the corp app, I like to maintain a single cohesive navigational structure that is easy for any engineer to extend with a new web page for their project. The web app's surface area is globally namespaced, and a global navigate heirarchy helps remind engineers of this when adding new pages.

Rather than build a third app for contractors or partners, I find it's best to have external contractors use the corp app. This avoids drift in functionality and also gives flexibility in terms of operations work allocation. Authorization rules can be used to limit access to parts of the application and specific pieces of data.

## Local development

I like to have both the frontends talking to a backend `api.foo.com` server. But working with this locally is a bit tricky in that it requires a local SSL certificate. A full tutorial is here: [https://web.dev/how-to-use-local-https](https://web.dev/how-to-use-local-https).

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
  corp.dloop.xyz app.dloop.xyz api.foo.xyz
```
