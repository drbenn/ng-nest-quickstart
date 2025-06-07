import { JwtService } from '@nestjs/jwt';
import { RegisterStandardUserDto, RequestResetStandardPasswordDto, ResetStandardPasswordDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { Logger, Repository, UpdateResult } from 'typeorm';
import { Profile } from 'passport';
import { AuthResponseMessageDto } from './auth.dto';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly logger;
    private readonly jwtService;
    private readonly emailService;
    constructor(userRepository: Repository<User>, logger: Logger, jwtService: JwtService, emailService: EmailService);
    findOneUserById(id: number): Promise<Partial<User> | null>;
    findOneUserByEmail(email: string): Promise<Partial<User> | null>;
    findOneUserByProvider(oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<User> | null>;
    findOneUserByRefreshToken(refresh_token: string): Promise<Partial<User> | null>;
    generateAccessJwt(userId: string): Promise<string>;
    generateRefreshJwt(): Promise<string>;
    updateUsersRefreshTokenInDatabase(userId: number, refreshToken: string): Promise<UpdateResult>;
    registerStandardUser(registerStandardUserDto: RegisterStandardUserDto): Promise<AuthResponseMessageDto>;
    loginStandardUser(email: string, password: string): Promise<AuthResponseMessageDto>;
    emailStandardUserToResetPassword(requestResetStandardPasswordDto: RequestResetStandardPasswordDto): Promise<AuthResponseMessageDto>;
    resetStandardUserPassword(resetDto: ResetStandardPasswordDto): Promise<AuthResponseMessageDto>;
    private hashPassword;
    private verifyPassword;
    private generateResetId;
    sendRequestPasswordResetEmail(email: string, resetLink: string): Promise<{
        messageId: string;
    }>;
    validateOAuthLogin(profile: Profile, provider: string): Promise<AuthResponseMessageDto>;
}
