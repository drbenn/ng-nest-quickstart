import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { AuthService } from '../auth.service';

// https://github.com/settings/applications/new

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,          // Your GitHub Client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Your GitHub Client Secret
      callbackURL: process.env.GITHUB_CALLBACK_URL,   // Your GitHub callback URL
      scope: ['user:email'],                          // Scope to access user email and profile
      // passReqToCallback: true, // Pass the request object to the callback
    });
  }

  async validate(
    accessToken: any,
    refreshToken: any,
    profile: any, // Profile provided by GitHub
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    console.log('1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11111');
    console.log(accessToken);
    console.log('22222222222222!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!22222');
    console.log(refreshToken);
    
    
    
    
    console.log('GitHub Profile:', profile);

    // Extract user details from the GitHub profile
    // const { id, displayName, username, emails, photos } = profile;

    // Map the profile to your user entity
    // const user: Profile = {
    //   provider: 'github',
    //   id: id,
    //   displayName: displayName || username,
    //   emails: emails?.[0]?.value || null,
    //   img_url: photos?.[0]?.value || null,
    // };

    // Save or validate the user in your AuthService
    const validatedUser = await this.authService.validateOAuthLogin(profile, 'github');
    done(null, validatedUser);
  }
}