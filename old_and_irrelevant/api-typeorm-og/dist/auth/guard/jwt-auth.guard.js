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
exports.ProtectedController = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../auth.service");
const nest_winston_1 = require("nest-winston");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService, logger) {
        super();
        this.authService = authService;
        this.logger = logger;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log('can activate request: ', request);
        console.log('JWT Guard user: ', request.user);
        console.log('JWT Guard cookies: ', request.cookies);
        try {
            await super.canActivate(context);
            return true;
        }
        catch (error) {
            const refreshToken = request.cookies['refreshToken'];
            let newAccessToken;
            if (error && refreshToken) {
                const user = await this.authService.findOneUserByRefreshToken(refreshToken);
                newAccessToken = await this.authService.generateAccessJwt(user.id.toString());
                request.res.cookie('jwt', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION),
                });
                return true;
            }
            else {
                this.logger.error('warn', `Refresh token is missing, invalid or expired`);
                throw new common_1.UnauthorizedException('Refresh token is missing, invalid or expired');
            }
            ;
        }
        ;
    }
    ;
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        common_1.Logger])
], JwtAuthGuard);
let ProtectedController = class ProtectedController {
    getProtectedData() {
        return { message: 'You are authenticated!' };
    }
    ;
};
exports.ProtectedController = ProtectedController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProtectedController.prototype, "getProtectedData", null);
exports.ProtectedController = ProtectedController = __decorate([
    (0, common_1.UseGuards)(JwtAuthGuard),
    (0, common_1.Controller)('protected')
], ProtectedController);
//# sourceMappingURL=jwt-auth.guard.js.map