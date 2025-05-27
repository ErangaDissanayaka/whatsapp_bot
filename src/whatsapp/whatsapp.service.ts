import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai.service';
const axios = require('axios');

@Injectable()
export class WhatsappService {
  constructor(private openaiService: OpenaiService) {}

  async sendMessage(to: string, message: string) {
    let data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }

  async getOpenAIReply(messages: any[]) {
    // Always use gpt-4o, ignore any passed model
    return this.openaiService.createChatCompletion(messages, 'gpt-4o-mini');
  }
}

