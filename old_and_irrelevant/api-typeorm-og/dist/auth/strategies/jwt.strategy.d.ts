import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { User } from 'src/users/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: any): Promise<Partial<User> | null>;
}
export {};
