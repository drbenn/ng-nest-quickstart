import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOneUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  };

  findOneUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  };

  createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  };
}
