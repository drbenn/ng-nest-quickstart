-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- CREATE TABLE IF NOT EXISTS users (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

--   email VARCHAR(50),
--   password VARCHAR(100),
--   refresh_token VARCHAR(100),
--   oauth_provider VARCHAR(100),
--   oauth_provider_user_id VARCHAR(100),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   first_name VARCHAR(20),
--   last_name VARCHAR(20),
--   full_name VARCHAR(40),
--   img_url VARCHAR(100),
--   reset_id VARCHAR(100),
--   settings JSONB NULL
-- );

-- CREATE TABLE IF NOT EXISTS todos (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   detail TEXT,
--   isCompleted BOOLEAN,
--   date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CREATE TABLE IF NOT EXISTS users (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

--   email VARCHAR(50),
--   password VARCHAR(100),
--   refresh_token VARCHAR(100),
--   oauth_provider VARCHAR(100),
--   oauth_provider_user_id VARCHAR(100),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   first_name VARCHAR(20),
--   last_name VARCHAR(20),
--   full_name VARCHAR(40),
--   img_url VARCHAR(100),
--   reset_id VARCHAR(100),
--   settings JSONB NULL
-- );

-- CREATE TABLE IF NOT EXISTS todos (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   detail TEXT,
--   isCompleted BOOLEAN,
--   date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );


SELECT * FROM pg_extension;