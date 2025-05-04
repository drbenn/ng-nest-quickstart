import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendTestEmail(to: string) {
    const subject = 'Test Email from NestJS Brevo (@nestjs-modules)';
    const text = 'This is a test email sent via Brevo SMTP using NestJS (@nestjs-modules/mailer).';
    const html = '<b>This is a test email sent via Brevo SMTP using NestJS (@nestjs-modules/mailer).</b>';
    await this.sendEmail(to, subject, text, html);
  }

  async sendEmail(to: string | string[], subject: string, text: string, html?: string, from?: string) {
    try {
      await this.mailerService.sendMail({
        to: to,
        from: from || process.env.BREVO_SENDER_EMAIL,
        subject: subject,
        text: text,
        html: html,
      });
      this.logger.log('warn',`Email successfully sent to ${Array.isArray(to) ? to.join(', ') : to}`);
    } catch (error) {
      this.logger.error('warn',`Failed to send email to ${Array.isArray(to) ? to.join(', ') : to}`, error.stack);
      throw error; // Re-throw or handle appropriately
    }
  }

  async sendResetPasswordLinkEmail(recipientEmail: string, resetLink: string): Promise<{ messageId: string }> {    
    try {
      const info = await this.mailerService.sendMail({
        to: recipientEmail,
        from: process.env.BREVO_SENDER_EMAIL,
        subject: `${process.env.BREVO_TEMPLATE_APP_NAME} Password Reset Request`,
        text: `Hello, You requested a password reset for ${process.env.BREVO_TEMPLATE_APP_NAME}. 
              Go to ${resetLink} to update password. If you didn't request this password change, you can 
              safely ignore this email.`,
        html: `
          <html>
            <body>
              <p>Hello,</p>
              <p>You requested a password reset for ${process.env.BREVO_TEMPLATE_APP_NAME}. Click the link below to reset your password:</p>
              <p><a href="${resetLink}" target="_blank">Reset Password: ${resetLink}</a></p>
              <p>If you didn't request this password change, you can safely ignore this email.</p>
              <br>
              <p>Thanks,<br>Your ${process.env.BREVO_TEMPLATE_APP_NAME} Team</p>
            </body>
          </html>
        `
      });
      return { messageId: info.messageId };
    } catch (error) {
      this.logger.log('warn', `Error sending email in email service to standard user requesting password reset: ${error}`);
      throw new Error('Unable to send email');
    }
  };

  async sendConfirmationEmailForStandardLoginEmail(recipientEmail: string, confirmationLink: string): Promise<{ messageId: string }> {    
    try {
      const info = await this.mailerService.sendMail({
        to: recipientEmail,
        from: process.env.BREVO_SENDER_EMAIL,
        subject: `${process.env.BREVO_TEMPLATE_APP_NAME} Password Reset Request`,
        text: `Hello, You registered an account with email and password login for ${process.env.BREVO_TEMPLATE_APP_NAME}. 
              Go to ${confirmationLink} to confirm the new login. If you didn't recently register this login, you can 
              safely ignore this email.`,
        html: `
          <html>
            <body>
              <p>Hello,</p>
              <p>You registered an account with email and password login for ${process.env.BREVO_TEMPLATE_APP_NAME}. Click the link below to confirm your login creation:</p>
              <p><a href="${confirmationLink}" target="_blank">Confirm Login: ${confirmationLink}</a></p>
              <p>If you didn't recently register this login, you can safely ignore this email.</p>
              <br>
              <p>Thanks,<br>Your ${process.env.BREVO_TEMPLATE_APP_NAME} Team</p>
            </body>
          </html>
        `
      });      
      return { messageId: info.messageId };
    } catch (error) {
      this.logger.log('warn', `Error sending email in email service to standard user confirming login registration: ${error}`);
      throw new Error('Unable to send email');
    }
  };

}
