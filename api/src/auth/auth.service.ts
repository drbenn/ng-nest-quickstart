import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly usersService: UsersService,
    // private readonly jwtService: JwtService,
    // private configService: ConfigService
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = this.userRepository.create({ email, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  // async validateUserByEmail(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOneUserByEmail(email);
  //   if (user && user.password === password) {
  //     // Add proper password hashing for production!
  //     return user;
  //   }
  //   throw new UnauthorizedException('Invalid credentials');
  // }

  // async generateJwt(userEmail: string, userId: string): Promise<string> {
  //   const payload = { email: userEmail, id: userId };
  //   const jwt = this.jwtService.sign(payload, {expiresIn: this.configService.get<string>('JWT_EXPIRATION')});
  //   return jwt;
  // };

  // async loginWithEmail(email: string, password: string): Promise<any> {
  //   const user: User = await this.usersService.findOneUserByEmailAndPassword(email, password);
  //   const jwt = await this.generateJwt(user.email, user.id);
  //   return { jwt };
  // };

  // async loginWithOAuth(profile: any): Promise<any> {
  //   let user = await this.usersService.findOneUserByEmail(profile.email);
  //   if (!user) {
  //     // Create user if they don't exist
  //     user = await this.usersService.createOAuthUser({
  //       email: profile.email,
  //       id: profile.id,
  //     });
  //   };
  //   const jwt = await this.generateJwt(user.email, user.id);
  //   return { jwt };
  // };




}
