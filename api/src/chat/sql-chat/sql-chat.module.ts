import { Module } from '@nestjs/common';
import { SqlChatService } from './sql-chat.service';

@Module({
  providers: [SqlChatService],
  exports: [SqlChatService]
})
export class SqlChatModule {


  
}
