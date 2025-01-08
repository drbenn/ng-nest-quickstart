import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  findOneUserById(id: string): Promise<User> {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (error: unknown) {
      this.logger.log('error', `Error finding one user by id: ${error}`);
    }
  };

  findOneUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOneBy({ email });
    } catch (error: unknown) {
      this.logger.log('error', `Error finding one user by email: ${error}`);
    }
  };

  findOneUserByEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      return this.userRepository.findOneBy({ email, password });
    } catch (error: unknown) {
      this.logger.log('error', `Error finding one user by email: ${error}`);
    }
  };

  createStandardUser(user: CreateUserDto): Promise<User> {
    try {
      return this.userRepository.save(user);
    } catch (error: unknown) {
      this.logger.log('error', `Error creating user: ${error}`);
    }
  };

  createOAuthUser(user: any): Promise<User> {
    try {
      return this.userRepository.save(user);
    } catch (error: unknown) {
      this.logger.log('error', `Error creating user: ${error}`);
    }
  };
}


// I have a nestjs api. I intend to offer user login and authorization and route guards. I plan to have the user able to login with a username and password, and also use passport passport-google-oauth20 or also user email and password login with with passport. I also plan to create a jwt based on the user email to send from the server to the ui to store as a secure httpOnly cookie so that the user in ui can access jwt guarded api routes. How would i setup this login setup?