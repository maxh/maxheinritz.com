---
title: React JSON pretty print
desc: A simple tool for rendering rich JSON
layout: note
---

When building systems with complex domain models, I like having a developer web portal for entity loading and traversal. Given any [qid](/notes/qualified-identifiers.html), the portal allows me to see an entity's value in simple JSON. Bonus features include links to traverse associations and revision history with side-by-side diffing.

Here's an example of how a shipment might appear in such a tool:

```json
{
  "qid": "qid::shipment:893febfb-e7ba-4d7c-b576-18f2c907868b",
  "createdAt": "2021-08-16T14:03:45Z",
  "revisionCreatedAt": "2021-09-15T05:33:12Z",
  "revisionNumber": 4,
  "pickupDate": "2021-09-20",
  "origin": {
    "city": "Justynland",
    "state": "OR",
    "postalCode": "71189",
    "countryIso2": "US",
    "addressLine1": "510 Kulas Avenue"
  },
  "shipperOrgQid": "qid::organization:660f48c2-83f7-4bd1-ab46-6bf76b31b0cb",
  "consigneeOrgQid": "qid::organization:232d872d-cb31-4a84-a236-fbb8b0503994",
  "destination": {
    "city": "Port Sart",
    "state": "CT",
    "postalCode": "12575",
    "countryIso2": "US",
    "addressLine1": "7551 Elizabeth Drive"
  },
  "transportationMode": "FTL"
}
```

A simple way to render this JSON object is to use the built-in JavaScript pretty printer:

```js
JSON.stringify(entityJsonObject, undefined, 2);
```

The third argument is the [space](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) parameter, which adds line breaks and indentation for readability. In a React app, you could render with a component like this:

```jsx
import React from "react";

function SimpleJsonPrettyPrint(props) {
  const { jsonObject } = props;
  return <pre>{JSON.stringify(jsonObject, undefined, 2)}</pre>;
}
```

This works great, except that the qid values are not links. I like to be able to click on e.g. the `shipperOrgQid` value above and open the relevant org entity on another tab. The `pre` approach could be extended to support links with `dangerouslySetInnerHTML`, but that's risky.

This led me to develop a more idiomatic React JSON pretty printer with some fun recursion.

```tsx
export function JsonPrettyPrint({
  value,
  customValueRenderer,
  indent = 2,
  isLast = true,
  depth = 0,
  maxDepth = 10,
}: {
  value: Record<string, any>;
  customValueRenderer?: (value: any) => JSX.Element | undefined;
  indent?: number;
  isLast?: boolean;
  depth?: number;
  maxDepth?: number;
}) {
  if (depth > maxDepth) {
    return <span>{"..."}</span>;
  }
  const maybeTrailingComma = isLast ? "" : ",";

  if (customValueRenderer) {
    const renderedValue = customValueRenderer(value);
    if (renderedValue) {
      return (
        <>
          {renderedValue}
          {maybeTrailingComma}
        </>
      );
    }
  }

  return (
    <>
      <JsonPrettyPrintValue
        value={value}
        customValueRenderer={customValueRenderer}
        indent={indent}
        depth={depth}
        maxDepth={maxDepth}
      />
      {maybeTrailingComma}
    </>
  );
}

function JsonPrettyPrintValue({
  value,
  customValueRenderer,
  indent,
  depth,
  maxDepth,
}: {
  value: Record<string, any>;
  customValueRenderer?: (value: any) => JSX.Element | undefined;
  indent: number;
  depth: number;
  maxDepth: number;
}) {
  if (value === undefined || value === null) {
    return <>null</>;
  }

  if (Array.isArray(value) && value.length === 0) {
    return <>[]</>;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return <>{`{}`}</>;
  }

  if (typeof value === "string") {
    return <>{`"${value}"`}</>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <>{String(value)}</>;
  }

  const leftSpaces = Array(indent * (depth + 1))
    .fill(" ")
    .join("");

  const closingLeftSpaces = Array(indent * depth)
    .fill(" ")
    .join("");

  if (Array.isArray(value)) {
    return (
      <>
        [
        <div style={{ whiteSpace: "pre-wrap" }}>
          {value.map((item, index) => (
            <div key={index}>
              <span>{leftSpaces}</span>
              <JsonPrettyPrint
                value={item}
                customValueRenderer={customValueRenderer}
                isLast={index === value.length - 1}
                indent={indent}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            </div>
          ))}
        </div>
        <span>{closingLeftSpaces}</span>]
      </>
    );
  }

  const keys = Object.keys(value);
  const lastKey = keys[keys.length - 1];
  return (
    <>
      {"{"}
      <div style={{ whiteSpace: "pre-wrap" }}>
        {keys.map((key) => {
          return (
            <div key={key}>
              <span>{leftSpaces}</span>
              {`"${key}": `}
              <JsonPrettyPrint
                value={value[key]}
                customValueRenderer={customValueRenderer}
                isLast={key === lastKey}
                indent={indent}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            </div>
          );
        })}
      </div>
      <span>{closingLeftSpaces}</span>
      {`}`}
    </>
  );
}
```

A `customValueRenderer` can be provided for application-specific things like rendering qid links to resolve to specific routes:

```tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { JsonPrettyPrint } from "src/platform/component/JsonPrettyPrint";
import { isQid } from "src/platform/util/qid.util";
import { RouteInfoContext } from "src/platform/context/route-info/RouteInfoContext";

export function JsonPrettyPrintWithQidLinks({
  value,
}: {
  value: Record<string, any>;
}) {
  const { getPathForQid } = useContext(RouteInfoContext);
  return (
    <JsonPrettyPrint
      value={value}
      customValueRenderer={(value) => {
        if (isQid(qid)) {
          const qid = value;
          return (
            <>
              {`"`}
              <Link to={getPathForQid(qid)}>{qid}</Link>
              {`"`}
            </>
          );
        }
      }}
    />
  );
}
```

Maybe this could be made into an npm package, but copy/pasting seems ok too.
