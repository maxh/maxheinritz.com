---
title: Find missing indices
layout: post
tags: ["software patterns"]
---

To find tables that need indices, run:

```sql
SELECT
    relname as table_name,
    idx_scan as index_scan,
    seq_scan as table_scan,
    100*idx_scan / (seq_scan + idx_scan) as index_usage,
    n_live_tup as rows_in_table
FROM
    pg_stat_user_tables
WHERE
    seq_scan + idx_scan > 0 -- at least one query
    and n_live_tup > 1000 -- at least 1000 rows
    and 100*idx_scan / (seq_scan + idx_scan) < 99 -- less than 99% index usage
ORDER BY 4 DESC
LIMIT 10;
```

This will show tables with low index usage.
