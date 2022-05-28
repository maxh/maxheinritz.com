---
title: db_util.sh
desc: Local database utilities
layout: note
---

I like being able manipulate all tables in my local PostgreSQL instance quickly. There might be a better way, but I've ended up hand-rolling a shell script to run it quickly. It lets me do things like:

```sh
# Drop all rows; don't change schema.
scripts/db_util.sh delete_rows

# Drop all tables.
scripts/db_util.sh delete_tables

# Disable/enable triggers (to deal with foreign key constraints).
scripts/db_util.sh disable_triggers
scripts/db_util.sh enable_triggers
```

Where the file scripts/db_util.sh contains:

```sh
dev_db_name="my_db"
conn="postgresql://dev:dev@localhost:5432"
from="FROM information_schema.tables"
where="WHERE table_schema = 'public' AND table_name != '_prisma_migrations';"

run_for_all_tables () {
  db_name=$1
  statements=$(psql $conn/"$db_name" -c "SELECT $2 $from $where;" | grep ";")
  echo "$statements"
  psql $conn/"$db_name" -c "$statements"
}

delete_rows_for_db () {
  db_name=$1
  echo "Deleting all rows from all tables in $db_name database..."
  # We have to disable triggers to avoid foreign key constraints.
  run_for_all_tables "$db_name" "'ALTER TABLE ' || table_schema || '.' || table_name || ' DISABLE TRIGGER ALL;'"
  run_for_all_tables "$db_name" "'TRUNCATE ' || table_schema || '.' || table_name || ' CASCADE;'"
  run_for_all_tables "$db_name" "'ALTER TABLE ' || table_schema || '.' || table_name || ' ENABLE TRIGGER ALL;'"
}

delete_tables_for_db () {
  db_name=$1
  echo "Deleting all tables in $db_name database..."
  # We have to disable triggers to avoid foreign key constraints.
  run_for_all_tables "$db_name" "'ALTER TABLE ' || table_schema || '.' || table_name || ' DISABLE TRIGGER ALL;'"
  run_for_all_tables "$db_name" "'DROP TABLE ' || table_schema || '.' || table_name || ' CASCADE;'"
  psql $conn/"$db_name" -c "TRUNCATE _prisma_migrations;"
}

if [[ $1 == 'delete_tables' ]]; then
  delete_tables_for_db $dev_db_name
fi

if [[ $1 == 'delete_rows' ]]; then
  delete_rows_for_db $dev_db_name
fi

if [[ $1 == 'disable_triggers' ]]; then
  run_for_all_tables "$dev_db_name" "'ALTER TABLE ' || table_schema || '.' || table_name || ' DISABLE TRIGGER ALL;'"
fi

if [[ $1 == 'enable_triggers' ]]; then
  run_for_all_tables "$dev_db_name" "'ALTER TABLE ' || table_schema || '.' || table_name || ' ENABLE TRIGGER ALL;'"
fi
```