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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
const auth_service_1 = require("../auth.service");
let FacebookStrategy = class FacebookStrategy extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(authService) {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name', 'photos'],
            scope: ['email'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const validatedUser = await this.authService.validateOAuthLogin(profile, 'facebook');
            done(null, validatedUser);
        }
        catch (err) {
            done(err, null);
        }
    }
    ;
};
exports.FacebookStrategy = FacebookStrategy;
exports.FacebookStrategy = FacebookStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FacebookStrategy);
//# sourceMappingURL=facebook.strategy.js.map