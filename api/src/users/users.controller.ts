import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
// import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get(':id')
  // findOneUserById(
  //   @Param('id') id: number
  // ): Promise<User> {
  //   return this.usersService.findOneUserById(id);
  // };

  // @Get(':email')
  // findOneUserByEmail(
  //   @Param('email') email: string
  // ): Promise<User> {
  //   return this.usersService.findOneUserByEmail(email);
  // };

}
