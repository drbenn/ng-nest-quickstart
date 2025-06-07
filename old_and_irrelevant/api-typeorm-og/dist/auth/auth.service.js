"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const nest_winston_1 = require("nest-winston");
const class_transformer_1 = require("class-transformer");
const crypto_1 = require("crypto");
const auth_dto_1 = require("./auth.dto");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(userRepository, logger, jwtService, emailService) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async findOneUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            this.logger.log('warn', `Cannot find one user by id. User id not found: ${id}`);
            return null;
        }
        ;
        return (0, class_transformer_1.instanceToPlain)(user);
    }
    ;
    async findOneUserByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            this.logger.log('warn', `Cannot find one user by email. User id not found: ${email}`);
            return null;
        }
        ;
        return (0, class_transformer_1.instanceToPlain)(user);
    }
    ;
    async findOneUserByProvider(oauth_provider, oauth_provider_user_id) {
        const user = await this.userRepository.findOne({ where: { oauth_provider, oauth_provider_user_id } });
        if (!user) {
            this.logger.log('warn', `Cannot find one user by provider. User not found: ${oauth_provider} - ${oauth_provider_user_id}`);
            return null;
        }
        ;
        return (0, class_transformer_1.instanceToPlain)(user);
    }
    ;
    async findOneUserByRefreshToken(refresh_token) {
        const user = await this.userRepository.findOne({ where: { refresh_token } });
        if (!user) {
            this.logger.log('warn', `Cannot find one user by refresh_token. User not found: ${refresh_token}`);
            return null;
        }
        ;
        return (0, class_transformer_1.instanceToPlain)(user);
    }
    ;
    async generateAccessJwt(userId) {
        const payload = { userId };
        const jwtAccessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION });
        return jwtAccessToken;
    }
    ;
    async generateRefreshJwt() {
        const jwtToken = (0, crypto_1.randomBytes)(64).toString('hex');
        const saltRounds = 10;
        const hashedJwtRefreshToken = await bcrypt.hash(jwtToken, saltRounds);
        return hashedJwtRefreshToken;
    }
    ;
    async updateUsersRefreshTokenInDatabase(userId, refreshToken) {
        try {
            return this.userRepository.update({ id: userId }, { refresh_token: refreshToken });
        }
        catch (error) {
            this.logger.log('warn', `Error updating refresh token: ${error}`);
        }
        ;
    }
    ;
    async registerStandardUser(registerStandardUserDto) {
        const { email, password } = registerStandardUserDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser === null) {
            const hashedPassword = await this.hashPassword(password);
            const reset_id = await this.generateResetId();
            const newUser = this.userRepository.create({ email, password: hashedPassword, reset_id });
            await this.userRepository.save(newUser);
            const jwtAccessToken = await this.generateAccessJwt(newUser.id.toString());
            const jwtRefreshToken = await this.generateRefreshJwt();
            this.updateUsersRefreshTokenInDatabase(newUser.id, jwtRefreshToken);
            const successfulRegisterResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_REGISTRATION_SUCCESS,
                user: (0, class_transformer_1.instanceToPlain)(newUser),
                jwtAccessToken: jwtAccessToken,
                jwtRefreshToken: jwtRefreshToken
            };
            return successfulRegisterResponseMessage;
        }
        else if (existingUser) {
            this.logger.log('warn', `Cannot register user. User email/account already exists in db: ${existingUser.email}`);
            const failedRegistrationResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_REGISTRATION_FAILED,
                email: existingUser.email,
                provider: existingUser.oauth_provider
            };
            return failedRegistrationResponseMessage;
        }
        ;
    }
    ;
    async loginStandardUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        const isPasswordMatch = await this.verifyPassword(password, user.password);
        if (user === null) {
            this.logger.log('warn', `Cannot login user. User email/password combination not found: ${email}`);
            const noRegisteredUserResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED,
                email: email
            };
            return noRegisteredUserResponseMessage;
        }
        else if (user && user.oauth_provider !== null) {
            const existingOauthRegistrationResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_EXISTING,
                email: email,
                provider: user.oauth_provider
            };
            return existingOauthRegistrationResponseMessage;
        }
        else if (user && !isPasswordMatch) {
            const failedPasswordResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH,
                email: user.email,
                provider: user.oauth_provider
            };
            return failedPasswordResponseMessage;
        }
        else if (user && isPasswordMatch) {
            const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
            const jwtRefreshToken = await this.generateRefreshJwt();
            this.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
            const standardLoginSuccessResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_LOGIN_SUCCESS,
                user: (0, class_transformer_1.instanceToPlain)(user),
                jwtAccessToken: jwtAccessToken,
                jwtRefreshToken: jwtRefreshToken
            };
            return standardLoginSuccessResponseMessage;
        }
        ;
    }
    ;
    async emailStandardUserToResetPassword(requestResetStandardPasswordDto) {
        try {
            const { email } = requestResetStandardPasswordDto;
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                const failedPasswordResetRequestResponseMessage = {
                    message: auth_dto_1.AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
                };
                return failedPasswordResetRequestResponseMessage;
            }
            else if (user && !user.oauth_provider) {
                const { reset_id } = user;
                const urlForEmail = `${process.env.FRONTEND_URL}/reset-password/?email=${encodeURIComponent(email)}&reset_id=${reset_id}`;
                const smtpEmailResponse = await this.emailService.sendResetPasswordLinkEmailSdk(email, urlForEmail);
                const successPasswordResetRequestResponseMessage = {
                    message: auth_dto_1.AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_SUCCESS,
                    message_two: `messageId: ${smtpEmailResponse.messageId}`
                };
                return successPasswordResetRequestResponseMessage;
            }
            ;
        }
        catch (error) {
            this.logger.log('warn', `Error sending email to standard user requesting password reset: ${error}`);
            const failedPasswordResetRequestResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
            };
            return failedPasswordResetRequestResponseMessage;
        }
        ;
    }
    ;
    async resetStandardUserPassword(resetDto) {
        const { email, newPassword, resetId } = resetDto;
        const user = await this.userRepository.findOne({ where: { email, reset_id: resetId } });
        if (!user) {
            const standardResetLoginFailResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_RESET_FAILED,
            };
            return standardResetLoginFailResponseMessage;
        }
        else {
            const hashedPassword = await this.hashPassword(newPassword);
            const newResetId = await this.generateResetId();
            user.password = hashedPassword;
            user.reset_id = newResetId;
            const updatedUser = await this.userRepository.save(user);
            const jwtAccessToken = await this.generateAccessJwt(user.id.toString());
            const jwtRefreshToken = await this.generateRefreshJwt();
            this.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
            const standardResetLoginSuccessResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_RESET_SUCCESS,
                user: (0, class_transformer_1.instanceToPlain)(updatedUser),
                jwtAccessToken: jwtAccessToken,
                jwtRefreshToken: jwtRefreshToken
            };
            return standardResetLoginSuccessResponseMessage;
        }
        ;
    }
    ;
    async hashPassword(rawPassword) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        return hashedPassword;
    }
    ;
    async verifyPassword(plainPassword, storedHashedPassword) {
        return await bcrypt.compare(plainPassword, storedHashedPassword);
    }
    ;
    async generateResetId() {
        return await (0, crypto_1.randomBytes)(64).toString('hex');
    }
    ;
    async sendRequestPasswordResetEmail(email, resetLink) {
        const emailResponse = await this.emailService.sendResetPasswordLinkEmailSdk(email, resetLink);
        return emailResponse;
    }
    ;
    async validateOAuthLogin(profile, provider) {
        let email = profile.emails[0].value || '';
        let full_name = '';
        let img_url = '';
        let oauth_provider = '';
        let oauth_provider_user_id = '';
        let existingUser = await this.userRepository.find({ where: { email } });
        if (existingUser.length && existingUser[0].oauth_provider !== provider) {
            return {
                message: 'email already registered',
                email: existingUser[0].email,
                provider: existingUser[0].oauth_provider
            };
        }
        else {
            let user = existingUser[0];
            switch (provider) {
                case 'google':
                    email = profile.emails[0].value || null;
                    full_name = profile.displayName || null;
                    img_url = profile.photos[0].value || null;
                    oauth_provider = profile.provider;
                    oauth_provider_user_id = profile.id;
                    break;
                case 'facebook':
                    email = profile.emails[0].value || null;
                    full_name = `${profile.name.givenName} ${profile.name.familyName}` || null;
                    img_url = profile.photos[0].value || null;
                    oauth_provider = profile.provider;
                    oauth_provider_user_id = profile.id;
                    break;
                case 'github':
                    email = profile.emails[0].value || null;
                    full_name = profile.displayName || null;
                    img_url = profile.photos[0].value || null;
                    oauth_provider = profile.provider;
                    oauth_provider_user_id = profile.id;
                    break;
                default:
                    throw new Error('Unsupported provider');
            }
            ;
            if (!user) {
                user = this.userRepository.create({ email, full_name, img_url, oauth_provider, oauth_provider_user_id });
                await this.userRepository.save(user);
            }
            ;
            return (0, class_transformer_1.instanceToPlain)(user);
        }
        ;
    }
    ;
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object, jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map