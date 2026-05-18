import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class BotModule {}
