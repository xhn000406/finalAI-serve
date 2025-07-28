import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatDto } from 'src/chat/dto/chat.dto';
@Injectable()
export class OpenAIChatService {
  constructor() {}

  async chatMessage(ChatDto: ChatDto) {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-18900fb0a41b4317bd81d3bfcead7b49',
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: ChatDto.message }],
      model: 'deepseek-chat',
    });
    return completion.choices;
    console.log(completion.choices[0].message.content);
  }
}
