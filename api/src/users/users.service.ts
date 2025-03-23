import { Inject, Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user.entity';
// import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from './user.types';
// import { SqlAuthService } from 'src/auth/sql-auth/sql-auth.service';

@Injectable()
export class UsersService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // findOneUserById(id: number): Promise<Partial<User>> {
  //   try {
  //     return this.sqlAuthService.findOneUserById(id);
  //   } catch (error: unknown) {
  //     this.logger.log('error', `Error finding one user by id: ${error}`);
  //   }
  // };

  // findOneUserByEmail(email: string): Promise<Partial<User>> {
  //   try {
  //     return this.sqlAuthService.findOneUserByEmail(email);
  //   } catch (error: unknown) {
  //     this.logger.log('error', `Error finding one user by email: ${error}`);
  //   }
  // };

  // findOneUserByEmailAndPassword(email: string, password: string): Promise<Partial<User>> {
  //   try {
  //     return this.sqlAuthService.findOneUserByEmailAndPassword(email, password);
  //   } catch (error: unknown) {
  //     this.logger.log('error', `Error finding one user by email: ${error}`);
  //   }
  // };

  // createStandardUser(user: CreateUserDto): Promise<Partial<User>> {
  //   try {
  //     return this.sqlAuthService.save(user);
  //   } catch (error: unknown) {
  //     this.logger.log('error', `Error creating user: ${error}`);
  //   }
  // };

  // createOAuthUser(user: any): Promise<Partial<User>> {
  //   try {
  //     return this.sqlAuthService.save(user);
  //   } catch (error: unknown) {
  //     this.logger.log('error', `Error creating user: ${error}`);
  //   }
  // };
}