import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
declare const FacebookStrategy_base: new (...args: any[]) => Strategy;
export declare class FacebookStrategy extends FacebookStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any, info?: any) => void): Promise<any>;
}
export {};
