// export interface UserDto {
//   id: number,
//   first_name?: string,
//   last_name?: string,
//   full_name?: string,
//   email: string,
//   img_url?: string,
//   provider: string,
//   roles?: string[],
//   date_joined?: Date,
//   last_login?: Date,
//   settings?: Record<string, any>,
// }

// export interface CreateUserDto {
//   first_name: string,
//   last_name: string,
//   full_name: string,
//   email: string,
//   img_url: string,
//   provider: string,
//   roles: string[],
//   date_joined: Date,
//   last_login: Date,
//   settings?: Record<string, any>,
// }

// export interface CreateStandardUserDto {
//   email: string,
//   password: string,
// }

// export interface LoginStandardUserDto {
//   email: string,
//   password: string,
// }

// export interface RequestResetStandardUserPasswordDto {
//   email: string,
// }

// export interface ResetStandardUserPasswordDto {
//   email: string,
//   reset_id: string,
//   new_password: string
// }

// export interface UserLoginJwtDto {
//   id: string | null,
//   email: string | null,
//   first_name: string | null,
//   last_name: string | null,
//   full_name: string | null,
//   img_url: string | null,
//   oauth_provider: string | null,
//   created_at: Date | null,
//   updated_at: Date | null,
//   roles: string[] | null,
//   settings: any,
// }

// export interface UserProfile {
//   id: number,
//   email: string,
//   username?: string,
//   first_name?: string,
//   last_name?: string,
//   img_url?: string,
//   refresh_token?: string,
//   created_at: Date,
//   updated_at: Date,
//   roles?: any,
//   settings?: Record<string, any>,
// }

// export interface CreateOAuthUserDto {
//   email: string,
//   full_name?: string | null,
//   img_url?: string | null
// }

// export interface AuthResponseMessageDto {
//   message?: string;
//   user?: Partial<UserProfile>,
//   email?: string;
//   provider?: string;
//   message_two?: string;
// }

// export enum AuthMessages {
//   STANDARD_REGISTRATION_SUCCESS = 'standard registration success: email not previously registered and new user saved to db',
//   STANDARD_REGISTRATION_FAILED = 'standard registration failed: email already registered in site db',
//   STANDARD_REGISTRATION_ERROR = 'standard registration error: api error, no user created or existing email found',

//   STANDARD_LOGIN_FAILED_NOT_REGISTERED = 'standard login failed: cannot login user. user email not registered',
//   STANDARD_LOGIN_FAILED_EXISTING = 'standard login failed: cannot login user. user email already registered through oauth provider',
//   STANDARD_LOGIN_FAILED_MISMATCH = 'standard login failed: cannot login user. user email/password combination failed',
//   STANDARD_LOGIN_SUCCESS = 'standard login success: user email/password combination successful',
//   STANDARD_LOGIN_ERROR = 'standard login error: api error, login workflow error',

//   STANDARD_RESET_FAILED = 'standard password reset failed. no user_login found that matches email and \'email\' as login_provider.',
//   STANDARD_RESET_SUCCESS = 'standard user password reset successful',

//   STANDARD_PASSWORD_RESET_REQUEST_SUCCESS = 'standard password reset request success: email sent to user for password reset',
//   STANDARD_PASSWORD_RESET_REQUEST_FAILED = 'standard password reset request failed: email as standard email/password login not found. email not sent to user for password reset. user login may exist for oauth login, but user must register standard email/password to reset password.',
// }