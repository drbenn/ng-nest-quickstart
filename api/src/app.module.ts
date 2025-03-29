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