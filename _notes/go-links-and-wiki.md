---
title: Go links and wikis
layout: note
---

Two of my favorite internal tools are go links and wikis. I was first exposed to these at Google and have advocated for their use at the all startups I've joined. The best-in-class external offerings seem to be [golinks.io](https://www.golinks.io) and [Atlassian Confluence](https://www.atlassian.com/software/confluence).

## Go links

Go links make it easy to navigate internal resources with just a keyboard. Example go links include:

- `go/qid/<qid>` - primary product page for a [qid](/notes/qualified-identifiers.html)
- `go/q/<qid>` - debug page for a qid
- `go/foo-bar` - the in-app product page for some domain or product "foo bar"
- `go/foo-bar-wiki` - the wiki page for that domain or product
- `go/foo-bar-dd` - Datadog metrics page
- `go/foo-bar-prd` - product requirements doc
- `go/foo-bar-erd` - eng requirements doc

In Chrome, I hit "cmd+L" to activate the URL bar, then type "go/" and type the link. Chrome autocompletion makes it fast and easy to find what I'm looking for. (A product idea is to autocomplete links that exist in the company go link registry, even if they haven't been visited before. Not sure if that exists.)

Another use case for go links is Slack channel headers - links to PRDs, metrics, etc.

# Wikis

I like wikis because they encourage incremental documentation as complexity grows. You can start with a single page, then split it into child pages and include an auto-generated descendant "table of contents" in the parent page. The latest Confluence WYSIWIG editor is simple and powerful as well.

It's helpful to put the full go link for a wiki page at the top of the wiki page so that it is easy to copy/paste into Slack:

```
http://go/foo-wiki
```
