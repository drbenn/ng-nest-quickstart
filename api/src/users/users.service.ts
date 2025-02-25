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