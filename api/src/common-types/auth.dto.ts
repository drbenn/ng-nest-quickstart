
export interface UserLogin {
  id: number,
  profile_id: number,                 // id of user_profile
  email?: string,
  standard_login_password?: string,    // exclude from responses
  login_provider: string,             // 'email', 'steam', 'google', 'facebook', 'github'
  provider_user_id?: string,
  created_at: Date,
  updated_at: Date,
  first_name?: string,
  last_name?: string,
  full_name?: string,
  img_url?: string,                 
  reset_id: string,                   // exclude from responses    
                                      // reset id used as additional verification on standard user resetting password
  login_status: string,
}

/**
 * All information for use in UI should be returned in UserProfile. UserLogin should not be included as things like
 * restore-user-session do not work with a login, there is no login and the JWT Guard finds user profile based on the refresh_token
 * in the user profile, so no UserLogin would be available.
 */
export interface UserProfile {
  id: number,
  email: string,
  username?: string,
  first_name?: string,
  last_name?: string,
  img_url?: string,
  refresh_token?: string,
  created_at: Date,
  updated_at: Date,
  settings?: Record<string, any>,
  roles?: string[]
}

export interface UserOrg {
  org_id: number,
  org_role: string
}

export interface OAuthUser {
  id: number;
  email: string;
  name: string;
  provider?: string;
}

export interface UserLoginHistory {
  id: number,
  user_id: number,
  login_at: Date,
  ip_address: string,
  type: string,
}

export enum UserLoginProvider {
  // yeah im using lowercase, so sue me.
  email = 'email',
  google = 'google',
  github = 'github',
  facebook = 'facebook',
  apple = 'apple',
  steam = 'steam'
}

export interface CreateUserProfile {
  email: string,
  first_name: string,
  last_name: string,
  refresh_token?: string
}

export enum UserRole {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN'
}

export enum ProfileStatus {
  ACTIVE = 'ACTIVE',
  DORMANT = 'DORMANT',
  BANNED = 'BANNED'
}
export enum LoginStatus {
  ACTIVE = 'ACTIVE',
  UNCONFIRMED_EMAIL = 'UNCONFIRMED_EMAIL'
}

export interface ConfirmStandardUserEmailDto {
  email: string;
  hash: string;
}

export enum LoginTrackingTypes {
  'ACTIVE_NAVIGATION' = 'ACTIVE_NAVIGATION',
  'REFRESH_TOKEN' = 'REFRESH_TOKEN'
}

export interface RequestResetStandardUserPasswordDto {
  email: string,
}

export interface ResetStandardUserPasswordDto {
  email: string,
  reset_id: string,
  new_password: string
}

export interface LoginStandardUserDto {
  email: string,
  password: string,
}

export interface CreateStandardUserDto {
  email: string,
  password: string,
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