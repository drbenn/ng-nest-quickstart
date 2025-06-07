import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginStandardUserDto, RegisterStandardUserDto, RequestResetStandardPasswordDto, ResetStandardPasswordDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { AuthResponseMessageDto } from './auth.dto';
export interface OAuthUser {
    id: number;
    email: string;
    name: string;
    provider?: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService, logger: Logger);
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    restoreUser(req: Request, res: Response): Promise<Partial<User>>;
    private sendSuccessfulLoginCookies;
    register(registerStandardUserDto: RegisterStandardUserDto, res: Response): Promise<AuthResponseMessageDto>;
    login(loginStandardUserDto: LoginStandardUserDto, res: Response): Promise<AuthResponseMessageDto | any>;
    resetStandardPasswordRequest(requestResetStandardPasswordDto: RequestResetStandardPasswordDto, res: Response): Promise<AuthResponseMessageDto>;
    resetStandardPassword(resetStandardPasswordDto: ResetStandardPasswordDto, res: Response): Promise<AuthResponseMessageDto>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
    githubAuth(req: any): Promise<void>;
    githubAuthRedirect(req: Request, res: Response): Promise<void>;
    facebookAuth(req: any): Promise<void>;
    facebookbAuthRedirect(req: Request, res: Response): Promise<void>;
    private handleOAuthRedirect;
}
