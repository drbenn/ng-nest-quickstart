// import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  constructor(
    // private readonly mailerService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // async sendResetPasswordLinkEmail(email: string, resetLink: string): Promise<{ messageId: string }> {
  //   const subject = 'Password Reset Request';

  //   const message = `
  //     <html>
  //       <body>
  //         <p>Hi,</p>
  //         <p>You requested a password reset. Click the link below to reset your password:</p>
  //         <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
  //         <p>If you didn't request this, you can safely ignore this email.</p>
  //         <br>
  //         <p>Thanks,<br>Your App Team</p>
  //       </body>
  //     </html>
  //   `;
  
  //   try {
  //     const response = await this.mailerService.sendMail({
  //       to: email,
  //       subject,
  //       html: message,
  //     });
  
  //     // Extract the `MessageId` from the response
  //     return { messageId: response.messageId };
  //   } catch (error) {
  //     console.error('Error sending email', error);
  //     this.logger.log('warn', `Error sending email in email service to standard user requesting password reset: ${error}`);
  //     throw new Error('Unable to send email');
  //   }
  // }

  async sendResetPasswordLinkEmailSdk(recipientEmail: string, resetLink: string): Promise<{ messageId: string }> {    
    try {
      const ses = new SESClient({ 
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
    
      const command = new SendEmailCommand(params);
      const response = await ses.send(command);
    
      return { messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending email', error);
      this.logger.log('warn', `Error sending email in email service to standard user requesting password reset: ${error}`);
      throw new Error('Unable to send email');
    };
  };

}
