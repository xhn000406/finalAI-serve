import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAIChatService } from '../tools/aiTools/chat.service';
import { PrismaService } from 'src/tools/db/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, OpenAIChatService, PrismaService],
})
export class ChatModule {}
