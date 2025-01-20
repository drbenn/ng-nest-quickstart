import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterStandardUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.entity';
import { Logger, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { instanceToPlain } from 'class-transformer';
import { Profile } from 'passport';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService
  ) {}

  async registerStandardUser(registerStandardUserDto: RegisterStandardUserDto): Promise<{user: Partial<User>, jwtAccessToken: string, jwtRefreshToken: string}> {
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

    // create access and refresh jwts for users first login
    const jwtAccessToken = await this.generateAccessJwt(newUser.id);
    const jwtRefreshToken = await this.generateRefreshJwt();

    // update refresh jwt in database for future access
    this.updateUsersRefreshTokenInDatabase(newUser.id, jwtRefreshToken);

    return { user: instanceToPlain(newUser), jwtAccessToken: jwtAccessToken, jwtRefreshToken: jwtRefreshToken };
  };

  async loginStandardUser(email: string, password: string): Promise<{user: Partial<User>, jwtAccessToken: string, jwtRefreshToken: string}> {
    const user = await this.validateStandardUser(email, password);

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const jwtAccessToken = await this.generateAccessJwt(user.id);
    const jwtRefreshToken = await this.generateRefreshJwt();

    // update refresh jwt in database for future access
    this.updateUsersRefreshTokenInDatabase(user.id, jwtRefreshToken);

    return { user: instanceToPlain(user), jwtAccessToken: jwtAccessToken, jwtRefreshToken: jwtRefreshToken };
  };


  async generateAccessJwt(userId: string): Promise<string> {
    const payload = { userId };
    const jwtAccessToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION });
    return jwtAccessToken;
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

  async findOneUserById(id: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.log('warn', `Cannot find one user by id. User id not found: ${id}`);
      return null; // User not found
    };

    return instanceToPlain(user); // Authentication successful
  };

  async findOneUserByEmail(email: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.log('warn', `Cannot find one user by email. User id not found: ${email}`);
      return null; // User not found
    };

    return instanceToPlain(user); // Authentication successful
  };

  async findOneUserByProvider(oauth_provider: string, oauth_provider_user_id: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { oauth_provider, oauth_provider_user_id } });

    if (!user) {
      this.logger.log('warn', `Cannot find one user by provider. User not found: ${oauth_provider} - ${oauth_provider_user_id}`);
      return null; // User not found
    };

    return instanceToPlain(user); // Authentication successful
  };

  async findOneUserByRefreshToken(refresh_token: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { refresh_token } });

    if (!user) {
      this.logger.log('warn', `Cannot find one user by refresh_token. User not found: ${refresh_token}`);
      return null; // User not found
    };

    return instanceToPlain(user); // Authentication successful
  };

  // used by every OAuth Auth Guard Strategy to validate user
  async validateOAuthLogin(profile: Profile, provider: string): Promise<any> {    
    // Extract user information based on provider
    let email: string;
    let full_name: string;
    let img_url: string = '';
    let oauth_provider: string = '';
    let oauth_provider_user_id: string = '';

    switch (provider) {
      case 'google':
        email = profile.emails[0].value || null;
        full_name = profile.displayName || null;
        img_url = profile.photos[0].value || null;
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id;
        break;
      case 'facebook':
        email = profile.emails[0].value || null;
        full_name = `${profile.name.givenName} ${profile.name.familyName}` || null;
        img_url = profile.photos[0].value || null;
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id;
        break;
      case 'github':
        email = profile.emails[0].value || null; // by defult does not include email. User may include for notifications, but not required, thus not depended on.
        full_name = profile.displayName || null;
        img_url = profile.photos[0].value || null;
        oauth_provider = profile.provider;
        oauth_provider_user_id = profile.id
        break;
      // case 'apple':
      // apple oauth login requires a developer account which is $99/year. So just no.
      default:
        throw new Error('Unsupported provider');
    };

    // Check if user exists
    let user: Partial<User> = await this.findOneUserByProvider(oauth_provider, oauth_provider_user_id);

    if (!user) {
      // Create and save the new user
      user = this.userRepository.create({ email, full_name, img_url, oauth_provider, oauth_provider_user_id });
      await this.userRepository.save(user);
    };

    return user;
  };

  async generateRefreshJwt(): Promise<string> {
    const jwtToken = randomBytes(64).toString('hex'); // Generate a random token
    const saltRounds = 10;
    const hashedJwtRefreshToken = await bcrypt.hash(jwtToken, saltRounds);
    return hashedJwtRefreshToken;
  };

  async updateUsersRefreshTokenInDatabase(userId: string, refreshToken: string): Promise<UpdateResult> {
    try {
      return this.userRepository.update({ id: userId }, { refresh_token: refreshToken });
    } catch (error: unknown) {
      this.logger.log('warn', `Error updating refresh token: ${error}`);
    };
  };

}
