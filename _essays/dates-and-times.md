---
title: Dates and times
desc: Properly handling date and date times
layout: essay
---

Dates and times can be tricky to interact with while programming.

One approach is to represent all times in [UNIX epoch milleseconds](https://en.wikipedia.org/wiki/Unix_time) and let a thin layer of frontend code handle the conversion to local time for rendering. This works well for system-level events like `created_at` or `logged_in_at`, and it might be enough for some simple business domains.

But epoch milliseconds are insufficient for more complicated domains that involve scheduling future times, time ranges, and users coordinating across time zones.

## W3C Terminology

I've come to follow the terminology defined by the W3C here:

[https://www.w3.org/International/articles/definitions-time](https://www.w3.org/International/articles/definitions-time)

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

A _time zone_ is a geographic area with a label like "America/Chicago". A time zone can be represented as a GeoJSON value -- it's a geospatial region on the planet.

There is a many-to-many relationship between UTC offsets and time zones. A time zone's UTC offset usually changes twice per year for daylight savings, and also may be updated due to political decisions. The authoritative mapping between time zones and offsets is the IANA database.

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

Wall time can be used without a time zone to represent something like "this year my birthday is on Tuesday June 8, 2021", which is true regardless of time zone or UTC offset. But in my experience, most business use cases for wall times involve anchoring to a specific place.

### Date vs date time

A "date" is not the same as a "date time".

A "date" is a time range from midnight to midnight in a particular time zone. Usually this is a 24-hour range, but there are some exceptions for years with leap seconds and on daylight savings transitions.

A "date time" is a particular instant in time, which may or may not be anchored to a time zone.

The poorly name JavaScript `Date` object represents date times, not dates.

## IANA database

The IANA database is standard mapping of time zones to IANA offsets. You can download the dataset here: 

[https://www.iana.org/time-zones](https://www.iana.org/time-zones)

Here's an example of what the rules look like:

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

For Chicago, the offset has been stable since the mid-twentieth century (with annual daylights savings).

There are periodic changes to the IANA database, and it's fun to see the world come together and collaborate in this arcane part of the Internet. Examples:

- Fiji skipping daylights savings ([link](https://mm.icann.org/pipermail/tz/2021-October/030967.html))
- Palestine declaring its time zone specification ([link](https://mm.icann.org/pipermail/tz/2022-January/031146.html))
- Amidst the Russian military build up on the Ukrainian border, a proposal to use the correct spelling of Kyiv (transliteration from Ukrainian) instead the incorrect Kiev (transliteration from Russian) ([link](https://mm.icann.org/pipermail/tz/2022-February/031182.html))