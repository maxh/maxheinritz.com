---
title: Dates and Times (WIP)
desc: Properly handling date and date times.
layout: essay
---

Dates and times are tricky to handle correctly in software.

## Examples

| type | value |
|:---  |:---  |
| _date_ with a _time zone_ | `October 21, 2021 in America/Chicago` | 
| _date time_ with a _time zone_  | `8:30AM on October 21, 2021 in America/Chicago` |
| _date_ with a _UTC offset_ | `October 21, 2021 UTC-6` |
| _date time_ with a _UTC offset_ | `8:30AM on October 21, 2021 UTC-6` |
| _date_ with a _named UTC offset_ | `October 21, 2021 Central Daylight Time` |
| _date time_ with a _named UTC offset_ | `8:30AM on October 21, 2021 Central Daylight Time` |
{:.custom-table}

## Key distinctions

### UTC offset vs time zone

The concepts of “UTC offset” and “time zone” are distinct. A UTC offset is a positive or negative number indicating the hours offset from UTC. A time zone is a geographic area that is mapped to one or more UTC offset.

An example of a time zone is “America/Chicago”. An example of a UTC offset is UTC-6. A named offset is an alias for a UTC offset. For example, Central Daylight Time (CDT) means UTC-5 and Central Standard Time (CST) menas UTC-6.

The relationship between a time zone and its current UTC offsets usually changes twice per year for daylight savings, but also may be updated due to political decisions. 

### Date vs date time

A “date” is not the same as a “date time”. A “date” is a time range from midnight to midnight in a particular time zone. Usually this is a 24-hour range, but there are some exceptions for years with leap seconds and on daylight savings transitions. A “date time” is a particular instant in time, which may or may not be anchored to a time zone.

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
