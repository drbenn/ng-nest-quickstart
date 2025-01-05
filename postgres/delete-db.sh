#!/bin/bash

# Database connection details
DB_NAME="quickstart_db"
DB_USER="postgres"
DB_PASSWORD="pass"  # Replace with your actual password

# Set the password for the session
export PGPASSWORD=$DB_PASSWORD

# Terminate all connections to the database
psql -U $DB_USER -c "SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();"

# Drop the database
psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"