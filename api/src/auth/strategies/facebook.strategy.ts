import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';

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

      console.log('1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111');
      console.log(accessToken);
      console.log('22222222222222!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!22222');
      console.log(refreshToken);
      
      console.log('Facebook Profile:', profile);

      // Extract user information
      // const { id, emails, name, photos } = profile;
      // const user = {
      //   oauth_provider: 'facebook',
      //   facebookId: id,
      //   email: emails?.[0]?.value || null,
      //   full_name: `${name?.givenName || ''} ${name?.familyName || ''}`.trim(),
      //   img_url: photos?.[0]?.value || null,
      // };

      // Validate or create the user
      const validatedUser = await this.authService.validateOAuthLogin(profile, 'facebook');
      done(null, validatedUser);
    } catch (err) {
      done(err, null);
    }
  }
}