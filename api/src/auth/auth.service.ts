import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // async validateUserByEmail(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOneUserByEmail(email);
  //   if (user && user.password === password) {
  //     // Add proper password hashing for production!
  //     return user;
  //   }
  //   throw new UnauthorizedException('Invalid credentials');
  // }

  async generateJwt(userEmail: string, userId: string): Promise<string> {
    const payload = { email: userEmail, id: userId };
    const jwt = this.jwtService.sign(payload, {expiresIn: this.configService.get<string>('JWT_EXPIRATION')});
    return jwt;
  };

  async loginWithEmail(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findOneUserByEmailAndPassword(email, password);
    const jwt = await this.generateJwt(user.email, user.id);
    return { jwt };
  };

  async loginWithOAuth(profile: any): Promise<any> {
    let user = await this.usersService.findOneUserByEmail(profile.email);
    if (!user) {
      // Create user if they don't exist
      user = await this.usersService.createOAuthUser({
        email: profile.email,
        id: profile.id,
      });
    };
    const jwt = await this.generateJwt(user.email, user.id);
    return { jwt };
  };




}
