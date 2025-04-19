import { ConflictException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfirmStandardUserEmailDto, RegisterStandardUserDto, RequestResetStandardUserPasswordDto, ResetStandardUserPasswordDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Profile } from 'passport';
import { randomBytes } from 'crypto';
import { AuthMessages, AuthResponseMessageDto } from './auth.dto';
import { EmailService } from 'src/email/email.service';
import { SqlAuthService } from 'src/auth/sql-auth/sql-auth.service';
import { LoginStatus, UserLogin, UserLoginProvider, UserProfile } from 'src/users/user.types';
import { SimpleStringHasherService } from './services/simple-string-hasher/simple-string-hasher.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly sqlAuthService: SqlAuthService,
    private readonly simpleStringHasherService: SimpleStringHasherService
  ) {}

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            USER FINDER HELPERS                               //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async findOneUserLoginById(id: number): Promise<Partial<UserLogin> | null> {
    const userLogin = await this.sqlAuthService.findOneUserLoginById(id);
    if (!userLogin) {
      this.logger.log('warn', `Cannot find one user login by id. User id not found: ${id}`);
      return null; // User not found
    };
    return this.excludePropsFromUserLoginType(userLogin); // Authentication successful
  };

  async findOneUserProfileById(id: number): Promise<Partial<UserProfile> | null> {
    const userProfile = await this.sqlAuthService.findOneUserProfileById(id);
    if (!userProfile) {
      this.logger.log('warn', `Cannot find one user profile by id. User profile id not found: ${id}`);
      return null; // User not found
    };
    return userProfile; // Authentication successful
  };

  async findOneUserLoginByEmail(email: string): Promise<Partial<UserLogin> | null> {
    const userLogin = await this.sqlAuthService.findOneUserLoginByEmail(email);
    if (!userLogin) {
      this.logger.log('warn', `Cannot find one user login by email. User id not found: ${email}`);
      return null; // User not found
    };
    return this.excludePropsFromUserLoginType(userLogin); // Authentication successful
  };

  async findOneUserLoginByProvider(oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<UserLogin> | null> {
    const userLogin = await this.sqlAuthService.findOneUserLoginByProvider(oauth_provider, oauth_provider_user_id);
    if (!userLogin) {
      this.logger.log('warn', `Cannot find one user login by provider. User not found: ${oauth_provider} - ${oauth_provider_user_id}`);
      return null; // User not found
    };
    return this.excludePropsFromUserLoginType(userLogin); // Authentication successful
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            USER PROFILE FINDER HELPERS                       //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async findOneUserProfileByRefreshToken(refresh_token: string): Promise<Partial<UserLogin> | null> {
    const user = await this.sqlAuthService.findOneUserProfileByRefreshToken(refresh_token);
    if (!user) {
      this.logger.log('warn', `Cannot find one user profile by refresh_token. User not found: ${refresh_token}`);
      return null; // User not found
    };
    return this.excludePropsFromUserLoginType(user); // Authentication successful
  };


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           JWT ACCESS/REFRESH HELPERS                         //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async generateAccessJwt(userId: string): Promise<string> {
    const payload = { userId };
    const jwtAccessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION });
    return jwtAccessToken;
  };

  async generateRefreshJwt(): Promise<string> {
    const jwtToken = randomBytes(64).toString('hex'); // Generate a random token
    const saltRounds = 10;
    const hashedJwtRefreshToken = await bcrypt.hash(jwtToken, saltRounds);
    return hashedJwtRefreshToken;
  };

  async updateUsersRefreshTokenInUserProfile(userProfileId: number, refreshToken: string): Promise<any> {
    try {
      return this.sqlAuthService.updateUsersRefreshTokenInUserProfile(userProfileId, refreshToken);
    } catch (error: unknown) {
      this.logger.log('warn', `Error updating refresh token: ${error}`);
    };
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           STANDARD USER HELPERS                              //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // when user registers with standard email/ password combination as opposed to using OAuth.
  async registerStandardUser(registerStandardUserDto: RegisterStandardUserDto): Promise<AuthResponseMessageDto> {
    const { email, password } = registerStandardUserDto;
    
    // Check if the user already exists via email
    const existingStandardUserLogin: Partial<UserLogin> | null = await this.sqlAuthService.findOneUserLoginByEmailAndProvider(email, UserLoginProvider.email);
    this.logger.warn(`existingStandardUserLogin from registerStandardUser: ${existingStandardUserLogin}`);
    if (!existingStandardUserLogin) {

      // check if user profile with email already exists in user_profiles table
      const existingUserProfile: Partial<UserProfile> | null = await this.sqlAuthService.findOneUserProfileByEmail(email);

      // create access and refresh jwts for users first login 
      let userProfile: Partial<UserProfile>;
      // const jwtAccessToken: string = await this.generateAccessJwt(Math.random().toString());
      // const jwtRefreshToken: string = await this.generateRefreshJwt();
      // if no profile exists, insert new user to user_profiles and return user_profile
      if (!existingUserProfile) {

        const createProfileObject = {
          email: email,
          first_name: '',
          last_name: '',
          img_url: '',
          // refresh_token: jwtRefreshToken
        }
        const newUserProfile: Partial<UserProfile> = await this.sqlAuthService.insertUserProfile(createProfileObject);
        userProfile = newUserProfile;
      }
      // if profile exists, user is adding standard email login method, insert new login to user_logins and return existing profile from user_profiles
      else if (existingUserProfile) {
        // update refresh jwt in user_profiles table for future access for existing profile
        // userProfileForReturn = await this.updateUsersRefreshTokenInUserProfile(existingUserProfile.id, jwtRefreshToken);
        userProfile = existingUserProfile;
      }


      /**
       *  No matter the status if user_profile exists, must insert new user_login, but also require profile_id from user_profiles, if that already exists or not
       */

      // hash user generated password for storage in user_logins table
      const hashedPassword: string = await this.hashPassword(password);

      // create reset_id for future usage to assist resetting standard user password
      const reset_id: string = await this.generateResetId();

      // Create and save the new user login in user_logins table with LoginStatus.UNCONFIRMED_EMAIL
      const newUserLogin: Partial<UserLogin> = await this.sqlAuthService.insertStandardUserLogin(userProfile.id, email, hashedPassword, reset_id);


      // provide success AuthResponseMessage from successful registration
      const successfulRegisterResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_REGISTRATION_SUCCESS,
        // user: userProfileForReturn,
        // jwtAccessToken: jwtAccessToken,
        // jwtRefreshToken: jwtRefreshToken
      };
      return successfulRegisterResponseMessage;
    } else if (existingStandardUserLogin) {
      // user email already registered through oauth or standard method. Either way, cannot create new account.
      this.logger.log('warn', `Cannot register user. User email/account already exists in db: ${existingStandardUserLogin.email}`);
      const failedRegistrationResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_REGISTRATION_FAILED,
        email: existingStandardUserLogin.email ,
        provider: existingStandardUserLogin.login_provider
      };
      return failedRegistrationResponseMessage;
    };
  };

  async sendConfirmationEmailWithSimpleHash(email: string): Promise<AuthResponseMessageDto> {
    const hashForConfirmationEmail: string = this.simpleStringHasherService.generateHash(email);

    try {
      const smtpEmailResponse: { messageId: string } =  await this.emailService.sendConfirmationEmailForStandardLoginEmailSdk(email, hashForConfirmationEmail);
      const confirmEmailResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_SENT_SUCCESS,
        message_two: `messageId: ${smtpEmailResponse.messageId}`
      };
      return confirmEmailResponseMessage;
    } catch (err:unknown) {
      const confirmEmailResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_SENT_FAILED,
        message_two: `error: ${err}`
      };
      return confirmEmailResponseMessage;
    }
  }

  async confirmStandardUserEmailAndReturnUserProfile(confirmStandardUserEmailDto: ConfirmStandardUserEmailDto): Promise<AuthResponseMessageDto> {
    const { email, hash } = confirmStandardUserEmailDto;
    const emailHashedToCompare: string = this.simpleStringHasherService.generateHash(email);

    if (emailHashedToCompare !== hash) {
      const confirmEmailErrorResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED_NO_MATCH
      };
      return confirmEmailErrorResponseMessage;
    }

    try {
      // hash matches thus set user login to active, which will return updated UserLogin
      const updatedUserLogin: Partial<UserLogin> = await this.sqlAuthService.updateStandardUserLoginStatusToActive(email);
  
      // fetch user profile for return
      const user: Partial<UserProfile> = await this.sqlAuthService.findOneUserProfileById(updatedUserLogin.profile_id);

      // generate tokens for initial login
      const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
      const jwtRefreshToken = await this.generateRefreshJwt();

      const confirmEmailSuccessResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_SUCCESS,
        user: user,
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return confirmEmailSuccessResponseMessage;
    } catch (err: unknown) {
      const confirmEmailErrorResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED,
        message_two: `error: ${err}`
      };
      return confirmEmailErrorResponseMessage;
    }
  }

  async loginStandardUser(email: string, password: string): Promise<AuthResponseMessageDto> {
    const user: Partial<UserLogin> | null = await this.sqlAuthService.findOneUserLoginByEmail(email);
    const isPasswordMatch: boolean = await this.verifyPassword(password, user.standard_login_password);

    if (user === null) {
      this.logger.log('warn', `Cannot login user. User email/password combination not found: ${email}`);
      const noRegisteredUserResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED,
        email: email
      };
      return noRegisteredUserResponseMessage;

    // TODO: cleanup front end redirects from this...now accepting multiple logins that map to single user profile
    // } else if (user && user.login_provider !== null) {
    //   const existingOauthRegistrationResponseMessage: AuthResponseMessageDto = {
    //     message: AuthMessages.STANDARD_LOGIN_FAILED_EXISTING,
    //     email: email,
    //     provider: user.login_provider
    //   };
    //   return existingOauthRegistrationResponseMessage;
    } else if (user && user.login_status === LoginStatus.UNCONFIRMED_EMAIL) {
      this.logger.log('warn', `Cannot login user. User email/password combination found, but user has not confirmed login by email response: ${email}`);
      const noConfirmedUserLoginResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_LOGIN_FAILED_NOT_CONFIRMED,
        email: email
      };
      return noConfirmedUserLoginResponseMessage;

    } else if (user && !isPasswordMatch) {
      const failedPasswordResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH,
        email: user.email ,
        provider: user.login_provider
      };
      return failedPasswordResponseMessage;
    } else if (user && isPasswordMatch) {
      // otherwise return user information with tokens
      const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
      const jwtRefreshToken = await this.generateRefreshJwt();

      // fetch user profile with email from user_profiles table
      const existingUserProfile: Partial<UserProfile> | null = await this.sqlAuthService.findOneUserProfileByEmail(email);
  
      // update refresh jwt in database for future access
      this.updateUsersRefreshTokenInUserProfile(existingUserProfile.id, jwtRefreshToken);
      
      const standardLoginSuccessResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_LOGIN_SUCCESS,
        user: existingUserProfile,
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return standardLoginSuccessResponseMessage;
    };
  };

  async emailStandardUserToResetPassword(requestResetStandardPasswordDto: RequestResetStandardUserPasswordDto): Promise<AuthResponseMessageDto> {
    try {
      const { email } = requestResetStandardPasswordDto;
      const userLogin: Partial<UserLogin> = await this.sqlAuthService.findOneUserLoginByEmailAndProvider(email, UserLoginProvider.email);
      console.log('userLogin in emailStandardUserToResetPassword: ', userLogin);
      

      if (!userLogin) {
        const failedPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
          message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
        };
        return failedPasswordResetRequestResponseMessage;
      }
      else if (userLogin && userLogin.login_status === LoginStatus.UNCONFIRMED_EMAIL) {
        const failedPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
          message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED_NO_CONFIRMATION
        };
        return failedPasswordResetRequestResponseMessage;
      }
      else if (userLogin) {
        const { reset_id } = userLogin as UserLogin;
        const urlForEmail = `${process.env.FRONTEND_URL}/reset-password/?email=${encodeURIComponent(email)}&reset_id=${reset_id}`;  // reset_id is already URL safe format so do no use encodeURIComponent
        
        try {
          const smtpEmailResponse: { messageId: string } =  await this.emailService.sendResetPasswordLinkEmailSdk(email, urlForEmail);
          console.log('smtpEmailResponse: ', smtpEmailResponse);
          
          const successPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
            message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS,
            message_two: `messageId: ${smtpEmailResponse.messageId}`
          };
          return successPasswordResetRequestResponseMessage;
        } catch (err: unknown) {
          const successPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
            message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS,
            message_two: `error: ${err}`
          };
          return successPasswordResetRequestResponseMessage;
        }
      };


    } catch (error: unknown) {
      this.logger.log('warn', `Error sending email to standard user requesting password reset: ${error}`);
      const failedPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
      };
      return failedPasswordResetRequestResponseMessage;
    };
  };

  async resetStandardUserPassword(resetDto: ResetStandardUserPasswordDto): Promise<AuthResponseMessageDto> {
    const { email, new_password, reset_id } = resetDto;
    
    // Check if user in db by email and resetId
    const userLogin: Partial<UserLogin> = await this.sqlAuthService.findOneUserLoginByEmailAndResetId(email, reset_id);

    if (!userLogin) {
      // user not found error
      const standardResetLoginFailResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_RESET_FAILED,
      };
      return standardResetLoginFailResponseMessage;
    } 
    else {
      // update the user_login with new hashed password and create new reset_id for next use

      // hash user generated password for storage in db
      const hashedPassword: string = await this.hashPassword(new_password);

      // create reset_id for future usage to assist resetting standard user password
      const newResetId: string = await this.generateResetId();

      // update password and reset_id for saving updated record
      userLogin.standard_login_password = hashedPassword;
      userLogin.reset_id = newResetId;

      // save new hashed password and reset_id for user
      const updatedUser = await this.sqlAuthService.updateStandardUserLoginPasswordAndResetId(email, hashedPassword, newResetId);

      const jwtAccessToken = await this.generateAccessJwt(userLogin.id.toString());
      const jwtRefreshToken = await this.generateRefreshJwt();

      // fetch user profile with email from user_profiles table
      const existingUserProfile: Partial<UserProfile> | null = await this.sqlAuthService.findOneUserProfileByEmail(email);

      // update refresh jwt in database for future access
      this.updateUsersRefreshTokenInUserProfile(existingUserProfile.id, jwtRefreshToken);
      
      const standardResetLoginSuccessResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_RESET_SUCCESS,
        user: existingUserProfile,
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return standardResetLoginSuccessResponseMessage;
    };
  };

  // hashes standard login password for storage in user_logins table
  private async hashPassword(rawPassword: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
    return hashedPassword;
  };

  // checks standard user password provided hashed equals the stored hashed password in user_logins table
  private async verifyPassword(plainPassword: string, storedHashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, storedHashedPassword);
  };

  // generates reset_id for use in user_logins table for standard login users with provider of email
  private async generateResetId(): Promise<string> {
    return await randomBytes(64).toString('hex');
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                     STANDARD USER W EMAIL HELPERS                            //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // async sendRequestPasswordResetEmail(email: string, resetLink: string): Promise<{ messageId: string }> {
  //   const emailResponse: { messageId: string } = await this.emailService.sendResetPasswordLinkEmailSdk(email, resetLink);
  //   return emailResponse;
  // };

  // async sendConfirmationEmailForStandardLogin(email: string, resetLink: string): Promise<{ messageId: string }> {
  //   const emailResponse: { messageId: string } = await this.emailService.sendConfirmationEmailForStandardLoginEmailSdk(email, resetLink);
  //   return emailResponse;
  // };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            OAUTH USER HELPERS                                //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // used by every OAuth Auth Guard Strategy to validate user
  async validateOAuthLogin(profile: Profile, provider: UserLoginProvider): Promise<AuthResponseMessageDto> {
    let userProfileForReturn: Partial<UserProfile>;

    // Check if user_login with email and provider already exists, if so, user_login can fetch respective user profile
    let existingUserLogin: Partial<UserLogin> = await this.sqlAuthService
      .findOneUserLoginByEmailAndProvider(profile.emails[0].value || '', provider);

      console.log('1235: ', profile.emails[0].value, provider);
      
      console.log('validate OAuth: existing user LOGIN: ', existingUserLogin);

    // if no existing user login, will need to create new login and potentially new profile
    if (!existingUserLogin) {

      const { email, first_name, last_name, full_name, img_url, oauth_provider, oauth_provider_user_id} = this
        .extractUserInformationFromOauthProviderProfile(profile, provider);

      /**
       * if OAuth login has no email associated MY POLICY is it will not be accepted as an email address 
       * is required and unique for user profiles
       *  */ 
      if (email === '') {
        this.logger.log('error', `Cannot register OAuth user. ${provider} account data does not have email included. And email is required to create profile in system`);
        const failedOauthRegistrationResponseMessage: AuthResponseMessageDto = { 
          message: AuthMessages.STANDARD_REGISTRATION_FAILED,
          email: 'Misssing but required for system user profile creation' ,
          provider: oauth_provider
        };
        return failedOauthRegistrationResponseMessage;
      } 

      // Email is provided in Oauth user data and can commence with process
      else {
        // const jwtAccessToken: string = await this.generateAccessJwt(Math.random().toString());
        const jwtRefreshToken: string = await this.generateRefreshJwt();
        // check if profile already exists
        const existingUserProfile: Partial<UserProfile> = await this.sqlAuthService.findOneUserProfileByEmail(email);

        // if no profile exists create new profile before creating new login and set as userProfileForReturn
        if (!existingUserProfile) {
          const createProfileObject = {
            email: email,
            first_name: first_name,
            last_name: last_name,
            refresh_token: jwtRefreshToken
          }
          const newUserProfile: Partial<UserProfile> = await this.sqlAuthService.insertUserProfile(createProfileObject, jwtRefreshToken);
          userProfileForReturn = newUserProfile;
          console.log('validate OAuth: new user profile -- 1: ', newUserProfile);
        } else if (existingUserLogin) {
          userProfileForReturn = await this.updateUsersRefreshTokenInUserProfile(existingUserProfile.id, jwtRefreshToken);
        }


        console.log('validate OAuth: existing user profile: ', existingUserProfile);
        console.log('validate OAuth: userProfileForReturn: ', userProfileForReturn);
        

        // User now has user_profile, either fetched from existing or newly created, so can now create new user_login with profile_id
        const newUserLogin: Partial<UserLogin> = await this.sqlAuthService
          .insertOauthUserLogin(userProfileForReturn.id, email, full_name, oauth_provider, oauth_provider_user_id);
        console.log('validate OAuth: new User Login: ', newUserLogin);
      }

    // user_login already exists, thus user_profile already exists, therefore fetch existing user profile
    } else {
      userProfileForReturn = await this.sqlAuthService.findOneUserProfileById(existingUserLogin.profile_id);
    }

    return userProfileForReturn;
  }


  private extractUserInformationFromOauthProviderProfile(profile: Profile, provider: UserLoginProvider): {
    email: string,
    first_name: string,
    last_name: string,
    full_name: string,
    img_url: string,
    oauth_provider: string,
    oauth_provider_user_id: string
  } {
    // Extract user information based on provider
    let email: string = '';
    let first_name: string = '';
    let last_name: string = '';
    let full_name: string = '';
    let img_url: string = '';
    let oauth_provider: string = '';
    let oauth_provider_user_id: string = '';

    switch (provider) {
      case 'google':
        email = profile.emails[0].value || '';
        first_name: profile.name.givenName || '';
        last_name: profile.name.familyName || '';
        full_name = profile.displayName || '';
        img_url = profile.photos[0].value || '';
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id;
        break;
      case 'facebook':
        email = profile.emails[0].value || '';
        first_name: profile.name.givenName || '';
        last_name: profile.name.familyName || '';
        full_name = `${profile.name.givenName} ${profile.name.familyName}` || '';
        img_url = profile.photos[0].value || '';
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id;
        break;
      case 'github':
        email = profile.emails[0].value || ''; // by defult does not include email. User may include for notifications, but not required, thus not depended on.
        first_name: profile.name.givenName || '';
        last_name: profile.name.familyName || '';
        full_name = profile.displayName || '';
        img_url = profile.photos[0].value || '';
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id
        break;
      // case 'apple':
      // apple oauth login requires a developer account which is $99/year. So just no.
      default:
        throw new Error('Unsupported provider');
    };

    return {
      email: email,
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      img_url: img_url,
      oauth_provider: oauth_provider,
      oauth_provider_user_id: oauth_provider_user_id
    };
  }

















  

  excludePropsFromUserLoginType(userLogin: Partial<UserLogin>): Partial<UserLogin> {
    if ('standard_login_password' in userLogin) {
      delete userLogin.standard_login_password;
    }
    return userLogin;
  }
}
