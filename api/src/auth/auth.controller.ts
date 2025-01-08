import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Email/Password Login
  @Post('login')
  @UseGuards(LocalAuthGuard) // LocalAuthGuard verifies email/password
  async login(@Req() req: Request, @Res() res: Response) {
    const user = req.user; // The user object returned by LocalStrategy
    const token = this.authService.generateJwtToken(user); // Generate the JWT
    res.cookie('jwt', token, {
      httpOnly: true, // Prevent access to the token from client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    });
    return res.json({ message: 'Login successful', token }); // Optionally return the token
  }

  // Google OAuth Login
  @Get('google')
  @UseGuards(GoogleAuthGuard) // Redirects to Google's OAuth page
  async googleLogin() {
    // No implementation needed; Passport will handle the redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard) // Callback after successful Google authentication
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user; // The user object returned by GoogleStrategy
    const token = this.authService.generateJwtToken(user); // Generate the JWT
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect('/'); // Redirect to the frontend after login
  }

  // Protected Route Example
  @Get('protected')
  @UseGuards(JwtAuthGuard) // Protect this route with the JWT Guard
  async getProtectedData(@Req() req: Request) {
    return {
      message: 'You have access to this protected route!',
      user: req.user,
    };
  }

  // Logout
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt'); // Clear the JWT cookie
    return res.json({ message: 'Logout successful' });
  }
  // constructor(private authService: AuthService) {}

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

  // // login using basic email/password combination
  // @Post('login')
  // async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
  //   const { jwt } = await this.authService.loginWithEmail(body.email, body.password);

  //   // Set JWT as an HttpOnly cookie
  //   res.cookie('jwt', jwt, { httpOnly: true, secure: true });
  //   res.json({ message: 'Login successful' });
  // }
}
