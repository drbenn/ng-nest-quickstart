"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMessages = exports.AuthResponseMessageDto = void 0;
class AuthResponseMessageDto {
}
exports.AuthResponseMessageDto = AuthResponseMessageDto;
var AuthMessages;
(function (AuthMessages) {
    AuthMessages["STANDARD_REGISTRATION_SUCCESS"] = "standard registration success: email not previously registered and new user saved to db";
    AuthMessages["STANDARD_REGISTRATION_FAILED"] = "standard registration failed: email already registered in site db";
    AuthMessages["STANDARD_REGISTRATION_ERROR"] = "standard registration error: api error, no user created or existing email found";
    AuthMessages["STANDARD_LOGIN_FAILED_NOT_REGISTERED"] = "standard login failed: cannot login user. user email not registered";
    AuthMessages["STANDARD_LOGIN_FAILED_EXISTING"] = "standard login failed: cannot login user. user email already registered through oauth provider";
    AuthMessages["STANDARD_LOGIN_FAILED_MISMATCH"] = "standard login failed: cannot login user. user email/password combination failed";
    AuthMessages["STANDARD_LOGIN_SUCCESS"] = "standard login success: user email/password combination successful";
    AuthMessages["STANDARD_LOGIN_ERROR"] = "standard login error: api error, login workflow error";
    AuthMessages["STANDARD_RESET_FAILED"] = "standard password reset failed";
    AuthMessages["STANDARD_RESET_SUCCESS"] = "standard password reset success";
    AuthMessages["STANDARD_PASSWORD_RESET_REQUEST_SUCCESS"] = "standard password reset request success: email sent to user for password reset";
    AuthMessages["STANDARD_PASSWORD_RESET_REQUEST_FAILED"] = "standard password reset request failed: email not sent to user for password reset";
})(AuthMessages || (exports.AuthMessages = AuthMessages = {}));
//# sourceMappingURL=auth.dto.js.map