import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { AuthResponseMessageDto, UserLoginProvider, UserProfile } from '@common-types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';


// https://console.cloud.google.com to setup google Oauth for flobro
// in the data access page, dont forget to add scopes for userinfo.email, userinfo.profile, and openid
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    // accessToken received in response from google oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.
    accessToken: string,
    // refreshToken received in response from google oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.       
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {    
    try {
      const validatedUserProfile: Partial<UserProfile> | AuthResponseMessageDto  = await this.authService.validateOAuthLogin(profile, UserLoginProvider.google);      
      done(null, validatedUserProfile);
    } catch (err) {
      this.logger.log('warn', `Error with google guard strategy validate: ${err}`);
      done(err, null);
    }
  }
}