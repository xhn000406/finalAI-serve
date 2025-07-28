import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
@Injectable()
export class OpenAIChatService {
  constructor() {}

  async chatMessage() {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-18900fb0a41b4317bd81d3bfcead7b49',
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: '你叫什么名字？' }],
      model: 'deepseek-chat',
    });
    return completion.choices;
    console.log(completion.choices[0].message.content);
  }
}
