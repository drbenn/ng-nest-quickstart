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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const client_ses_1 = require("@aws-sdk/client-ses");
let EmailService = class EmailService {
    constructor(logger) {
        this.logger = logger;
    }
    async sendResetPasswordLinkEmailSdk(recipientEmail, resetLink) {
        try {
            const ses = new client_ses_1.SESClient({
                region: process.env.AWS_SES_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_IAM_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
                },
            });
            const params = {
                Source: process.env.AWS_SES_SENDER,
                Destination: {
                    ToAddresses: [recipientEmail],
                },
                ReplyToAddresses: [],
                Message: {
                    Body: {
                        Html: {
                            Data: `
                <html>
                  <body>
                    <p>Hello,</p>
                    <p>You requested a password reset for ${process.env.AWS_SES_TEMPLATE_DOMAIN}. Click the link below to reset your password:</p>
                    <p><a href="${resetLink}" target="_blank">Reset Password: ${resetLink}</a></p>
                    <p>If you didn't request this password change, you can safely ignore this email.</p>
                    <br>
                    <p>Thanks,<br>Your ${process.env.AWS_SES_TEMPLATE_APP_NAME} Team</p>
                  </body>
                </html>
              `,
                        },
                        Text: {
                            Data: `Hello, You requested a password reset for ${process.env.AWS_SES_TEMPLATE_DOMAIN}. 
              Go to ${resetLink} to update password. If you didn't request this password change, you can 
              safely ignore this email.`
                        }
                    },
                    Subject: {
                        Data: `${process.env.AWS_SES_TEMPLATE_APP_NAME} Password Reset Request`
                    },
                },
            };
            const command = new client_ses_1.SendEmailCommand(params);
            const response = await ses.send(command);
            return { messageId: response.MessageId };
        }
        catch (error) {
            console.error('Error sending email', error);
            this.logger.log('warn', `Error sending email in email service to standard user requesting password reset: ${error}`);
            throw new Error('Unable to send email');
        }
        ;
    }
    ;
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [common_1.Logger])
], EmailService);
//# sourceMappingURL=email.service.js.map