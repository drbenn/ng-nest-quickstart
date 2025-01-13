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
    console.log(process.env.NODE_ENV);
    
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Clear the refresh token cookie, if used
    // res.clearCookie('refreshToken', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    // });

    return res.status(200).json({ message: 'Logged out successfully' });
  };

  @UseGuards(JwtAuthGuard) // Protect the route with the JWT Auth Guard which if cookie present will retrieve and include user data in req
  @Get('restore-user')
  async restoreUser(@Req() req: Request, @Res() res: Response): Promise<Partial<User>> {
    // console.log('RESTORE USER HIT!!');
    // console.log(req);
    
    const restoredUser: Partial<User> = req['user'];
    // console.log(restoredUser);
    
    
    // get fresh token for user restoring session
    const jwtToken: string = await this.authService.generateJwt(restoredUser.id, restoredUser.email);

    // Set the JWT as a httpOnly cookie in response
    res.cookie('jwt', jwtToken, {
      httpOnly: true,                                 // Prevent access from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Ensure it's sent over HTTPS (only works in production with HTTPS)
      sameSite: 'strict',                             // Mitigates CSRF (adjust as per your requirements)
      maxAge: 48 * 60 * 60 * 1000,                    // Expiration time (48 hours in milliseconds)
    });
    
    // console.log('RESTORED USER');
    
    // console.log(restoredUser);
    
    // // Return basic user info for ui
    return restoredUser;
  };


  // // Google OAuth Login
  // @Get('google')
  // @UseGuards(GoogleAuthGuard) // Redirects to Google's OAuth page
  // async googleLogin() {
  //   // No implementation needed; Passport will handle the redirect
  // }

  // @Get('google/callback')
  // @UseGuards(GoogleAuthGuard) // Callback after successful Google authentication
  // async googleCallback(@Req() req: Request, @Res() res: Response) {
  //   const user = req.user; // The user object returned by GoogleStrategy
  //   const token = this.authService.generateJwtToken(user); // Generate the JWT
  //   res.cookie('jwt', token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //   });
  //   return res.redirect('/'); // Redirect to the frontend after login
  // }

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
