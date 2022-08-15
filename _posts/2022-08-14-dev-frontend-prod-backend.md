---
title: Dev frontend with prod backend
layout: note
tags: ["software patterns", "frontend"]
---

During frontend development, it's powerful to be able to connect directly to the production backend. For example:

```
# dev frontend
https://app.dfoo.xyz:3000

# use a button in the dev frontend UI
# to toggle between either:

# (1) dev backend
https://api.dfoo.xyz:3000

# or (2) prod backend
https://api.foo.com
```

## Use cases

- **Developing against higher volumes of data.** In the dev environment you might seed a few fake entities, but in production you can see how pagination behaves real-world entity counts.
- **Developing against specific shapes of data.** Some production data may be difficult to replicate in the backend dev environment. With a dev frontend talking to a prod backend, you can just load up the relevant page and iterate directly on the behavior. This has been useful for me to test the rendering for unusual PDFs, for example.
- **Manually testing a multi-step workflow.** Ideally, the backend dev environment supports faking data needed to complete full workflows throughout the app. But sometimes this is not feasible, and running through a workflow against a prod demo or dev tenant using a dev frontend is a good way fallback.

## Using cookies

If you are logged in with a cookie-based session on the prod frontend, then a cookie set there can be sent by the browser even when requests are made from the dev frontend at a different URL -- so long as [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) is set to `None`.

## Security

The permissions and security of the production backend still apply when using the dev frontend. The developer is logged in as their production user and has the same permissions with the dev frontend as they would have with prod frontend.

## Implementation

### Frontend

The frontend implementation involves React Context:

```tsx
import { noop } from "lodash";
import { createContext } from "react";

export const BackendUrlContext = createContext<{
  backendUrl: string | undefined;
  setBackendUrl: (backendUrl: string) => void;
  checkBackendUrl: () => void;
  // True if dev frontend talking to prod backend
  // or prod frontend talking to dev backend.
  isOtherEnvBackendUrl: boolean;
}>({
  backendUrl: undefined,
  setBackendUrl: noop,
  checkBackendUrl: noop,
  isOtherEnvBackendUrl: false,
});
```

And a React provider.

```tsx
import { ReactNode, useEffect, useState } from "react";

import {
  DEFAULT_BACKEND_URL_FOR_FRONTEND_ENV,
  PROD_BACKEND_URL,
} from "src/common/constants/backend-url";
import { readCookie, writeCookie } from "src/common/cookie/cookie";
import { AppCookieName } from "src/common/cookie/cookie.registry";
import { isProdFrontend } from "src/common/util/env.util";

import { BackendUrlContext } from "./BackendUrlContext";

const BackendUrlProvider = ({ children }: { children: ReactNode }) => {
  const [backendUrl, setBackendUrlImpl] = useState<string | undefined>(
    isProdFrontend() ? PROD_BACKEND_URL : undefined
  );

  const setBackendUrl = async (backendUrl: string) => {
    await writeCookie(AppCookieName.BACKEND_URL, { backendUrl });
    setBackendUrlImpl(backendUrl);
  };

  const checkBackendUrl = async () => {
    const wrapper = await readCookie(AppCookieName.BACKEND_URL);
    const backendUrl =
      wrapper?.backendUrl || DEFAULT_BACKEND_URL_FOR_FRONTEND_ENV;
    setBackendUrlImpl(backendUrl);
  };

  // Check the backend URL immediately upon page load.
  useEffect(() => {
    checkBackendUrl();
  }, []);

  if (!backendUrl) {
    // Wait until the backend URL is set before loading the app.
    return null;
  }

  const isOtherEnvBackendUrl =
    backendUrl !== DEFAULT_BACKEND_URL_FOR_FRONTEND_ENV;

  return (
    <BackendUrlContext.Provider
      value={{
        backendUrl,
        setBackendUrl,
        checkBackendUrl,
        isOtherEnvBackendUrl,
      }}
    >
      {children}
    </BackendUrlContext.Provider>
  );
};

export default BackendUrlProvider;
```

Then when building the Relay or Apollo environment, the context can be used to initialize the network to use that particular backend.

```ts
// ...
const { backendUrl } = useContext(BackendUrlContext);
// ...use the backendUrl to configure the GraphQL client.
```

### Backend

The thing to watch out for on the backend is that cookies need to be HTTPS and have `sameSite: 'none'`.

```ts
{
  // We need "none" because the frontends make requests to api.* from
  // different domains.
  sameSite: 'none',
}
```
