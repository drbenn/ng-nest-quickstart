import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterStandardUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Logger, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async registerStandardUser(registerStandardUserDto: RegisterStandardUserDto): Promise<{user: Partial<User>, jwtToken: string}> {
    const { email, password } = registerStandardUserDto;

    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.log('warn', `Cannot register user. User email already exists: ${existingUser.email}`);
      throw new ConflictException('User with this email already exists.');
    };

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(newUser);

    // create jwt for users first login
    const jwtToken = await this.generateJwt(newUser.id, newUser.email);
    return { user: instanceToPlain(newUser), jwtToken: jwtToken };
  };

  async loginStandardUser(email: string, password: string): Promise<{user: Partial<User>, jwtToken: string}> {
    const user = await this.validateStandardUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    };

    const jwtToken = await this.generateJwt(user.id, user.email);
    return { user: instanceToPlain(user), jwtToken: jwtToken };
  };


  async generateJwt(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email }; // Customize your payload
    const jwtToken = this.jwtService.sign(payload);
    return jwtToken;
  };

  async validateStandardUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.log('warn', `Cannot login user. User email not found: ${email}`);
      return null; // User not found
    };

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null; // Invalid password
    }
    return user; // Authentication successful
  };

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
