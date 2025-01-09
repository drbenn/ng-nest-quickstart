import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  // mailgun for email service
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: determineEnvFilePath()
    }),
    // Import TypeOrmModule and load PostgreSQL connection settings from the environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('Database Configuration:');
        // console.log('POSTGRES_HOST:', configService.get<string>('POSTGRES_HOST'));
        // console.log('POSTGRES_PORT:', configService.get<number>('POSTGRES_PORT'));
        // console.log('POSTGRES_USER:', configService.get<string>('POSTGRES_USER'));
        // console.log('POSTGRES_PASSWORD:', configService.get<string>('POSTGRES_PASSWORD'));
        // console.log('POSTGRES_DB:', configService.get<string>('POSTGRES_DB'));
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true, // Automatically load entities for TypeORM
          synchronize: true, // Use this in development only (auto-sync database schema)

        }
      },
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
    UsersModule, AuthModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


function determineEnvFilePath(): string {
  const env = process.env.NODE_ENV || 'development';
  console.log(env);
  
  
  switch (env) {
    case 'development':
      return 'env/.development.local.env';
    case 'docker-production':
      return 'env/.docker.production.env';
    case 'nginx-production':
      return 'env/.nginx.production.env';
    default:
      return 'env/.development.local.env';
  }
}