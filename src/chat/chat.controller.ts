import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Sse,
  Query,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { OpenAIChatService } from '../tools/aiTools/chat.service';
import { ValidationPipe } from 'src/tools/ValidationPipe/validation.pipe';
import { ChatDto } from './dto/chat.dto';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly OpenAIChatService: OpenAIChatService,
  ) {}

  @Post('message')
  chatMessage(@Body() chatDto: ChatDto) {
    //调取普通的非流式调用
    const result = this.OpenAIChatService.chatMessage(chatDto);
    return result;
  }

  @Sse('stream')
  /**
   * 通过流的方式接收聊天消息
   *
   * @param chatDto 包含聊天信息的数据传输对象
   * @returns 一个可观察的流，用于异步接收聊天消息
   */
  stream(
    @Query() chatDto: ChatDto,
    @Headers('user-id') userId: string,
    @Headers('room-id') roomId: string,
     @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    return this.OpenAIChatService.streamChatMessage(chatDto, userId, roomId);
  }

  @Get('chatHistory')
  getChatHistory(
    @Headers('user-id') userId: string,
    @Headers('room-id') roomId: string,
  ) {
    return this.OpenAIChatService.getChatHistory(userId, roomId);
  }

  @Get('chatRoom')
  getChatRoom(
    @Headers('user-id') userId: string,
    @Headers('room-id') roomId: string,
  ) {
    return this.OpenAIChatService.getChatRoom(userId);
  }
}
