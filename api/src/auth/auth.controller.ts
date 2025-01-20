import { Body, Controller, Get, Inject, Logger, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginStandardUserDto, RegisterStandardUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';


// TODO: REFRESH TOKEN AND CSRF Protection once OAUTH Working

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
    private readonly configService: ConfigService,
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
  //                           STANDARD USER CONTROLLERS                          //
  //                                                                              //
  //////////////////////////////////////////////////////////////////////////////////

  // registers user then provides jwt for use in automatic login
  @Post('register-standard')
  async register(
    @Body() registerStandardUserDto: RegisterStandardUserDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<Partial<User>> {
    try {
      // register user and provide newUser record with user id record
      const newUser: {user: Partial<User>, jwtAccessToken: string, jwtRefreshToken: string} = await this.authService.registerStandardUser(registerStandardUserDto);
    
      res.cookie('jwt', newUser.jwtAccessToken, {
        httpOnly: true,                                           // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
        sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
      });
  
      res.cookie('refreshToken', newUser.jwtRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),  // Expiration time
      });
      
      // Return basic user info for ui
      return newUser.user;
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
      const login: {user: Partial<User>, jwtAccessToken: string, jwtRefreshToken: string} = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);

      res.cookie('jwt', login.jwtAccessToken, {
        httpOnly: true,                                           // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
        sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
      });

      res.cookie('refreshToken', login.jwtRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),  // Expiration time
      });

      // Return basic user info for ui
      return login.user;
    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect: ${error}`);
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
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookbAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  // User has already been authenticated by OAuth and new user added to db or user db information fetched.
  // Either way, with successful Oauth interchange with provider, req now includes user data of type User from the db.
  private async handleOAuthRedirect(req: Request, res: Response) {
    try {
      const user: Partial<User> = req['user'];            // user from database, not oauth user profile
      const jwtAccessToken: string = await this.authService.generateAccessJwt(user.id);
      const jwtRefreshToken: string = await this.authService.generateRefreshJwt();
      await this.authService.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);

      if (!process.env.FRONTEND_URL) {
        this.logger.log('warn', `FRONTEND_URL is not set in environment variables`);
        throw new Error('FRONTEND_URL is not set in environment variables');
      };
      
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
        maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),
      });

      // oauth requires redirect as ui redirected away from site, cannot return user data, 
      // thus redirecting to oath/callback in ui will fetch user data and then redirect accordingly
      res.redirect(`${process.env.FRONTEND_URL}/oauth/callback`);   
    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect: ${error}`);
      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
    };
  };

}
