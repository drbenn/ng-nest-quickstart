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

  // registers user then provides jwt for use in automatic login
  @Post('register-standard')
  async register(
    @Body() registerStandardUserDto: RegisterStandardUserDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<Partial<User>> {
    // register user and provide newUser record with user id record
    const newUser: {user: Partial<User>, jwtToken: string} = await this.authService.registerStandardUser(registerStandardUserDto);
  
    // Set the JWT as a httpOnly cookie in response
    res.cookie('jwt', newUser.jwtToken, {
      httpOnly: true,                                 // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),     // Expiration time (30 minutes in milliseconds)
    });
    
    // Return basic user info for ui
    return newUser.user;
  };

  
  @Post('login-standard')
  async login(
    @Body() loginStandardUserDto: LoginStandardUserDto,
    @Res({ passthrough: true }) res: Response, // Enables passing response
  ): Promise<Partial<User>> {
    const login: {user: Partial<User>, jwtToken: string} = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);

    // Set the JWT as a httpOnly cookie in response
    res.cookie('jwt', login.jwtToken, {
      httpOnly: true,                                 // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),     // Expiration time (30 minutes in milliseconds)
    });
    
    // Return basic user info for ui
    return login.user;
  };

  // logs out of both standard and OAuth users by clearing the jwt from client browser
  @Post('logout')
  async logout(@Res() res: Response) {
    // Clear the JWT cookie    
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  };

  @UseGuards(JwtAuthGuard) // Protect the route with the JWT Auth Guard which if cookie present will retrieve and include user data in req
  @Post('restore-user')
  async restoreUser(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<Partial<User>> {
    const restoredUser: Partial<User> = req['user'];

    // get fresh token for user restoring session
    const jwtToken: string = await this.authService.generateJwt(restoredUser.id, restoredUser.email);

    // Set the JWT as a httpOnly cookie in response
    res.cookie('jwt', jwtToken, {
      httpOnly: true,                                 // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),     // Expiration time (30 minutes in milliseconds)
    });
    // Return basic user info for ui
    return restoredUser;
  };

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
      const oAuthUser: Partial<User> = req['user'];
      const jwtToken: string = await this.authService.generateJwt(oAuthUser.id, oAuthUser.email);
      // const refreshToken: string = await this.authService.generateRefreshToken(oAuthUser.id);

      if (!process.env.FRONTEND_URL) {
        this.logger.log('warn', `FRONTEND_URL is not set in environment variables`);
        throw new Error('FRONTEND_URL is not set in environment variables');
      };

      console.log('token expiration in handleoauth redirect');
      console.log(process.env.JWT_ACCESS_TOKEN_EXPIRATION);
      
      // respond with httpOnly cookie
      // It's safer to set the JWT as an HTTP-only cookie
      res.cookie('jwt', jwtToken, { 
        httpOnly: true,                                 // Prevent access from JavaScript
        secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
        sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
        maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),     // Expiration time (30 minutes in milliseconds)
      });

      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      // Redirect to frontend with JWT token
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error: unknown) {
      this.logger.error(`Error during OAuth redirect: ${error}`);

      // Redirect the user to an error page
      res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
    };
  };

}
