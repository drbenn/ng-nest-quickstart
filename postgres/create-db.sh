#!/bin/bash

# Database connection details
DB_NAME="quickstart_db"
DB_USER="postgres"
DB_PASSWORD="pass" # Replace with your actual password

# DB_NAME="danbxdxb_ng_nest_quickstart_db"
# DB_USER="danbxdxb_postgres_dan_rules"
# DB_PASSWORD="jabroni_BALOGNE_22!!33" # Replace with your actual password

# SQL commands
# Set the password for the session
export PGPASSWORD=$DB_PASSWORD

# Create the database first
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Run the SQL commands to create tables
psql -U $DB_USER -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS \"users\" (
  id SERIAL PRIMARY KEY,

  email VARCHAR(50),
  password VARCHAR(300),
  refresh_token VARCHAR(300),
  oauth_provider VARCHAR(300),
  oauth_provider_user_id VARCHAR(300),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  full_name VARCHAR(100),
  img_url VARCHAR(300),
  reset_id VARCHAR(300),
  settings JSONB NULL
);

CREATE TABLE IF NOT EXISTS \"todos\" (
  id SERIAL PRIMARY KEY,
  detail TEXT,
  is_completed BOOLEAN,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_login_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_at TIMESTAMP DEFAULT NOW(),
  ip_address INET NOT NULL,
  type VARCHAR(20)
);
"

# Why Track IP Addresses?

#     Bot Detection: If many logins come from different accounts but the same IP, it might be an automated script.
#     Geolocation Checks: If a user logs in from different countries within a short time, it could indicate an account takeover.
#     Rate Limiting: Helps enforce login rate limits based on IP.
