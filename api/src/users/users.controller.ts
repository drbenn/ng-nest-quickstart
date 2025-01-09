import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // createUser(@Body() user: CreateUserDto): Promise<User> {
  //   return this.usersService.createUser(user);
  // }

  @Get(':id')
  findOneUserById(
    @Param('id') id: string
  ): Promise<User> {
    return this.usersService.findOneUserById(id);
  }

  @Get(':email')
  findOneUserByEmail(
    @Param('email') email: string
  ): Promise<User> {
    return this.usersService.findOneUserByEmail(email);
  }

}
