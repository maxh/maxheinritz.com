---
title: Dependency hierarchy
desc: Reasoning about module relationships
layout: note
---

A domain dependency hierarchy is way to describe the interaction between different domains. It helps us break down complexity into easier-to-reason-about chunks.

The simplest dependency hierarchy looks like this, with module A depending on module B.

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

A -> B implies a relationship with the qualities below.

## Directionality

- A knows about B
- B doesn’t know about A

## Upstream/downstream

- A is downstream of B
- B is upstream of A

## Layering

- A is built "on top" or "above" B
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
