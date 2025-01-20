import { Injectable, ExecutionContext, UnauthorizedException, UseGuards, Controller, Get, Inject, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   // Optionally override the canActivate method if custom behavior is needed
//   canActivate(context: ExecutionContext) {
//     // Add your custom logic here, e.g., logging or other validation
//     return super.canActivate(context);
//   }

//   handleRequest(err, user, info, context: ExecutionContext) {
//     if (err || !user) {
//       // If there's an error or no user, throw an unauthorized exception
//       throw err || new UnauthorizedException('Unauthorized');
//     }
//     return user;
//   }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    console.log(request.user);
    

    console.log('REQUEST COOKIES IN JWT AUTH GUARD');
    
    console.log(request.cookies);
    

    // First, call the default JWT AuthGuard functionality to validate the access token
    try {
      await super.canActivate(context);
      return true;  // Access token is valid
    } catch (error) {
      console.log(error);
      const refreshToken = request.cookies['refreshToken'];
      let newAccessToken: string;
      if (error && refreshToken) {
        console.log('BOOOYAH');
        console.log(refreshToken);
        const user = await this.authService.findOneUserByRefreshToken(refreshToken);
        console.log(user);
        
        newAccessToken = await this.authService.generateAccessJwt(user.id);
        console.log('i got a new access token: ', newAccessToken);
        
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
  }
}

@UseGuards(JwtAuthGuard)
@Controller('protected')
export class ProtectedController {
  @Get()
  getProtectedData() {
    return { message: 'You are authenticated!' };
  }
}