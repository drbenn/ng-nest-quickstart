import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user.entity';
// import { SqlAuthModule } from 'src/auth/sql-auth/sql-auth.module';

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  // imports: [SqlAuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
