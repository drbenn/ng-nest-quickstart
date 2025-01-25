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

export interface RequestResetStandardUserDto {
  email: string,
}

export interface ResetStandardPasswordDto {
  email: string,
  resetId: string,
  newPassword: string
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

export interface AuthResponseMessageDto {
  message?: string;
  user?: Partial<UserLoginJwtDto>,
  email?: string;
  provider?: string;
}

export enum AuthMessages {
  STANDARD_REGISTRATION_SUCCESS = 'standard registration success: email not previously registered and new user saved to db',
  STANDARD_REGISTRATION_FAILED = 'standard registration failed: email already registered in site db',
  STANDARD_REGISTRATION_ERROR = 'standard registration error: api error, no user created or existing email found',

  STANDARD_LOGIN_FAILED_NOT_REGISTERED = 'standard login failed: cannot login user. user email not registered',
  STANDARD_LOGIN_FAILED_EXISTING = 'standard login failed: cannot login user. user email already registered through oauth provider',
  STANDARD_LOGIN_FAILED_MISMATCH = 'standard login failed: cannot login user. user email/password combination failed',
  STANDARD_LOGIN_SUCCESS = 'standard login success: user email/password combination successful',
  STANDARD_LOGIN_ERROR = 'standard login error: api error, login workflow error',

  STANDARD_RESET_FAILED = 'standard password reset failed',
  STANDARD_RESET_SUCCESS = 'standard password reset success',

  STANDARD_PASSWORD_RESET_REQUEST_SUCCESS = 'standard password reset request success: email sent to user for password reset',
  STANDARD_PASSWORD_RESET_REQUEST_FAILED = 'standard password reset request failed: email not sent to user for password reset',
}