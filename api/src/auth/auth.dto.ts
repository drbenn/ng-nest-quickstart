import { UserProfile } from "src/users/user.types";


export interface OAuthUser {
  id: number;
  email: string;
  name: string;
  provider?: string;
}

export class AuthResponseMessageDto {
  message?: string;
  user?: Partial<UserProfile>;
  email?: string;
  provider?: string;
  jwtAccessToken?: string;
  jwtRefreshToken?: string;
  message_two?: string;
}


export enum AuthMessages {
  STANDARD_REGISTRATION_SUCCESS = 'standard registration success: email not previously registered and new user saved to db',
  STANDARD_REGISTRATION_FAILED = 'standard registration failed: email already registered in site db',
  STANDARD_REGISTRATION_ERROR = 'standard registration error: api error, no user created or existing email found',

  STANDARD_LOGIN_FAILED_NOT_REGISTERED = 'standard login failed: cannot login user. user email not registered',
  STANDARD_LOGIN_FAILED_EXISTING = 'standard login failed: cannot login user. user email already registered through oauth provider',
  STANDARD_LOGIN_FAILED_MISMATCH = 'standard login failed: cannot login user. user email/password combination failed',
  STANDARD_LOGIN_SUCCESS = 'standard login success: user email/password combination successful. User must now confirm account through link sent to provided email.',
  STANDARD_LOGIN_ERROR = 'standard login error: api error, login workflow error',

  STANDARD_RESET_FAILED = 'standard password reset failed. no user_login found that matches email and \'email\' as login_provider.',
  STANDARD_RESET_SUCCESS = 'standard user password reset successful',

  STANDARD_CONFIRM_EMAIL_SENT_FAILED = 'standard password confirm email send failed.',
  STANDARD_CONFIRM_EMAIL_SENT_SUCCESS = 'standard user confirm email sent successful',

  STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED = 'standard password confirm email failed.',
  STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED_NO_MATCH = 'standard password confirm email failed. Hashes do not match',
  STANDARD_CONFIRM_EMAIL_CONFIRMED_SUCCESS = 'standard user confirm email successful',

  STANDARD_PASSWORD_RESET_REQUEST_SUCCESS = 'standard password reset request success: email sent to user for password reset',
  STANDARD_PASSWORD_RESET_REQUEST_FAILED = 'standard password reset request failed: email as standard email/password login not found. email not sent to user for password reset. user login may exist for oauth login, but user must register standard email/password to reset password.',
}
