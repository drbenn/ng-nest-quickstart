import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: () => ({
    //     transport: nodemailer.createTransport({
    //       host: process.env.AWS_SES_REGION,
    //       port: process.env.AWS_SES_PORT,
    //       auth: {
    //         user: process.env.AWS_SES_SMTP_USER, // From SES SMTP credentials
    //         pass: process.env.AWS_SES_SMTP_PASSWORD,
    //       },
    //     }),
    //     defaults: {
    //       from: '"Your App Name" <noreply@yourdomain.com>',
    //     },
    //   }),
    // }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
