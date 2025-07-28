import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAIChatService } from '../tools/aiTools/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, OpenAIChatService],
})
export class ChatModule {}
