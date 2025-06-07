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
exports.ResetStandardPasswordDto = exports.RequestResetStandardPasswordDto = exports.UserLoginJwtDto = exports.LoginStandardUserDto = exports.RegisterStandardUserDto = exports.CreateUserDto = exports.UserDto = void 0;
class UserDto {
}
exports.UserDto = UserDto;
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
const class_validator_1 = require("class-validator");
class RegisterStandardUserDto {
}
exports.RegisterStandardUserDto = RegisterStandardUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterStandardUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterStandardUserDto.prototype, "password", void 0);
class LoginStandardUserDto {
}
exports.LoginStandardUserDto = LoginStandardUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginStandardUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginStandardUserDto.prototype, "password", void 0);
class UserLoginJwtDto {
}
exports.UserLoginJwtDto = UserLoginJwtDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserLoginJwtDto.prototype, "accessToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UserLoginJwtDto.prototype, "expiresIn", void 0);
class RequestResetStandardPasswordDto {
}
exports.RequestResetStandardPasswordDto = RequestResetStandardPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestResetStandardPasswordDto.prototype, "email", void 0);
class ResetStandardPasswordDto {
}
exports.ResetStandardPasswordDto = ResetStandardPasswordDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetStandardPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetStandardPasswordDto.prototype, "resetId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetStandardPasswordDto.prototype, "newPassword", void 0);
//# sourceMappingURL=user.dto.js.map