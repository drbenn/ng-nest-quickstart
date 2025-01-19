export interface UserDto {
  id: string,
  first_name?: string,
  last_name?: string,
  full_name?: string,
  email: string,
  img_url?: string,
  provider: string,
  roles?: string[],
  date_joined?: Date,
  last_login?: Date,
  settings?: Record<string, any>,
}

export interface CreateUserDto {
  first_name: string,
  last_name: string,
  full_name: string,
  email: string,
  img_url: string,
  provider: string,
  roles: string[],
  date_joined: Date,
  last_login: Date,
  settings?: Record<string, any>,
}

export interface CreateStandardUserDto {
  email: string,
  password: string,
}

export interface LoginStandardUserDto {
  email: string,
  password: string,
}

export interface ResetStandardUserDto {
  email: string,
}

export interface UserLoginJwtDto {
  id: string | null,
  email: string | null,
  first_name: string | null,
  last_name: string | null,
  full_name: string | null,
  img_url: string | null,
  oauth_provider: string | null,
  created_at: Date | null,
  updated_at: Date | null,
  roles: string[] | null,
  settings: any,
}

export interface CreateOAuthUserDto {
  email: string,
  full_name?: string | null,
  img_url?: string | null
}
