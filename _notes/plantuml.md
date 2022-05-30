---
title: PlantUML
desc: Programmatic diagrams
layout: note
---

PlantUML is a wonderful tool for generating diagrams:

[https://plantuml.com/]()

```uml
@startuml
allow_mixing

skinparam map {
  BackgroundColor white
}

skinparam componentStyle rectangle

component App
component Domain
component System
component Common

App ---> Domain
App ---> System
App ---> Common

Domain ---> System
Domain ---> Common

System ---> Common
@enduml
```

![Backend Code Organization Diagram](/images/backend-code-organization.png)
