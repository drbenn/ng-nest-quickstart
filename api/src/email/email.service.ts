import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// nodemailer and nest addon are lower level options if decide to buck aws

@Injectable()
export class EmailService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

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


  async sendConfirmationEmailForStandardLoginEmailSdk(recipientEmail: string, confirmationLink: string): Promise<{ messageId: string }> {    
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
                    <p>You registered an account with email and password login for ${process.env.AWS_SES_TEMPLATE_DOMAIN}. Click the link below to confirm your login creation:</p>
                    <p><a href="${confirmationLink}" target="_blank">Confirm Login: ${confirmationLink}</a></p>
                    <p>If you didn't recently register this login, you can safely ignore this email.</p>
                    <br>
                    <p>Thanks,<br>Your ${process.env.AWS_SES_TEMPLATE_APP_NAME} Team</p>
                  </body>
                </html>
              `,
            },
            Text: {
              Data: `Hello, You registered an account with email and password login for ${process.env.AWS_SES_TEMPLATE_DOMAIN}. 
              Go to ${confirmationLink} to confirm the new login. If you didn't recently register this login, you can 
              safely ignore this email.`
            }
          },
          Subject: {
            Data: `${process.env.AWS_SES_TEMPLATE_APP_NAME} Email Login Confirmation`
          },
        },
      };
    
      const command = new SendEmailCommand(params);
      const response = await ses.send(command);
    
      return { messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending email', error);
      this.logger.log('warn', `Error sending email in email service to standard user confirming login registration: ${error}`);
      throw new Error('Unable to send email');
    };
  };

}
