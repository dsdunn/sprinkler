#! /bin/sh

echo "SELECT 'CREATE DATABASE sprinkler' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sprinkler')\gexec" | psql

echo "SELECT 'CREATE USER pi' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pi')\gexec" | psql

psql -U postgres -c "alter role pi with password 'raspberry';"

psql -U postgres -d sprinkler -c "grant all privileges on database sprinkler to pi;"

psql -U postgres -d sprinkler -c "create schema if not exists sprinkler;"

psql -U postgres -d sprinkler -c "create table if not exists sprinkler.schedules (i integer);"

psql -U postgres -d sprinkler -c "
CREATE TABLE IF NOT EXISTS schedules (
  username varchar(45) NOT NULL,
  password varchar(450) NOT NULL,
  enabled integer NOT NULL DEFAULT '1',
  PRIMARY KEY (username)
)"