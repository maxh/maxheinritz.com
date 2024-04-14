---
title: Correctness bucket list
layout: post
tags: []
---

The [test pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) is a framework for reasoning about the relationships between different testing strategies. The goal of most [0] tests is to ensure correctness. There are other, non-testing techniques for guaranteeing correctness. How do those relate to tests in the context of the pyramid framework?

We can extend the pyramid to include all these techniques, forming a "correctness bucket list." It's not really a pyramid per se, but a list of techniques to consider as scale grows. 

* _Static types_ - A cheap way to avoid a large class of bugs, especially on big projects with many contributors.

* _Automated tests_

    * _Unit tests_ - Pure, in-memory functional tests

    * _Integration tests_ - Tests of a single deployable unit along with its immediate dependencies like Postgres, Redis, Elasticsearch, etc.

    * _Blackbox tests_ - Tests running code, e.g. interacted with over port from separate test process.

    * _End-to-end (e2e) tests_ - Tests of multiple deployable units interacting, like frontend and backend.

    * _Production synthetic tests_ - Scripts to log in as a fake user and perform actions on the prod system periodically.

* _Metrics monitoring_ - Automated alerts based on metrics thresholds. These can be either business-related (percent of invoices automatically approved in the last 24 hours) or purely technical (error count over period of time, CPU utilization, etc).

* _Metrics dashboards_ - Charts for periodic manual review. Again, these can be either business or technical metrics. Often the line is blurry, for example did we fail to automatically approve invoices because the machine learning pipeline was broken, or because we're seeing new shapes of invoice data for the first time?

* _User bug reports_ - Direct feedback from users about what is not working.

* _User shadowing and interviews_ - Sometimes users don't proactively report correctness issues. This could be for any number of reasons: because they're not sure what the expected behavior is, they think it's a known issue, they don't care enough to go through the effort of reporting, etc. Simply sitting down and talking with users can be high signal for ensuring correctness.

* _Manual tests_ - Click buttons to ensure that the product works from an end-user perspective.

* _Logs and error reporting_ - Raw data from production machines.

[0] Some tests measure non-functional system requirements such as performance or compiled binary size.
