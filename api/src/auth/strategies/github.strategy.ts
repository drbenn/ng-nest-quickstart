import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
import { AuthResponseMessageDto, UserLoginProvider, UserProfile } from '@common-types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// https://github.com/settings/applications/new
@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      // profileFields: ['id', 'emails', 'name', 'photos'],  // Request necessary fields
      scope: ['user:email'],
    });
  }

  async validate(
    // accessToken received in response from github oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.
    accessToken: any,
    // refreshToken received in response from github oauth console, do not remove or else argument 
    // count will be incorrect and you will not receive the necessary profile value.    
    refreshToken: any,
    profile: any, 
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    try {
      const validatedUserProfile: Partial<UserProfile> | AuthResponseMessageDto  = await this.authService.validateOAuthLogin(profile, UserLoginProvider.github);
      done(null, validatedUserProfile);
    } catch (err) {
      this.logger.log('warn', `Error with github guard strategy validate: ${err}`);
      done(err, null);
    }
  }
}