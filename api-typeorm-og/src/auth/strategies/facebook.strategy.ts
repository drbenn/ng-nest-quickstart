import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';

// https://developers.facebook.com/apps
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
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
      const validatedUser = await this.authService.validateOAuthLogin(profile, 'facebook');
      done(null, validatedUser);
    } catch (err) {
      done(err, null);
    }
  };
}