import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';
declare const GitHubStrategy_base: new (...args: any[]) => Strategy;
export declare class GitHubStrategy extends GitHubStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: any, refreshToken: any, profile: any, done: (err: any, user?: any, info?: any) => void): Promise<any>;
}
export {};
