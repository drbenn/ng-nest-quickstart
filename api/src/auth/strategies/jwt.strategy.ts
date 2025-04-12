import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserProfile } from 'src/users/user.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract JWT from cookies
          const token = request?.cookies?.jwt; // 'jwt' is the cookie name used in your API
          if (!token) {
            throw new UnauthorizedException('JWT not found in cookies');
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  };

  async validate(payload: any): Promise<Partial<UserProfile> | null> {
    console.log('JWT STRAT Payload: ', payload);
    if ('userId' in payload) {
      const user = await this.authService.findOneUserProfileById(payload.userId as number);
      return user;
    }
  }
}