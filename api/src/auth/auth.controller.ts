import { Body, Controller, Get, Inject, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AuthMessages, AuthResponseMessageDto, UserProfile, ConfirmStandardUserEmailDto, LoginStandardUserDto,
  RequestResetStandardUserPasswordDto, ResetStandardUserPasswordDto, CreateStandardUserDto, 
  LoginTrackingTypes} from '@common-types';
import { SqlAuthService } from './sql-auth/sql-auth.service';



@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly sqlAuthService: SqlAuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                  AUTH METHOD INDEPENDENT USER CONTROLLERS                    //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // logs out of both standard and OAuth users by clearing the jwt from client browser
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      // Clear the JWT cookie    
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: unknown) {
      this.logger.error(`Error during user logout: ${error}`);
      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
    };
  };

  @UseGuards(JwtAuthGuard) // Protect the route with the JWT Auth Guard which if cookie present will retrieve and include user data in req
  @Post('restore-user')
  async restoreUser(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<Partial<UserProfile>> {
    try {
      const restoredUser: Partial<UserProfile> = req['user'];
      // get fresh token for user restoring session
      const jwtToken: string = await this.authService.generateAccessJwt(restoredUser.id.toString());

      // Set the JWT as a httpOnly cookie in response
      res.cookie('jwt', jwtToken, {
        httpOnly: true,                                           // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
        sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
      });

      // log user login
      if (restoredUser.id && req['ip']) {
        await this.sqlAuthService.insertUserLoginTracking(restoredUser.id, req['ip'], LoginTrackingTypes.REFRESH_TOKEN);
      }

      // res.redirect(`${process.env.FRONTEND_URL}`);
      // Return basic user info for ui
      return restoredUser;
    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect, new access token potentially generated for existing user: ${error}`);
      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
    };
  };

  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           COOKIE RESPONSES                                   //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  private sendSuccessfulLoginCookies(res: Response, jwtAccessToken: string, jwtRefreshToken: string) {
    res.cookie('jwt', jwtAccessToken, {
      httpOnly: true,                                           // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
    });

    res.cookie('refresh_token', jwtRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),  // Expiration time
    });
  };


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           STANDARD USER CONTROLLERS                          //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // registers user then provides jwt for use in automatic login
  @Post('register-standard')
  async register(
    @Body() createStandardUserDto: CreateStandardUserDto,
    @Req() req: Request,                          // req for capturing and logging ip
    @Res({ passthrough: true }) res: Response,    // Enables passing response
  ): Promise<AuthResponseMessageDto> {
    try {
      const newUserResponse: AuthResponseMessageDto = await this.authService.registerStandardUser(createStandardUserDto);   
      this.logger.warn(`newUserResponse from register-standard endpoint: ${newUserResponse}`);
      
      if (newUserResponse.message === AuthMessages.STANDARD_REGISTRATION_FAILED) {
        const failedRegistrationResponseMessage: AuthResponseMessageDto = newUserResponse;
        return failedRegistrationResponseMessage;
      } 
      else if (newUserResponse.message === AuthMessages.STANDARD_REGISTRATION_SUCCESS) {
        const { userProfile, jwtAccessToken, jwtRefreshToken, message } = newUserResponse;
        const sendConfirmEmailResponse: AuthResponseMessageDto = await this.authService.sendConfirmationEmailWithSimpleHash(userProfile.email);
        return sendConfirmEmailResponse;
      };
    } catch (error: unknown) {
      this.logger.error(`Error during standard registration: ${error}`);
      this.logger.error(`Error during standard registration registerStandardUserDto: ${JSON.stringify(createStandardUserDto)}`);
      const errorRegisterResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_REGISTRATION_ERROR
      };
      return errorRegisterResponseMessage;
    };
  };

  @Post('confirm-standard-email')
  async confirm(
    @Body() confirmStandardUserEmailDto: ConfirmStandardUserEmailDto,
    @Req() req: Request,                          // req for capturing and logging ip
    @Res({ passthrough: true }) res: Response,    // Enables passing response
  ): Promise<AuthResponseMessageDto> {
    try {
      const confirmResponse: AuthResponseMessageDto = await this.authService.confirmStandardUserEmailAndReturnUserProfile(confirmStandardUserEmailDto);

      const { message, userProfile, jwtAccessToken, jwtRefreshToken, message_two } = confirmResponse;
      this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
      // return user profile in response
      const successConfirmEmailResponseMessage: AuthResponseMessageDto = {
        message: message,
        userProfile: userProfile
      };

      if (message_two) {
        successConfirmEmailResponseMessage['message_two'] = message_two;
      }
      return successConfirmEmailResponseMessage;
    } catch (err: unknown) {
      const errorConfirmEmailResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_CONFIRM_EMAIL_CONFIRMED_FAILED
      };
      return errorConfirmEmailResponseMessage;
    }
  }

  @Post('login-standard')
  async login(
    @Body() loginStandardUserDto: LoginStandardUserDto,
    @Req() req: Request, // req for capturing and logging ip
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<AuthResponseMessageDto | any> {   
    try {
      const loginResponse: AuthResponseMessageDto = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);
      if (loginResponse.message === AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED) {
        const failedEmailNotRegisteredResponseMessage: AuthResponseMessageDto = loginResponse;
        return failedEmailNotRegisteredResponseMessage;
      }
      else if (loginResponse.message === AuthMessages.STANDARD_LOGIN_FAILED_EXISTING) {
        const existingOauthRegistrationResponseMessage: AuthResponseMessageDto = loginResponse;
        return existingOauthRegistrationResponseMessage;
      }
      else if (loginResponse.message === AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH) {
        const failedPasswordResponseMessage: AuthResponseMessageDto = loginResponse;
        return failedPasswordResponseMessage;
      }
      else if (loginResponse.message === AuthMessages.STANDARD_LOGIN_SUCCESS) {
        // if (loginResponse.user.id && req['ip']) {
        //   await this.sqlAuthService.insertUserLoginTracking(loginResponse.user.id, req['ip'], LoginTrackingTypes.ACTIVE_NAVIGATION);
        // }
        const { message, userProfile, jwtAccessToken, jwtRefreshToken } = loginResponse;

        // log user login
        if (userProfile.id && req['ip']) {
          await this.sqlAuthService.insertUserLoginTracking(userProfile.id, req['ip'], LoginTrackingTypes.ACTIVE_NAVIGATION);
        }

        this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);

        // return user;
        const standardLoginSuccessResponseMessage: AuthResponseMessageDto = { 
          message: message,
          userProfile: userProfile
        };
        return standardLoginSuccessResponseMessage;
      };

    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect from login-standard: ${error}`);
      const errorLoginResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_LOGIN_ERROR
      };
      return errorLoginResponseMessage;
    };
  };


  @Post('reset-standard-password-request')
  async resetStandardPasswordRequest(
    @Body() requestResetStandardPasswordDto: RequestResetStandardUserPasswordDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<AuthResponseMessageDto> {  
    try {
      // send email to user with url params of email and existing resetId ONLY IF STANDARD USER CHECK!!!!
      const requestResetPasswordResponse: AuthResponseMessageDto = await this.authService.emailStandardUserToResetPassword(requestResetStandardPasswordDto);
      return requestResetPasswordResponse;
    } catch (error: unknown) {
      this.logger.error(`Error requesting reset of standard registered user password: ${error}`);
      const errorResetPasswordRequestResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
      };
      return errorResetPasswordRequestResponseMessage;
    };
  };

  @Post('reset-standard-password')
  async resetStandardPassword(
    @Body() resetStandardUserPasswordDto: ResetStandardUserPasswordDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<AuthResponseMessageDto> {
    try {
      // accept users new password and update if email and reset_id match, then generate new reset_id for next time user needs to reset password
      const resetPasswordResponse: AuthResponseMessageDto = await this.authService.resetStandardUserPassword(resetStandardUserPasswordDto);
      this.sendSuccessfulLoginCookies(res, resetPasswordResponse.jwtAccessToken, resetPasswordResponse.jwtRefreshToken);
      
      // return user;
      const standardLoginPasswordResetSuccessResponseMessage: AuthResponseMessageDto = { 
        message: resetPasswordResponse.message,
        userProfile: resetPasswordResponse.userProfile
      };
      return standardLoginPasswordResetSuccessResponseMessage;
    } catch (error: unknown) {
      this.logger.error(`Error resetting standard registered user password: ${error}`);
      const errorResetPasswordResponseMessage: AuthResponseMessageDto = {
        message: AuthMessages.STANDARD_REGISTRATION_ERROR
      };
      return errorResetPasswordResponseMessage;
    };
  };


  //////////////////////////////////////////////////////////////////////////////////
  //                                                                              //
  //                           OAUTH USER CONTROLLERS                             //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req): Promise<void> {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.handleOAuthRedirect(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req): Promise<void> {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.handleOAuthRedirect(req, res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req): Promise<void> {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookbAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.handleOAuthRedirect(req, res);
  }

  /**
   * User has already been authenticated by OAuth and new user added to db or user db information fetched.
   * Either by new oauth login and registering in site db or oauth login with existing site db account, with 
   * successful Oauth authentication with provider, req now includes user data of type User from the db which
   * will then be provided to ui for usage along with auth token to pass guards and refresh token to get new
   * access token when needed.
   * 
   * As using Oauth, ui must redirect offsite to access provider. Thus on response to oauth authentication
   * in server, server must redirect in response. If successful will redirect to oauth/callback. If fail,
   * will redirect to auth/existing-user path with parameters for 'existing-user' page to display to user
   * provider where the user has already registered with site with so they can use that provider or standard
   * email/password login.
   */
  private async handleOAuthRedirect(req: Request, res: Response): Promise<void> {
    const response: Partial<UserProfile> | AuthResponseMessageDto = req['user'];  // user from database fetched in provider guard, not oauth user profile
    let userProfile: Partial<UserProfile> | null = response['message'] ? null : response;    

    // if duplicate user attempt do not provide user and redirect to inform user of existing login method
    if (!userProfile) {
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/existing-user/?email=${encodeURIComponent(response['email'])}&provider=${encodeURIComponent(response['provider'])}`;
      res.redirect(redirectUrl);  
    } else {
      // return jwt access and refresh tokens and redirect to oauth/callback to fetch appropriate user data
      try {
        const jwtAccessToken: string = await this.authService.generateAccessJwt(userProfile.id.toString());
        const jwtRefreshToken: string = await this.authService.generateRefreshJwt();
        await this.authService.updateUsersRefreshTokenInUserProfile(userProfile.id, jwtRefreshToken);
  
        if (!process.env.FRONTEND_URL) {
          this.logger.log('warn', `FRONTEND_URL is not set in environment variables`);
          throw new Error('FRONTEND_URL is not set in environment variables');
        };

        // log user login
        if (userProfile.id && req['ip']) {
          await this.sqlAuthService.insertUserLoginTracking(userProfile.id, req['ip'], LoginTrackingTypes.ACTIVE_NAVIGATION);
        }
        this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
  
        this.logger.log('warn', `Successful OAuth login with cookies::: redirect_url: ${process.env.FRONTEND_URL}/oauth/callback`);

        // oauth requires redirect as ui redirected away from site, cannot return user data, 
        // thus redirecting to oath/callback in ui will fetch user data and then redirect accordingly
        res.redirect(`${process.env.FRONTEND_URL}/oauth/callback`);   
      } catch (error: unknown) {
        this.logger.error(`Error during OAuth redirect from handleOAuthRedirect: ${error}`);        
        // Redirect the user to an error page
        res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
      };
    };
  };

}
