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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const user_dto_1 = require("../users/dto/user.dto");
const jwt_auth_guard_1 = require("./guard/jwt-auth.guard");
const nest_winston_1 = require("nest-winston");
const auth_dto_1 = require("./auth.dto");
let AuthController = class AuthController {
    constructor(authService, logger) {
        this.authService = authService;
        this.logger = logger;
    }
    async logout(res) {
        try {
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            this.logger.error(`Error during user logout: ${error}`);
            res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
        }
        ;
    }
    ;
    async restoreUser(req, res) {
        try {
            const restoredUser = req['user'];
            const jwtToken = await this.authService.generateAccessJwt(restoredUser.id.toString());
            res.cookie('jwt', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),
            });
            return restoredUser;
        }
        catch (error) {
            console.log(req['user']);
            this.logger.error(`Error during OAuth redirect, new access token potentially generated for existing user: ${error}`);
            res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
        }
        ;
    }
    ;
    sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken) {
        res.cookie('jwt', jwtAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),
        });
        res.cookie('refreshToken', jwtRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION),
        });
    }
    ;
    async register(registerStandardUserDto, res) {
        try {
            const newUserResponse = await this.authService.registerStandardUser(registerStandardUserDto);
            if (newUserResponse.message === auth_dto_1.AuthMessages.STANDARD_REGISTRATION_FAILED) {
                const failedRegistrationResponseMessage = newUserResponse;
                return failedRegistrationResponseMessage;
            }
            else if (newUserResponse.message === auth_dto_1.AuthMessages.STANDARD_REGISTRATION_SUCCESS) {
                const { user, jwtAccessToken, jwtRefreshToken, message } = newUserResponse;
                this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
                const successfulRegisterResponseMessage = {
                    message: message,
                    user: user
                };
                return successfulRegisterResponseMessage;
            }
            ;
        }
        catch (error) {
            this.logger.error(`Error during standard registration: ${error}`);
            const errorRegisterResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_REGISTRATION_ERROR
            };
            return errorRegisterResponseMessage;
        }
        ;
    }
    ;
    async login(loginStandardUserDto, res) {
        const loginResponse = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);
        try {
            const loginResponse = await this.authService.loginStandardUser(loginStandardUserDto.email, loginStandardUserDto.password);
            if (loginResponse.message === auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_NOT_REGISTERED) {
                const failedEmailNotRegisteredResponseMessage = loginResponse;
                return failedEmailNotRegisteredResponseMessage;
            }
            else if (loginResponse.message === auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_EXISTING) {
                const existingOauthRegistrationResponseMessage = loginResponse;
                return existingOauthRegistrationResponseMessage;
            }
            else if (loginResponse.message === auth_dto_1.AuthMessages.STANDARD_LOGIN_FAILED_MISMATCH) {
                const failedPasswordResponseMessage = loginResponse;
                return failedPasswordResponseMessage;
            }
            else if (loginResponse.message === auth_dto_1.AuthMessages.STANDARD_LOGIN_SUCCESS) {
                const { message, user, jwtAccessToken, jwtRefreshToken } = loginResponse;
                this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
                const standardLoginSuccessResponseMessage = {
                    message: message,
                    user: user
                };
                return standardLoginSuccessResponseMessage;
            }
            ;
        }
        catch (error) {
            this.logger.error(`Error during OAuth redirect from login-standard: ${error}`);
            const errorLoginResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_LOGIN_ERROR
            };
            return errorLoginResponseMessage;
        }
        ;
    }
    ;
    async resetStandardPasswordRequest(requestResetStandardPasswordDto, res) {
        try {
            const requestResetPasswordResponse = await this.authService.emailStandardUserToResetPassword(requestResetStandardPasswordDto);
            return requestResetPasswordResponse;
        }
        catch (error) {
            this.logger.error(`Error requesting reset of standard registered user password: ${error}`);
            const errorResetPasswordRequestResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_PASSWORD_RESET_REQUEST_FAILED
            };
            return errorResetPasswordRequestResponseMessage;
        }
        ;
    }
    ;
    async resetStandardPassword(resetStandardPasswordDto, res) {
        try {
            const resetPasswordResponse = await this.authService.resetStandardUserPassword(resetStandardPasswordDto);
            return resetPasswordResponse;
        }
        catch (error) {
            this.logger.error(`Error resetting standard registered user password: ${error}`);
            const errorResetPasswordResponseMessage = {
                message: auth_dto_1.AuthMessages.STANDARD_REGISTRATION_ERROR
            };
            return errorResetPasswordResponseMessage;
        }
        ;
    }
    ;
    async googleAuth(req) {
    }
    async googleAuthRedirect(req, res) {
        return this.handleOAuthRedirect(req, res);
    }
    async githubAuth(req) {
    }
    async githubAuthRedirect(req, res) {
        return this.handleOAuthRedirect(req, res);
    }
    async facebookAuth(req) {
    }
    async facebookbAuthRedirect(req, res) {
        return this.handleOAuthRedirect(req, res);
    }
    async handleOAuthRedirect(req, res) {
        const response = req['user'];
        let user = response['message'] ? null : response;
        if (!user) {
            const redirectUrl = `${process.env.FRONTEND_URL}/auth/existing-user/?email=${encodeURIComponent(response['email'])}&provider=${encodeURIComponent(response['provider'])}`;
            res.redirect(redirectUrl);
        }
        else {
            try {
                const jwtAccessToken = await this.authService.generateAccessJwt(user.id.toString());
                const jwtRefreshToken = await this.authService.generateRefreshJwt();
                await this.authService.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);
                if (!process.env.FRONTEND_URL) {
                    this.logger.log('warn', `FRONTEND_URL is not set in environment variables`);
                    throw new Error('FRONTEND_URL is not set in environment variables');
                }
                ;
                this.sendSuccessfulLoginCookies(res, jwtAccessToken, jwtRefreshToken);
                res.redirect(`${process.env.FRONTEND_URL}/oauth/callback`);
            }
            catch (error) {
                this.logger.error(`Error during OAuth redirect from handleOAuthRedirect: ${error}`);
                res.redirect(`${process.env.FRONTEND_URL || '/error'}`);
            }
            ;
        }
        ;
    }
    ;
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('restore-user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "restoreUser", null);
__decorate([
    (0, common_1.Post)('register-standard'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterStandardUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login-standard'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginStandardUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('reset-standard-password-request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RequestResetStandardPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetStandardPasswordRequest", null);
__decorate([
    (0, common_1.Post)('reset-standard-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.ResetStandardPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetStandardPassword", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('github'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuth", null);
__decorate([
    (0, common_1.Get)('github/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('github')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "githubAuthRedirect", null);
__decorate([
    (0, common_1.Get)('facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('facebook/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookbAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        common_1.Logger])
], AuthController);
//# sourceMappingURL=auth.controller.js.map