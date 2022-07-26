---
title: Dependency hierarchy
desc: Reasoning about module relationships
layout: note
tags: ["software patterns", "ddd"]
---

A dependency hierarchy is a way to describe interactions among software components. It helps us break down complexity into easier-to-reason-about chunks. The simplest dependency hierarchy looks like this, with A depending on B:

```
  -----
  | A |
  -----
    |
    V
  -----
  | B |
  -----
```

`A -> B` implies a relationship with the qualities below.

## Directionality

- A knows about B
- B doesn’t know about A

## Layering

- A is built "on top of" or "above" B
- B is a layer "below" A

## APIs

- A calls the APIs exposed by B
- B exposes APIs, not caring who uses them (A could use them)

## Events

- A consumes events from B
- B publishes events, not caring who consumes them (A could consume them)

## Independent evolution

- A can evolve independent of B, so long as A is using B’s well-defined interface
- B can evolve independent of A, so long as it does not make breaking API changes

## User interactions

- Users interacting with A may know about B
- Users interacting with B may not be aware of A

## Upstream/downstream

The concepts of "upstream" and "downstream" are defined in relation to the flow of information, which is distinct from dependencies. The terminology is a bit confusing here because upstream/downstream doesn't always match the vertical placement of modules in the dependency diagram.

When information is flowing up the dependency hierarchy (e.g. with events), we can say that:

- Information starts in B and then flows "up the hierarchy" to A
- A is downstream of B
- B is upstream of A

When information is flowing down the dependency hierarchy (e.g. with API call), we can say that:

- Information starts in A and then flows "down the hierarchy" to B
- A is upstream of B
- B is downstream of A
