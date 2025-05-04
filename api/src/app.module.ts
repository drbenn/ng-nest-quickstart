import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { SqlTodoService } from './todo/sql-todo/sql-todo.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: determineEnvFilePath()
    }),
    ThrottlerModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true
        })
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TIME_TO_LIVE'),
          limit: config.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
      })
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('BREVO_MAIL_HOST'),
          port: configService.get<number>('BREVO_MAIL_PORT'),
          secure: configService.get<number>('BREVO_MAIL_PORT') === 465, // true for 465, false for other ports (like 587)
          auth: {
            user: configService.get<string>('BREVO_MAIL_USER'),
            pass: configService.get<string>('BREVO_MAIL_PASSWORD'),
          },
          // If using port 587 (TLS), often requireExplicitTLS might be needed
          // depending on your environment/provider specifics. Brevo usually works without it.
          // requireTLS: true, // uncomment if needed
        },
        defaults: {
          from: configService.get<string>('BREVO_MAIL_FROM'),
        },
        // --- Optional: If using Templates (e.g., Handlebars) ---
        // template: {
        //   dir: join(__dirname, '..', 'templates'), // Path to your email templates directory
        //   adapter: new HandlebarsAdapter(), // Use Handlebars adapter
        //   options: {
        //     strict: true, // Disallow accessing undefined properties in templates
        //   },
        // },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),

    // additional module imports
    UsersModule, AuthModule, TodoModule, EmailModule],
  controllers: [AppController],
  providers: [AppService, SqlTodoService],
})
export class AppModule {}


function determineEnvFilePath(): string[] {
  // return array with common envs + whatever environment is being ran
  const envPaths: string[] = ['env/.common.env'];
  const env = process.env.NODE_ENV || 'development';
  switch (env) {
    case 'development':
      envPaths.push('env/.development.local.env');
      break;
    case 'namecheap_production':
      envPaths.push('env/.namecheap.production.env');
      break;
    case 'docker-production':
      envPaths.push('env/.docker.production.env');
      break;
    case 'nginx-production':
      envPaths.push('env/.nginx.production.env');
      break;
    default:
      envPaths.push('env/.development.local.env');
  }
  return envPaths;
}