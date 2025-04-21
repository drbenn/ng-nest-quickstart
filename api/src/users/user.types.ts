// export interface UserLogin {
//   id: number,
//   profile_id: number,                 // id of user_profile
//   email?: string,
//   standard_login_password?: string,    // exclude from responses
//   login_provider: string,             // 'email', 'steam', 'google', 'facebook', 'github'
//   provider_user_id?: string,
//   created_at: Date,
//   updated_at: Date,
//   first_name?: string,
//   last_name?: string,
//   full_name?: string,
//   img_url?: string,                 
//   reset_id: string,                   // exclude from responses    
//                                       // reset id used as additional verification on standard user resetting password
//   login_status: string,
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
//   settings?: Record<string, any>,
//   roles?: string[]
// }

// export interface UserLoginHistory {
//   id: number,
//   user_id: number,
//   login_at: Date,
//   ip_address: string,
//   type: string,
// }

// export enum UserLoginProvider {
//   // yeah im using lowercase, so sue me.
//   email = 'email',
//   google = 'google',
//   github = 'github',
//   facebook = 'facebook',
//   apple = 'apple',
//   steam = 'steam'
// }


// export interface CreateUserProfile {
//   email: string,
//   first_name: string,
//   last_name: string,
//   refresh_token?: string
// }

// export enum UserRole {
//   BASIC = 'BASIC',
//   ADMIN = 'ADMIN'
// }

// export enum ProfileStatus {
//   ACTIVE = 'ACTIVE',
//   DORMANT = 'DORMANT',
//   BANNED = 'BANNED'
// }
// export enum LoginStatus {
//   ACTIVE = 'ACTIVE',
//   UNCONFIRMED_EMAIL = 'UNCONFIRMED_EMAIL'
// }