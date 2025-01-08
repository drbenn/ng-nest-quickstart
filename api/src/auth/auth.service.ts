import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserByEmail(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      // Add proper password hashing for production!
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async generateJwt(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async loginWithEmail(email: string, password: string): Promise<any> {
    const user = await this.validateUserByEmail(email, password);
    const jwt = await this.generateJwt(user);
    return { jwt };
  }

  async loginWithOAuth(profile: any): Promise<any> {
    let user = await this.usersService.findByEmail(profile.email);
    if (!user) {
      // Create user if they don't exist
      user = await this.usersService.create({
        email: profile.email,
        username: profile.username,
      });
    }
    const jwt = await this.generateJwt(user);
    return { jwt };
  }




}
