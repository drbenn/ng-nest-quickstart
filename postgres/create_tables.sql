CREATE TABLE user_profiles (
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

CREATE TABLE IF NOT EXISTS user_logins (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
  email VARCHAR(255),
  standard_login_password VARCHAR(255),
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

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  detail TEXT,
  is_completed BOOLEAN,
  date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_login_history (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES user_logins(id) ON DELETE CASCADE,
  login_at TIMESTAMP DEFAULT NOW(),
  ip_address INET NOT NULL,
  type VARCHAR(20)
);