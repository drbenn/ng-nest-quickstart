import { Module } from '@nestjs/common';
import { SqlAuthService } from './sql-auth.service';

@Module({
  providers: [SqlAuthService],
  exports: [SqlAuthService]
})
export class SqlAuthModule {}
