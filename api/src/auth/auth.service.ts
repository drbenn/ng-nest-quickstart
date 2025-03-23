import { ConflictException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterStandardUserDto, RequestResetStandardPasswordDto, ResetStandardPasswordDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Profile } from 'passport';
import { randomBytes } from 'crypto';
import { AuthMessages, AuthResponseMessageDto } from './auth.dto';
import { EmailService } from 'src/email/email.service';
import { SqlAuthService } from 'src/auth/sql-auth/sql-auth.service';
import { User } from 'src/users/user.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly sqlAuthService: SqlAuthService
  ) {}

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            USER FINDER HELPERS                               //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async findOneUserById(id: number): Promise<Partial<User> | null> {
    const user = await this.sqlAuthService.findOneUserById(id);
    if (!user) {
      this.logger.log('warn', `Cannot find one user by id. User id not found: ${id}`);
      return null; // User not found
    };
    return this.excludePropsFromUserType(user); // Authentication successful
  };

  async findOneUserByEmail(email: string): Promise<Partial<User> | null> {
    const user = await this.sqlAuthService.findOneUserByEmail(email);
    if (!user) {
      this.logger.log('warn', `Cannot find one user by email. User id not found: ${email}`);
      return null; // User not found
    };
    return this.excludePropsFromUserType(user); // Authentication successful
  };

  async findOneUserByProvider(oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<User> | null> {
    const user = await this.sqlAuthService.findOneUserByProvider(oauth_provider, oauth_provider_user_id);
    if (!user) {
      this.logger.log('warn', `Cannot find one user by provider. User not found: ${oauth_provider} - ${oauth_provider_user_id}`);
      return null; // User not found
    };
    return this.excludePropsFromUserType(user); // Authentication successful
  };

  async findOneUserByRefreshToken(refresh_token: string): Promise<Partial<User> | null> {
    const user = await this.sqlAuthService.findOneUserByRefreshToken(refresh_token);
    if (!user) {
      this.logger.log('warn', `Cannot find one user by refresh_token. User not found: ${refresh_token}`);
      return null; // User not found
    };
    return this.excludePropsFromUserType(user); // Authentication successful
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

  async updateUsersRefreshTokenInDatabase(userId: number, refreshToken: string): Promise<any> {
    try {
      return this.sqlAuthService.updateUsersRefreshTokenInDatabase(userId, refreshToken);
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
    const existingUser: Partial<User> | null = await this.sqlAuthService.findOneUserByEmail(email);

    if (!existingUser) {
      // hash user generated password for storage in db
      const hashedPassword: string = await this.hashPassword(password);

      // create reset_id for future usage to assist resetting standard user password
      const reset_id: string = await this.generateResetId();

      // Create and save the new user
      const newUser: Partial<User> = await this.sqlAuthService.insertStandardUser(email, hashedPassword, reset_id);
      
      // create access and refresh jwts for users first login
      const jwtAccessToken: string = await this.generateAccessJwt(newUser.id.toString());
      const jwtRefreshToken: string = await this.generateRefreshJwt();

      // update refresh jwt in database for future access
      this.updateUsersRefreshTokenInDatabase(newUser.id, jwtRefreshToken);

      // provide success AuthResponseMessage from successful registration
      const successfulRegisterResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_REGISTRATION_SUCCESS,
        user: this.excludePropsFromUserType(newUser),
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return successfulRegisterResponseMessage;
    } else if (existingUser) {
      // user email already registered through oauth or standard method. Either way, cannot create new account.
      this.logger.log('warn', `Cannot register user. User email/account already exists in db: ${existingUser.email}`);
      const failedRegistrationResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_REGISTRATION_FAILED,
        email: existingUser.email ,
        provider: existingUser.oauth_provider
      };
      return failedRegistrationResponseMessage;
    };
  };

  async loginStandardUser(email: string, password: string): Promise<AuthResponseMessageDto> {
    const user = await this.sqlAuthService.findOneUserByEmail(email);
    const isPasswordMatch = await this.verifyPassword(password, user.password);

    if (user === null) {
      this.logger.log('warn', `Cannot login user. User email/password combination not found: ${email}`);
      const noRegisteredUserResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED,
        email: email
      };
      return noRegisteredUserResponseMessage;
    } else if (user && user.oauth_provider !== null) {
      const existingOauthRegistrationResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_LOGIN_FAILED_EXISTING,
        email: email,
        provider: user.oauth_provider
      };
      return existingOauthRegistrationResponseMessage;
    } else if (user && !isPasswordMatch) {
      const failedPasswordResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH,
        email: user.email ,
        provider: user.oauth_provider
      };
      return failedPasswordResponseMessage;
    } else if (user && isPasswordMatch) {
      // otherwise return user information with tokens
      const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
      const jwtRefreshToken = await this.generateRefreshJwt();
  
      // update refresh jwt in database for future access
      this.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
      
      const standardLoginSuccessResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_LOGIN_SUCCESS,
        user: this.excludePropsFromUserType(user),
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return standardLoginSuccessResponseMessage;
    };
  };

  async emailStandardUserToResetPassword(requestResetStandardPasswordDto: RequestResetStandardPasswordDto): Promise<AuthResponseMessageDto> {
    try {
      const { email } = requestResetStandardPasswordDto;
      const user: Partial<User> = await this.sqlAuthService.findOneUserByEmail(email);

      if (!user) {
        const failedPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
          message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
        };
        return failedPasswordResetRequestResponseMessage;
      } 
      else if (user && !user.oauth_provider) {
        const { reset_id } = user as User;
        const urlForEmail = `${process.env.FRONTEND_URL}/reset-password/?email=${encodeURIComponent(email)}&reset_id=${reset_id}`;  // reset_id is already URL safe format so do no use encodeURIComponent
        const smtpEmailResponse: { messageId: string } =  await this.emailService.sendResetPasswordLinkEmailSdk(email, urlForEmail);

        const successPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
          message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS,
          message_two: `messageId: ${smtpEmailResponse.messageId}`
        };
        return successPasswordResetRequestResponseMessage;
      };
    } catch (error: unknown) {
      this.logger.log('warn', `Error sending email to standard user requesting password reset: ${error}`);
      const failedPasswordResetRequestResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
      };
      return failedPasswordResetRequestResponseMessage;
    };
  };

  async resetStandardUserPassword(resetDto: ResetStandardPasswordDto): Promise<AuthResponseMessageDto> {
    const { email, newPassword, resetId } = resetDto;
    
    // Check if user in db by email and resetId
    const user: Partial<User> = await this.sqlAuthService.findOneUserByEmailAndResetId(email, resetId);

    if (!user) {
      // user not found error
      const standardResetLoginFailResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_RESET_FAILED,
      };
      return standardResetLoginFailResponseMessage;
    } 
    else {
      // update the user with new hashed password and create new reset_id for next use

      // hash user generated password for storage in db
      const hashedPassword: string = await this.hashPassword(newPassword);

      // create reset_id for future usage to assist resetting standard user password
      const newResetId: string = await this.generateResetId();

      // update password and reset_id for saving updated record
      user.password = hashedPassword;
      user.reset_id = newResetId;

      // save new hashed password and reset_id for user
      const updatedUser = await this.sqlAuthService.updateStandardUserPasswordAndResetId(email, hashedPassword, newResetId);

      const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
      const jwtRefreshToken = await this.generateRefreshJwt();

      // update refresh jwt in database for future access
      this.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
      
      const standardResetLoginSuccessResponseMessage: AuthResponseMessageDto = { 
        message: AuthMessages.STANDARD_RESET_SUCCESS,
        user: this.excludePropsFromUserType(updatedUser),
        jwtAccessToken: jwtAccessToken,
        jwtRefreshToken: jwtRefreshToken
      };
      return standardResetLoginSuccessResponseMessage;
    };
  };

  private async hashPassword(rawPassword: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
    return hashedPassword;
  };

  private async verifyPassword(plainPassword: string, storedHashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, storedHashedPassword);
  };

  private async generateResetId(): Promise<string> {
    return await randomBytes(64).toString('hex');
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                     STANDARD RESET W EMAIL HELPERS                           //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  async sendRequestPasswordResetEmail(email: string, resetLink: string): Promise<{ messageId: string }> {
    const emailResponse: { messageId: string } = await this.emailService.sendResetPasswordLinkEmailSdk(email, resetLink);
    return emailResponse;
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                            OAUTH USER HELPERS                                //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // used by every OAuth Auth Guard Strategy to validate user
  async validateOAuthLogin(profile: Profile, provider: string): Promise<AuthResponseMessageDto> {    
    // Extract user information based on provider
    let email: string =  profile.emails[0].value || '';
    let full_name: string = '';
    let img_url: string = '';
    let oauth_provider: string = '';
    let oauth_provider_user_id: string = '';

    // Check if email already exists, if so return email and provider/standard for user to know what to login with
    let existingUser: Partial<User> = await this.sqlAuthService.findOneUserByEmail(email);

    console.log('ISEXISTING USER:: ', existingUser);
    

    if (existingUser && existingUser.oauth_provider !== provider) {
      return { 
        message: 'email already registered',
        email: existingUser.email ,
        provider: existingUser.oauth_provider
      };
    } else {
      // Otherwise continue and login and/or create account on first login return appropriate user information
      let user: Partial<User> | undefined;
      existingUser ? user = existingUser : user = undefined;
      switch (provider) {
        case 'google':
          email = profile.emails[0].value || null;
          full_name = profile.displayName || null;
          img_url = profile.photos[0].value || null;
          oauth_provider = profile.provider;
          oauth_provider_user_id = profile.id;
          break;
        case 'facebook':
          email = profile.emails[0].value || null;
          full_name = `${profile.name.givenName} ${profile.name.familyName}` || null;
          img_url = profile.photos[0].value || null;
          oauth_provider = profile.provider;
          oauth_provider_user_id = profile.id;
          break;
        case 'github':
          email = profile.emails[0].value || null; // by defult does not include email. User may include for notifications, but not required, thus not depended on.
          full_name = profile.displayName || null;
          img_url = profile.photos[0].value || null;
          oauth_provider = profile.provider;
          oauth_provider_user_id = profile.id
          break;
        // case 'apple':
        // apple oauth login requires a developer account which is $99/year. So just no.
        default:
          throw new Error('Unsupported provider');
      };
  
      if (!user) {
        // Create and save the new user
        user = await this.sqlAuthService.insertOauthUser(email, full_name, img_url, oauth_provider, oauth_provider_user_id);
      };
  
      return this.excludePropsFromUserType(user);
    };
  };













  excludePropsFromUserType(user: Partial<User>): Partial<User> {
    if ('password' in user) {
      delete user.password;
    }
    if ('oauth_provider_user_id' in user) {
      delete user.oauth_provider_user_id;
    }
    if ('reset_id' in user) {
      delete user.reset_id;
    }
    return user;
  }
}
