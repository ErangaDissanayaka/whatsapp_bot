import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { log } from 'console';
import { Request, Response } from 'express';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {

  constructor(private whatsappService:WhatsappService){

  }


  @Get('test')
  test() {
    return 'test whatsapp';
  }

  @Get('webhook')
  challengeWebhook(@Req() req: Request, @Res() res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_CHALLENGE_KEY;

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ Webhook Verified');
      return res.status(200).send(challenge); // Send the raw challenge
    } else {
      console.log('❌ Verification Failed');
      return res.sendStatus(403);
    }
  }


 @Post('webhook')
 async handleWebhook(@Req() req: Request, @Res() res: Response) {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const contact = value?.contacts?.[0];
    const message = value?.messages?.[0];

    const senderNumber = contact?.wa_id;
    const senderName = contact?.profile?.name;
    const messageText = message?.text?.body;

    if (senderNumber && messageText) {
      console.log(`📞 Sender Number: ${senderNumber}`);
      console.log(`🧑 Sender Name: ${senderName}`);
      console.log(`💬 Message Text: ${messageText}`);
      // Get AI reply
      const aiReply = await this.whatsappService.getOpenAIReply([
        { role: 'user', content: messageText }
      ]);
      await this.whatsappService.sendMessage(senderNumber, aiReply || 'Sorry, I could not generate a reply.');
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.sendStatus(500);
  }
}

}
