---
title: Money
desc: Properly dealing with money
layout: note
---

Money should be stored as an amount and a currency code.

The amount is an integer, which can be converted into the actual main denomination unit. In the real world, money can be 2-decimal (US dollars), zero-decimal (JP Yen) or even non decimal (1 denomination converts to another in power of 5 instead of 10). Store amount values in D6 format; that is, 1/1000000 of the main denomination (USD or JPY).

For example, to represent "$99.99", use a money object like this:

```typescript
{
    amountD6: 99990000,
    currencyCode: "USD"
}
```

Rounding should be dictated by business rules within domain logic.

Further reading:

[https://wiki.c2.com/?MoneyObject](https://wiki.c2.com/?MoneyObject)

[https://www.martinfowler.com/eaaCatalog/money.html](https://www.martinfowler.com/eaaCatalog/money.html)
