import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';


// https://console.cloud.google.com to setup google Oauth for flobro
// in the data access page, dont forget to add scopes for userinfo.email, userinfo.profile, and openid
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService
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
    console.log('google strategy profile');
    
    console.log(profile);
    const user = await this.authService.validateOAuthLogin(profile, 'google');
    done(null, user);
  }
}