#! /bin/sh

echo "SELECT 'CREATE DATABASE sprinkler' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sprinkler')\gexec" | psql


psql -U postgres -c "create user pi with password 'raspberry';"


psql -U postgres -d sprinkler -c "
CREATE TABLE IF NOT EXISTS schedules (
  id serial PRIMARY KEY, 
  schedule_name varchar(45) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  program integer,
  interval integer,
  iterations integer
);"

psql -U postgres -d sprinkler -c "
CREATE TABLE IF NOT EXISTS programs (
  id serial PRIMARY KEY, 
  program_name varchar(45) NOT NULL,
  zones integer [],
  duration_per_zone integer
);"

psql -U postgres -d sprinkler -c "grant all privileges on table programs to pi;" 
psql -U postgres -d sprinkler -c "grant all privileges on table schedules to pi;" 