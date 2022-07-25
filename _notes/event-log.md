---
title: Event log
desc: Publishing and consuming through an ordered log of events
layout: note
---

An event log is a pattern for communication between software components. It is especially useful for allowing communication _up_ the dependency hierarchy while still respecting domain boundaries.

For communication _down_ the dependency hierarchy, high-level modules can directly invoke APIs on low-level modules. For example, if the invoice module needs to check user permissions, it can call down into the user module to retrieve user roles.

What about data flowing the other way? Low-level modules are not allowed to depend on high-level modules, so they cannot invoke their APIs. Instead, low-level modules can publish events, agnostic to who consumes them. Then higher level modules can consume these events, in doing so they take a dependency on the low-level module, which is fine.
