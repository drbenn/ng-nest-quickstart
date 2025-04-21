import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { UserLoginProvider } from '@common-types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// https://developers.facebook.com/apps
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,           // Your Facebook App ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,   // Your Facebook App Secret
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,     // Your redirect URI
      profileFields: ['id', 'emails', 'name', 'photos'],  // Request necessary fields
      scope: ['email'],                                   // Request email permission
    });
  }

  async validate(
    // accessToken received in response from faccebook oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.
    accessToken: string,
    // refreshToken received in response from faccebook oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.    
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const validatedUserProfile = await this.authService.validateOAuthLogin(profile, UserLoginProvider.facebook);
      done(null, validatedUserProfile);
    } catch (err) {
      this.logger.log('warn', `Error with facebook guard strategy validate: ${err}`);
      done(err, null);
    }
  };
}