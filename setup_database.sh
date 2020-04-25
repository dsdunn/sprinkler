#! /bin/sh

echo "SELECT 'CREATE DATABASE sprinkler' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sprinkler')\gexec" | psql

echo "SELECT 'CREATE USER pi' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pi')\gexec" | psql

psql -U postgres -c "alter role pi with password 'raspberry';"

psql -U postgres -d sprinkler -c "grant all privileges on database sprinkler to pi;"
