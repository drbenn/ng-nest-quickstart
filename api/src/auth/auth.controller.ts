import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginStandardUserDto, RegisterStandardUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
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
      maxAge: 48 * 60 * 60 * 1000,                    // Expiration time (48 hours in milliseconds)
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
      maxAge: 48 * 60 * 60 * 1000,                    // Expiration time (48 hours in milliseconds)
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
      maxAge: 48 * 60 * 60 * 1000,                    // Expiration time (48 hours in milliseconds)
    });
    // Return basic user info for ui
    return restoredUser;
  };


  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow, caught and processed by google authguard strategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return this.handleRedirect(req, res);
  }

  private handleRedirect(req: Request, res: Response) {
    const user: Partial<User> = req['user'];
    const jwtToken = this.authService.getUserandJwtForOAuth(user.email);

    // Redirect to frontend with JWT token
    // It's safer to set the JWT as an HTTP-only cookie
    res.cookie('jwt', jwtToken, { 
      httpOnly: true,                                 // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
      maxAge: 48 * 60 * 60 * 1000,                    // Expiration time (48 hours in milliseconds)
    });
    res.redirect(`${process.env.FRONTEND_URL}`);
  }

  // // Protected Route Example
  // @Get('protected')
  // @UseGuards(JwtAuthGuard) // Protect this route with the JWT Guard
  // async getProtectedData(@Req() req: Request) {
  //   return {
  //     message: 'You have access to this protected route!',
  //     user: req.user,
  //   };
  // }

  // // login using OAuth
  // @Get(':provider')
  // @UseGuards(AuthGuard('oauth'))
  // async loginOAuth(@Req() req: any, @Res() res: Response, @Param('provider') provider: string) {
  //   const profile = req.user; // User profile from OAuth provider
  //   const { jwt } = await this.authService.loginWithOAuth(profile);

  //   // Set JWT as an HttpOnly cookie
  //   res.cookie('jwt', jwt, { httpOnly: true, secure: true });
  //   res.redirect('/'); // Redirect to your UI after login
  // };

}
