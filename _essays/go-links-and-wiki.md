---
title: go links and wiki
desc: A simple approach to documentation
layout: essay
---

Two internal tools I find it hard to work without are go links and a wiki. My solutions of choice are https://www.golinks.io (free) and https://www.atlassian.com/software/confluence (free for small teams).

Common patterns for go links include:

- `go/qid/<qid>` - primary product page for a qid
- `go/q/<qid>` - debug page for a qid
- `go/foo` - the in-app product page for some domain or product
- `go/foo-wiki` - the wiki page for that domain or product
- `go/foo-dd` - the Datadog metrics page for a domain or product

I find wikis are better than Google Docs because of their default-view mode, excellent support for nested pages and auto-generated descendant lists, and better support for embedding images, etc. Writing a wiki feels like producing something published, whereas writing a doc feels like producing something to be reviewed and then largely forgotten. Confluence gets mixed reviews for its search functionality, but I find it be much better than Google Drive's.

Another small thing is that I like to put the go link for a wiki page fully typed out at the top of the wiki page so that it is easy to copy/paste into Slack:

```
http://go/foo-wiki
```

Another use for go links in Slack is as channel headers - go links to PRDs, metrics, etc.