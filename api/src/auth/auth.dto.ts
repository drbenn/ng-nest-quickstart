import { exists } from "fs";
import { User } from "src/users/user.entity";

export class AuthResponseMessageDto {
  message?: string;
  user?: Partial<User>;
  email?: string;
  provider?: string;
  // isRedirect?: boolean;
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
  STANDARD_LOGIN_SUCCESS = 'standard login success: user email/password combination successful',
  STANDARD_LOGIN_ERROR = 'standard login error: api error, login workflow error',

  STANDARD_RESET_FAILED = 'standard password reset failed',
  STANDARD_RESET_SUCCESS = 'standard password reset success',

  STANDARD_PASSWORD_RESET_REQUEST_SUCCESS = 'standard password reset request success: email sent to user for password reset',
  STANDARD_PASSWORD_RESET_REQUEST_FAILED = 'standard password reset request failed: email not sent to user for password reset',
}

// export class UserWithTokensDto {
//   user: Partial<User>;
//   jwtAccessToken: string;
//   jwtRefreshToken: string;
// }

// Registration
// Create success
// create fail email exists


// LOGIN''
// Login success email & password match & user is standard
// login fail user is standard but email password incorrect
// login fail user email used by other provider