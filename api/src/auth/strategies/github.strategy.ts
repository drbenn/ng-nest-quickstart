import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

// https://github.com/settings/applications/new
@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: any,
    refreshToken: any,
    profile: any, 
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const validatedUser = await this.authService.validateOAuthLogin(profile, 'github');
    done(null, validatedUser);
  }
}