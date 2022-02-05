---
title: Dates and times (WIP)
desc: Properly handling date and date times
layout: essay
---

Dates and times can be tricky to interact with while programming.

One approach is to represent all times in [UNIX epoch milleseconds](https://en.wikipedia.org/wiki/Unix_time) and let a thin layer of frontend code handle the conversion to local time for rendering. This works well for system-level events like `created_at` or `logged_in_at`, and it might be enough for some simple business domains.

But epoch milliseconds are insufficient for more complicated domains that involve scheduling future times, time ranges, and users coordinating across time zones. International freight deals with of those things, and this led me to spend _a lot_ of time (heh) learning about these concepts at Flexport.

I've come to follow the terminology defined by the W3C here:

[https://www.w3.org/International/articles/definitions-time](https://www.w3.org/International/articles/definitions-time)

This article is a companion to that page with some more tactical best practices.

## Table of contents

- [Examples](#examples)
- [Key distinctions](#key-distinctions)
    - [UTC offset vs time zone](#utc-offset-vs-time-zone)
    - [Incremental time vs wall time](#incremental-time-vs-wall-time)
    - [Date vs date time](#date-vs-date-time)
- [IANA database](#iana-database)
- [Representing dates in logistics](#representing-dates-in-logistics)

<a name="examples"></a>
## Examples

Let's start with colloquial examples to illustrate a few concepts:


```sh
# date with a time zone
October 21, 2021 in America/Chicago

# date with a named UTC offset
October 21, 2021 Central Daylight Time

# date time with a numeric UTC offset
8:30AM on October 21, 2021 UTC-06:00
```

Notice the different types: date vs date time and offset vs time zone.

## Key distinctions

### UTC offset vs time zone

A _UTC offset_ is an hour and minute offset from UTC, represented either as a _numeric offset_ like "UTC+06:00" or a _named offset_ like "Central Daylight Time (CDT)".

A _time zone_ is a geographic area with a label like "America/Chicago".

There is a many-to-many relationship between UTC offsets and time zones. A time zone's UTC offset usually changes twice per year for daylight savings, and also may be updated due to political decisions. The authoritative mapping between time zones and offsets is the [IANA database](#iana-database).

### Incremental time vs wall time

_Incremental time_ is based on a progression of fixed integer units that increase monotonically from a specific point in time (called the "epoch"). UTC and offset-based times are different flavors of incremental time, and all can be converted to the UNIX epoch representation:

```sh
# UTC (Z is shorthand for UTC)
2021-10-23T10:30:00Z

# numeric offset
2021-10-23T10:30:00+06:00 

# named offset
2021-10-23T10:30:00CDT

# seconds since 00:00:00 UTC 1 January 1970
1634257344
```

_Wall time_ corresponds to what a person would recognize the time to be if they looked at a clock and/or calendar mounted on a wall in a particular place. In its most basic form it's represented like this:

```sh
2021-10-01T10:30:00 # no offset
```

Wall time can be used without a time zone to represent something like "this year my birthday is on Tuesday June 8, 2021", which is true regardless of time zone or UTC offset. But in my experience, most business use cases for wall times involve anchoring to a specific place. More on this in the section [Representing dates in logistics](#representing-dates-in-logistics).

### Date vs date time

A "date" is not the same as a "date time". A "date" is a time range from midnight to midnight in a particular time zone. Usually this is a 24-hour range, but there are some exceptions for years with leap seconds and on daylight savings transitions. A "date time" is a particular instant in time, which may or may not be anchored to a time zone.

## IANA database

The IANA database is standard mapping of time zones to IANA offsets. You can download the dataset here: 

[https://www.iana.org/time-zones](https://www.iana.org/time-zones)

Here's an example of what the rules look like.=:

```txt
# Zone	NAME		STDOFF	RULES	FORMAT	[UNTIL]
Zone America/Chicago	-5:50:36 -	LMT	1883 Nov 18 12:09:24
			-6:00	US	C%sT	1920
			-6:00	Chicago	C%sT	1936 Mar  1  2:00
			-5:00	-	EST	1936 Nov 15  2:00
			-6:00	Chicago	C%sT	1942
			-6:00	US	C%sT	1946
			-6:00	Chicago	C%sT	1967
			-6:00	US	C%sT
```

## Representing dates in logistics

When updating a delivery ETA, what the user is really trying to convey is something like:

```
The package is expected to be delivered to
764 Treat Ave, San Francisco, CA
by 10:30AM on 2021-10-23.
```

The most precise way to capture the user's intention might be with a data structure like this:

```js
{
    place: "764 Treat Ave, San Francisco, CA, 94110",
    wall_date_time: "2021-10-23T10:30",
}
```

But this rather unwieldy. 

<!-- ## Common sources of confusion

### ISO8601 strings

encode offset, not timezone
do not disambiguate midnight date time vs date

### JavaScript “Date” object
The object represents a “date time” but it’s called a “Date”. Local date times in the browser

### Past vs future type equivalence

## Best practices

I’ve seen many bugs stem from ambiguous representations of date and date time values.

Gotchas:

Is it “timezone” as one word or “time zone” as two words? -->
