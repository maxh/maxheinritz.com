---
title: Enums
desc: Properly handling enumerated types
layout: note
---

Enums are great. In TypeScript, I like using Sean Nicolay's [Flow-inspired enum library](https://github.com/kejistan/enum), with UPPER_SNAKE keys and values:

```typescript
import { Enum, EnumValue } from "@kejistan/enum";

const MyStringEnum = Enum({
  VALUE_ONE: "VALUE_ONE",
  VALUE_TWO: "VALUE_TWO",
});

type MyStringEnum = EnumValue<typeof MyStringEnum>;
```

## Why UPPER_SNAKE?

We want consistency across backend code, frontend code, API definitions, and persistence.

GraphQL spec recommends it:

- [http://spec.graphql.org/June2018/#sec-Enum-Value]()

Google JSON API recommends it:

- [https://google.github.io/styleguide/jsoncstyleguide.xml#Enum_Values]()

These REST APIs recommend it:

- [https://opensource.zalando.com/restful-api-guidelines/#240]()

Protobuf generated code uses it:

- [https://developers.google.com/protocol-buffers/docs/proto3#enum]()
- [https://developers.google.com/protocol-buffers/docs/reference/java-generated#enum]()

## Persistence

I've tended to persist enums in TEXT-type columns instead of integers for data readability as outlined here:
https://softwareengineering.stackexchange.com/questions/284530/why-store-flags-enums-in-a-database-as-strings-instead-of-integers

Prisma enums are another option:
https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-enums
