---
title: Domain-driven design
layout: note
---

Domain-driven design is a software development philosophy that emphasizes the importance of shared abstractions.

It encourages software practitioners and domain practitioners to use consistent terminology and mental models for reasoning about a particular problem domain and its representation in software. These shared abstractions facilitate deeper collaboration, faster iteration, and easier onboarding.

## Domain model

A **domain** is an area of knowledge. It is a flexible concept with granularity that varies by use case. For example, supply chain and logistics are large domains. Supply chain can be divided into the subdomains of purchasing, manufacturing, and logistics. Logistics can be further divided into FTL, LTL, ocean, domestic, cross-border, etc. 

A **model** is a way of thinking about something – a "mental model".

Putting these together, a **domain model** is a way of thinking about a particular domain. A domain model is not a specific type of diagram or specification. These artifacts can help teams refine their domain model, but just as ["the map is not the territory"](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation), we can say "the diagram is not the domain model".

A domain model includes a **ubiquitous language**: terminology should be used consistently across software source code, business communication, and everyday conversation. With an expressive ubiquitous language, teams can move quickly without needing to revisit basic definitions.

## Bounded context

Domain models are not universal. There’s a limit to how much complexity a single model can represent while still being useful, and there are only so many unique words in the English language. It’s common for different teams within a company to have separate domain models. The scope of a domain model is called its **bounded context**.

For example, the accounts payable department may have one way of thinking about invoices and the accounts receivable department may have another. Depending on the size of the overlap and the structure of the organization, these teams and their software developers may be best served by two separate domain models.

The word "ubiquitous" can be a source of confusion with respect to bounded contexts. The ubiquitous language is ubiquitous in the sense that within a given bounded context, all team members use the same language regardless of their functional role. It is not ubiquitous in the sense that the language should be used across teams working in separate bounded contexts.

One domain model corresponds to one bounded context and one ubiquitous language.
