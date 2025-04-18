import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { EmailModule } from 'src/email/email.module';
import { SqlAuthModule } from './sql-auth/sql-auth.module';
import { TodoModule } from 'src/todo/todo.module';
import { SimpleStringHasherService } from './services/simple-string-hasher/simple-string-hasher.service';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Load the secret from .env
        secret: configService.get<string>('JWT_SECRET')
      }),
    }),
    EmailModule, SqlAuthModule, TodoModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SimpleStringHasherService,
    JwtStrategy,
    GoogleStrategy, GitHubStrategy, FacebookStrategy,
    TodoModule
  ],
  exports: [AuthService]
})
export class AuthModule {}
