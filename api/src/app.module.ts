import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: determineEnvFilePath()
    }),
    // Import TypeOrmModule and load PostgreSQL connection settings from the environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true, // Automatically load entities for TypeORM
        synchronize: true, // Use this in development only (auto-sync database schema)
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'nestjs_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables; disable in production!
    }),
    UsersModule,
    UsersModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}


function determineEnvFilePath(): string {
  const env = process.env.NODE_ENV || 'development';
  switch (env) {
    case 'development':
      return '/api-todo-nest/env/.development.local.env';
    case 'docker-production':
      return '/api-todo-nest/env/.docker.production.env';
    case 'nginx-production':
      return '/api-todo-nest/env/.nginx.production.env';
    default:
      return '/api-todo-nest/env/.development.local.env';
  }
}