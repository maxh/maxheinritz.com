---
title: go links and wiki
desc: A simple approach to documentation
layout: essay
---

I like using go links and internal wikis. I was first introduced to these at Google and have advocated for their use at the startups I've joined. The best externally available solutions I've found so far are [golinks.io](https://www.golinks.io) (free) and [Atlassian Confluence](https://www.atlassian.com/software/confluence) (free for small teams).

## Go links

Go links make it easy to navigate internal resources with just a keyboard. Example go links include:

- `go/qid/<qid>` - primary product page for a [qid](/essays/qualified-identifiers.html)
- `go/q/<qid>` - debug page for a qid
- `go/foo-bar` - the in-app product page for some domain or product "foo bar"
- `go/foo-bar-wiki` - the wiki page for that domain or product
- `go/foo-bar-dd` - Datadog metrics page
- `go/foo-bar-prd` - product requirements doc
- `go/foo-bar-erd` - eng requirements doc

A key use case for go links in Slack channel headers - links to PRDs, metrics, etc.

# Wikis

I like wikis because they encourage incremental documentation as complexity grows. You can start with a single page, then split it into separate pages and include auto-generated descendant lists like table of contents as documentation grows. The latest Confluence WYSIWIG editor is simple and powerful as well.

Another small thing is that I like to put the go link for a wiki page fully typed out at the top of the wiki page so that it is easy to copy/paste into Slack:

```
http://go/foo-wiki
```