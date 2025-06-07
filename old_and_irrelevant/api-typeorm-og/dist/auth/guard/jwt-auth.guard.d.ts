import { ExecutionContext, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService, logger: Logger);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class ProtectedController {
    getProtectedData(): {
        message: string;
    };
}
export {};
