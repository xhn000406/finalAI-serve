import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { Observable, from, map, tap } from 'rxjs';
import { ChatService } from 'src/chat/chat.service'; // 导入ChatService
import { PrismaService } from '../db/prisma.service';
import { SessionService } from '../../tools/seesion/session.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class OpenAIChatService {
  private readonly logger = new Logger(OpenAIChatService.name);
  private readonly openai: OpenAI;

  // 注入ChatService用于数据库操作
  constructor(
    private readonly chatService: ChatService,
    private prisma: PrismaService,
    private SessionService: SessionService,
  ) {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-18900fb0a41b4317bd81d3bfcead7b49',
    });
  }

  // 普通非流式调用
  async chatMessage(chatDto: ChatDto) {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-18900fb0a41b4317bd81d3bfcead7b49',
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: chatDto.message }],
      model: 'deepseek-chat',
      // 非流式调用，默认为false
    });

    // 非流式调用直接保存
    // await this.saveToDatabase(
    //   chatDto.message,
    //   completion.choices[0].message.content,
    // );

    return completion.choices;
  }

  // 流式调用 - 带完整内容收集和数据库保存
  streamChatMessage(chatDto: ChatDto, userId, roomId) {
    let fullResponse = '';
    const userMessage = chatDto.message;

    // 1. 创建流式请求，返回的是AsyncIterable<ChatCompletionChunk>
    const stream = this.openai.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'deepseek-chat',
      stream: true, // 启用流式
    });

    return new Observable((observer) => {
      // 调用服务获取流式数据

      // 处理异步可迭代流
      (async () => {
        try {
          // 迭代每个流式片段
          for await (const chunk of await stream) {
            // 提取当前片段的文本内容（注意可能为undefined）
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              // 按照SSE规范推送数据（data字段为必须）
              observer.next({ data: { msg: content } });
              fullResponse += content; // 累积完整响应
            }
          }

          let userDto;
          let fineRoomId;
          let fineUserId;

          console.log('请求头获取的', userId);
          if (!roomId) {
            userDto = await this.SessionService.createSession(userId);
            fineRoomId = userDto.roomId;
            fineUserId = userDto.findUserId;
          } else {
            fineRoomId = roomId;
          }

          console.log('结束后获取的', userDto);
          // 等流式输出完毕后保存进数据库
          console.log('保存到数据库：', fullResponse);
          await this.prisma.chatRecord.create({
            data: {
              question: userMessage,
              answer: fullResponse,
             userId: fineUserId,
              roomId: fineRoomId,
              status: 3,
            },
          });

          // 流结束时通知客户端
          observer.complete();
        } catch (error) {
          // 错误处理
          observer.error(error);
        }
      })();
    });
    // 2. 关键：用from处理异步迭代器，确保正确解析APIPromise
    // return from(stream).pipe(
    //   // 3. 解析每个chunk的内容
    //   map((chunk: any) => {
    //     // 防御性检查chunk和choices
    //     if (
    //       !chunk ||
    //       !chunk.choices ||
    //       !Array.isArray(chunk.choices) ||
    //       chunk.choices.length === 0
    //     ) {
    //       this.logger.warn('收到无效的chunk数据:', chunk);
    //       return '';
    //     }
    //     // 提取当前chunk的内容（delta.content可能为null）
    //     const content = chunk.choices[0]?.delta?.content || '';
    //     fullResponse += content; // 累积完整响应
    //     return content;
    //   }),
    //   // 4. 流结束后保存到数据库
    //   tap({
    //     complete: async () => {
    //       this.logger.log('流式响应结束，完整内容：', fullResponse);
    //       try {
    //         await this.saveToDatabase(userMessage, fullResponse);
    //       } catch (e) {
    //         this.logger.error('保存到数据库失败:', e);
    //       }
    //     },
    //     error: (err) => {
    //       this.logger.error('流式处理失败：', err);
    //     },
    //   }),
    // );
  }
  // 数据库保存逻辑
  async saveToDatabase(userMessage: string, aiResponse: string) {
    if (!aiResponse) {
      this.logger.warn('AI响应内容为空，不保存到数据库');
      return;
    }

    // 调用ChatService的保存方法（假设create方法存在）
    await this.chatService.create({
      userMessage,
      aiResponse,
      timestamp: new Date(),
      // 可以添加其他必要字段，如对话ID、用户ID等
    });
  }
  async getChatHistory(userId, roomId) {
    if (userId && roomId) {
      const chatHistory = await this.prisma.chatRecord.findMany({
        where: {
          userId: userId,
          roomId: roomId,
        },
      });
      return chatHistory;
    } else {
      return [];
    }
  }

  async getChatRoom(userId) {
    if (userId) {
      const chatHistory = await this.prisma.chatSession.findMany({
        where: {
          userId: userId,
        },
      });
      return chatHistory;
    } else {
      return [];
    }
  }
}
