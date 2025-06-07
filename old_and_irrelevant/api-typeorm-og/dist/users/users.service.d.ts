import { Logger } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
export declare class UsersService {
    private userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, logger: Logger);
    findOneUserById(id: number): Promise<User>;
    findOneUserByEmail(email: string): Promise<User>;
    findOneUserByEmailAndPassword(email: string, password: string): Promise<User>;
    createStandardUser(user: CreateUserDto): Promise<User>;
    createOAuthUser(user: any): Promise<User>;
}
