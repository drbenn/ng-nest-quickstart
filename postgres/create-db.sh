#!/bin/bash

# Database connection details
DB_NAME="quickstart_db"
DB_USER="postgres"
DB_PASSWORD="pass" # Replace with your actual password

# SQL commands
# Set the password for the session
export PGPASSWORD=$DB_PASSWORD

# Create the database first
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# This extension is required to use function uuid_generate_v4()
psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Run the SQL commands to create tables
psql -U $DB_USER -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS \"users\" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  email VARCHAR(50),
  password VARCHAR(100),
  refresh_token VARCHAR(100),
  oauth_provider VARCHAR(100),
  oauth_provider_user_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  first_name VARCHAR(20),
  last_name VARCHAR(20),
  full_name VARCHAR(40),
  img_url VARCHAR(100),
  reset_id VARCHAR(100),
  settings JSONB NULL
);

CREATE TABLE IF NOT EXISTS \"todos\" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  detail TEXT,
  isCompleted BOOLEAN,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
"
# psql -U $DB_USER -d $DB_NAME -c "
# CREATE TABLE IF NOT EXISTS \"user\" (
#   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
#   first_name VARCHAR(20),
#   last_name VARCHAR(20),
#   full_name VARCHAR(40),
#   email VARCHAR(50),
#   password VARCHAR(100),
#   img_url VARCHAR(100),
#   provider VARCHAR(50),
#   roles TEXT[],
#   date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
#   last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
#   settings JSONB NULL
# );

# CREATE TABLE IF NOT EXISTS \"session_note\" (
#   id SERIAL PRIMARY KEY,
#   user_id INTEGER NOT NULL,
#   title VARCHAR(255),
#   category VARCHAR(255),
#   tags TEXT[],
#   visibility TEXT NOT NULL,
#   note TEXT,
#   session_date DATE NOT NULL,
#   last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
#   last_accessed DATE,
#   date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
# );