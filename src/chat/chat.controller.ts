import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { OpenAIChatService } from '../tools/aiTools/chat.service';
import { ValidationPipe } from 'src/tools/ValidationPipe/validation.pipe';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly OpenAIChatService: OpenAIChatService,
  ) {}

  @Post('message')
  chatMessage(@Body() chatDto: ChatDto) {
    const result = this.OpenAIChatService.chatMessage(chatDto);
    return result;
  }
}
