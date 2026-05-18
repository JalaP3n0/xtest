import { Injectable } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class MonitoringService {
  constructor(private chatGateway: ChatGateway) {}

  async requestRandomPhoto(eventId: string) {
    const message = {
      eventId,
      content: '🤖 [BOT] Random Photo Request: Please upload a photo of your current position within 5 minutes.',
      senderId: 'system-bot',
      senderName: 'Monitoring Bot',
    };

    // Emit via socket gateway
    this.chatGateway.server.to(`event_${eventId}`).emit('message', message);
    
    console.log(`Sent random photo request for event ${eventId}`);
  }

  // This could be triggered by a Cron job or an event hook
  async onEventStart(eventId: string) {
    console.log(`Monitoring started for event ${eventId}`);
    // Logic to schedule random requests
  }
}
