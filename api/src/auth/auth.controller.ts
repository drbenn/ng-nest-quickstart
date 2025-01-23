import { Body, Controller, Get, Inject, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginStandardUserDto, RegisterStandardUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseMessageDto, UserWithTokensDto } from './auth.dto';

export interface OAuthUser {
  id: number;
  email: string;
  name: string;
  provider?: string;
}

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
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

      res.clearCookie('refreshToken', {
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
  async restoreUser(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<Partial<User>> {
    try {
      const restoredUser: Partial<User> = req['user'];

      // get fresh token for user restoring session
      const jwtToken: string = await this.authService.generateAccessJwt(restoredUser.id);

      // Set the JWT as a httpOnly cookie in response
      res.cookie('jwt', jwtToken, {
        httpOnly: true,                                           // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
        sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
      });

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

    res.cookie('refreshToken', jwtRefreshToken, {
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
    @Body() registerStandardUserDto: RegisterStandardUserDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<Partial<User> | ResponseMessageDto | any> {
    try {
      // register user and provide newUser record with user id record
      // type NewUserResponse =
      //   | UserWithTokensDto
      //   | ResponseMessageDto
      //   | null;

      const newUserResponse: UserWithTokensDto | ResponseMessageDto | null = await this.authService.registerStandardUser(registerStandardUserDto);
      console.log('resposne from registerStandardUser in service: ', newUserResponse);
      
    
      if (newUserResponse === null) {
        const responseMessage: ResponseMessageDto = {
          message: 'Auth failed. Account with email does not exist',
          isRedirect: true,
          email: registerStandardUserDto.email,
          redirectPath: `/auth/failed-login/`
        };
        return responseMessage;
      } else if ('message' in newUserResponse) {
        console.log('standard user register & login response: existing email in other provider redirect');
        const { email, provider } = newUserResponse;
        const responseMessage: ResponseMessageDto = {
          message: 'Auth failed. Account with email exists but under oauth login',
          email: email,
          provider: provider,
          isRedirect: true,
          redirectPath: `/auth/existing-user/`
        };
        return responseMessage;      
      } else if ('user' in newUserResponse) {
        console.log('standard user register & login response: successful register/login');
        const { user, jwtAccessToken, jwtRefreshToken } = newUserResponse;
        const userReturn = user as UserWithTokensDto;
        this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
    //     // res.cookie('jwt', jwtAccessToken, {
    //     //   httpOnly: true,                                           // Prevent access from JavaScript
    //     //   secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
    //     //   sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
    //     //   maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
    //     // });
    
    //     // res.cookie('refreshToken', jwtRefreshToken, {
    //     //   httpOnly: true,
    //     //   secure: process.env.NODE_ENV === 'production',
    //     //   sameSite: 'strict',
    //     //   maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),  // Expiration time
    //     // });
        
        // Return basic user info for ui
        return userReturn;
      };
    } catch (error: unknown) {
      this.logger.error(`Error during standard registration: ${error}`);
      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
    };
  };

  @Post('login-standard')
  async login(
    @Body() loginStandardUserDto: LoginStandardUserDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<Partial<User>> {
    try {
      type LoginStandardUserResponse =
      | UserWithTokensDto
      | ResponseMessageDto
      | null;

      const loginResponse: LoginStandardUserResponse = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);
      
      if (loginResponse === null) {
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/failed-login/?email=${encodeURIComponent(loginStandardUserDto.email)}`;
        res.redirect(redirectUrl); 
      } else if ('message' in loginResponse) {
        console.log('standard user login response: existing email in other provider redirect');
        const { email, provider } = loginResponse;
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/existing-user/?email=${encodeURIComponent(email)}&provider=${encodeURIComponent(provider)}`;
        res.redirect(redirectUrl);  
      } else if ('user' in loginResponse) {
        console.log('standard user register & login response: successful register/login');
        const { user, jwtAccessToken, jwtRefreshToken } = loginResponse;
        this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
        return user;
      };
      // console.log('standard user login response: existing email in other provider redirect');
      // this.sendSuccessfulLoginCookies(res, login.jwtAccessToken, login.jwtRefreshToken)
      // res.cookie('jwt', login.jwtAccessToken, {
      //   httpOnly: true,                                           // Prevent access from JavaScript
      //   secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
      //   sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
      //   maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
      // });

      // res.cookie('refreshToken', login.jwtRefreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),  // Expiration time
      // });

      // Return basic user info for ui
      // return login.user;

    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect from login-standard: ${error}`);
      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
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

  // User has already been authenticated by OAuth and new user added to db or user db information fetched.
  // Either way, with successful Oauth interchange with provider, req now includes user data of type User from the db.
  private async handleOAuthRedirect(req: Request, res: Response): Promise<void> {
    // console.log('handle OATH REDIRECT');
    // console.log(req);
    const response: Partial<User> | ResponseMessageDto = req['user'];                      // user from database, not oauth user profile
    let user: Partial<User> | null = response['message'] ? null : response;
    
    // if duplicate user attempt do not provide user and redirect to inform user of existing login method
    if (!user) {
      console.log('oauth user register/login response: existing email in other provider redirect');
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/existing-user/?email=${encodeURIComponent(response['email'])}&provider=${encodeURIComponent(response['provider'])}`;
      res.redirect(redirectUrl);  
    } else {
      // return jwt access and refresh tokens and redirect to oauth/callback to fetch appropriate user data
      try {
        console.log('oauth user register/login response: existing email in other provider redirect');
        const jwtAccessToken: string = await this.authService.generateAccessJwt(user.id);
        const jwtRefreshToken: string = await this.authService.generateRefreshJwt();
        await this.authService.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
  
        if (!process.env.FRONTEND_URL) {
          this.logger.log('warn', `FRONTEND_URL is not set in environment variables`);
          throw new Error('FRONTEND_URL is not set in environment variables');
        };
        
        this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
        // res.cookie('jwt', jwtAccessToken, {
        //   httpOnly: true,                                           // Prevent access from JavaScript
        //   secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
        //   sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
        //   maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
        // });
    
        // res.cookie('refreshToken', jwtRefreshToken, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === 'production',
        //   sameSite: 'strict',
        //   maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),
        // });
  
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
