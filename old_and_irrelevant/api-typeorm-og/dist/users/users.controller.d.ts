import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOneUserById(id: number): Promise<User>;
    findOneUserByEmail(email: string): Promise<User>;
}
