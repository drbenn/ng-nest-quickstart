import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any>;
}
export {};
