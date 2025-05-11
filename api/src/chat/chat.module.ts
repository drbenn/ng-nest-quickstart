import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { SqlChatService } from './sql-chat/sql-chat.service';

@Module({
  providers: [ChatGateway, ChatService, SqlChatService]
})
export class ChatModule {}
