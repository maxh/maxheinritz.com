---
title: Link tokens
layout: post
tags: ["software patterns"]
---

A common web application use case is allowing unauthenticated users to access specific pages for a limited purposes. One example is a password reset form, where a user requests to reset their password and receives a short-lived password reset link. The linked page allows them to reset their password. Other examples include generating a link to share shipment tracking data or payment remittance information with external users who may or may not have accounts.

I think of these kinds of pages as "mini apps", where the tokens in the URL serve as the authentication mechanism in lieu of full user credentials. The tokens for these links can be generated and persisted as "link token" entities on the backend. Each link token includes "info" needed to parameterize the mini-application when the link is clicked.

```
// Tenant constraints (if any) are defined within the info,
// rather than with LinkToken.tenantQid.
model LinkToken {
  qid                String    @id
  createdAt          DateTime  @default(now())
  noLongerValidAfter DateTime?

  // We always store the hashedToken for looking up the token.
  // We optionally store the unhashedToken in cases when we need
  // to be able share a link repeatedly.
  //
  // When possible, say for one-time links, we should only store
  // the hashed token as a security precaution.
  //
  // The unhashed version is embedded in URLs like `tk/<token>`.
  hashedToken   String  @unique @map(name: "hashed_token")
  unhashedToken String? @unique @map(name: "unhashed_token")

  // The type of the token.
  type String

  // JSON data relevant to the token, with a standard
  // structure for a given link token type.
  info Json
}
```

On the frontend, the token is extracted from a URL and passed in a header to the backend. In an authentication middleware, the header is inspected, and a value is set on the `request` object, which can then be used to populate `ctx.linkToken` for service calls and authorization purposes.

What happens if a user is authenticated with a cookie and then clicks a tokenized link? The simplest thing to do is treat `ctx.linkToken` and `ctx.user` as mutually exclusive, with the link token taking precedence.
