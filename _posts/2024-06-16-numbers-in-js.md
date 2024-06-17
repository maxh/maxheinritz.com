---
title: Numbers in JavaScript
layout: post
tags: []
---

JavaScript numbers are represented with [a double-precision floating point value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number). (JavaScript now has BigInt but JSON does not natively support it.)

But for business applications, I find the the most useful number formats to be decimal and integer. These avoid the [imprecision](https://en.wikipedia.org/wiki/Floating-point_arithmetic#Accuracy_problems) of floating-point arithmetic; crucial for financial, logistics, and audit applications. Since JavaScript has neither an integer type nor a decimal type, my team adds our own framework-level standards to make those the default choices. This is useful for consistency across backend and frontend and in wire formats.

Tactically:

## Decimal

Examples of values stored as decimal: weight, height, length. For math operations, use the `Decimal` type from `decimal.js`. In Prisma schema files, use the Decimal type. In the REST API, use strings, as described in [Why would you use a string in JSON to represent a decimal number](https://stackoverflow.com/questions/35709595/why-would-you-use-a-string-in-json-to-represent-a-decimal-number/38357877#38357877). For GraphQL, use a custom Decimal type serialized a string. Example implementation in NestJS GraphQL below.

## Integer

Examples of values represented as integers: package count, revision number. Generally, use the native JavaScript number type. This is safe for [integer operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger). In Prisma schema files, use Int. In GraphQL types, use GraphQLInt. When receiving data from untrusted sources, use parseInt to ensure the numbers are actually integers, as this is not enforced by TypeScript. In the REST API, use numbers.

## Appendix

Example custom `GraphQLDecimal` scalar implementation:


```typescript
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Decimal } from 'decimal.js';
import { Kind, ValueNode } from 'graphql';

import { DecimalString } from 'src/isomorphic/decimal/decimal-string.type';
import {
  assertDecimalString,
  decimalToDecimalString,
} from 'src/isomorphic/decimal/decimal-string.util';

@Scalar('Decimal')
export class GraphQLDecimal implements CustomScalar<string, DecimalString> {
  description = 'An arbitrary-precision Decimal value';

  parseValue(value: unknown): DecimalString {
    return untypedAssertDecimalString(value); // value from the client
  }

  // There is a little flexibility here. Resolvers can return either Decimal or
  // DecimalString values. Note that inputs are always Decimal typed.
  serialize(value: unknown): string {
    let decimalString: DecimalString;
    if (Decimal.isDecimal(value)) {
      decimalString = decimalToDecimalString(value);
    } else {
      decimalString = untypedAssertDecimalString(value);
    }

    return decimalString; // value sent to the client
  }

  parseLiteral(ast: ValueNode): DecimalString {
    if (ast.kind === Kind.STRING) {
      return untypedAssertDecimalString(ast.value);
    }

    throw new Error('Decimal literals must be strings');
  }
}

function untypedAssertDecimalString(value: unknown): DecimalString {
  if (typeof value === 'string') {
    return assertDecimalString(value);
  }

  throw new Error('Invalid value type for Decimal');
}
```
