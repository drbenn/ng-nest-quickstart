import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';

// https://developers.facebook.com/apps
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID, // Your Facebook App ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // Your Facebook App Secret
      callbackURL: process.env.FACEBOOK_CALLBACK_URL, // Your redirect URI
      profileFields: ['id', 'emails', 'name', 'photos'], // Request necessary fields
      scope: ['email'], // Request email permission
    });
  }

  async validate(
    accessToken: string,
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
  }
}