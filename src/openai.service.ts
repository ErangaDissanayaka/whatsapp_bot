import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createChatCompletion(messages: any[], model: string = 'gpt-4o') {
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
      });
      return response.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI API error:', error?.error?.message || error.message || error);
      return 'Sorry, I could not generate a reply due to an AI service error.';
    }
  }
}
