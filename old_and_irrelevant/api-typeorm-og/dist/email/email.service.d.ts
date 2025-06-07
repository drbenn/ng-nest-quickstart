import { Logger } from '@nestjs/common';
export declare class EmailService {
    private readonly logger;
    constructor(logger: Logger);
    sendResetPasswordLinkEmailSdk(recipientEmail: string, resetLink: string): Promise<{
        messageId: string;
    }>;
}
