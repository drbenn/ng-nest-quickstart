import { Injectable, ExecutionContext, UnauthorizedException, UseGuards, Controller, Get, Inject, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';   // KEEP EVENTHOUGH UNUSED
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // First, call the default JWT AuthGuard functionality to validate the access token
    try {      
      await super.canActivate(context);
      return true;  // Access token is valid
    } catch (error) {
      const refreshToken = request.cookies['refresh_token'];
      let newAccessToken: string;
      if (error && refreshToken) {
        const user = await this.authService.findOneUserProfileByRefreshToken(refreshToken);
        newAccessToken = await this.authService.generateAccessJwt(user.id.toString());

        // Set the new access token in the response cookies (httpOnly)
        request.res.cookie('jwt', newAccessToken, {
          httpOnly: true,                                           // Prevent access from JavaScript
          secure: process.env.NODE_ENV === 'production',            // Ensure it's sent over HTTPS (only works in production with HTTPS)
          sameSite: 'strict',                                       // Mitigates CSRF (adjust as per your requirements)
          maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),  // Expiration time, time stored in browser, not validity
        });

        return true;  // Successfully refreshed the token, so proceed
      } else {
        this.logger.error('warn', `Refresh token is missing, invalid or expired`);
        throw new UnauthorizedException('Refresh token is missing, invalid or expired');
      };
    };
  };
}

@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'You are authenticated!' };
  };
}