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
CREATE TABLE IF NOT EXISTS \"user_profiles\" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  img_url VARCHAR(255),
  refresh_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  settings JSONB NULL,
  profile_status VARCHAR(64),
  roles TEXT[]
);

CREATE TABLE IF NOT EXISTS \"user_logins\" (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
  email VARCHAR(255),
  standard_login_password VARCHAR(255),
  refresh_token VARCHAR(255),
  login_provider VARCHAR(100),
  provider_user_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  img_url VARCHAR(255),
  reset_id VARCHAR(255),
  UNIQUE(login_provider, provider_user_id),
  login_status VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS \"todos\" (
  id SERIAL PRIMARY KEY,
  detail TEXT,
  is_completed BOOLEAN,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS \"user_login_history\" (
  id SERIAL PRIMARY KEY,
  user_profile_id INT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  login_at TIMESTAMP DEFAULT NOW(),
  ip_address INET NOT NULL,
  type VARCHAR(20)
);

CREATE TABLE \"chat_rooms\" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50) NOT NULL DEFAULT 'public', -- 'public', 'private', 'group'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE \"chat_room_members\" (
    user_id INT REFERENCES user_profiles(id) ON DELETE CASCADE,
    room_id INT REFERENCES chat_rooms(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, room_id)
);

CREATE TABLE \"chat_messages\" (
    id BIGSERIAL PRIMARY KEY, -- Use BIGSERIAL for potentially many messages
    room_id INT NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id INT REFERENCES user_profiles(id) ON DELETE SET NULL, -- Or NOT NULL if sender must exist
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message_type VARCHAR(50) DEFAULT 'text'
);

-- Crucial Indexes for Performance!
CREATE INDEX idx_chat_messages_room_id_created_at ON chat_messages (room_id, created_at DESC);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages (sender_id);
CREATE INDEX idx_chat_rooms_type ON chat_rooms (type);

"

# Why Track IP Addresses?

#     Bot Detection: If many logins come from different accounts but the same IP, it might be an automated script.
#     Geolocation Checks: If a user logs in from different countries within a short time, it could indicate an account takeover.
#     Rate Limiting: Helps enforce login rate limits based on IP.
