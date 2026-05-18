import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { EventsModule } from './events/events.module';
import { StaffingModule } from './staffing/staffing.module';
import { ChatModule } from './chat/chat.module';
import { BotModule } from './bot/bot.module';
import { ReportsService } from './analytics/reports.service';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [
    AuthModule,
    CompanyModule,
    EventsModule,
    StaffingModule,
    ChatModule,
    BotModule,
  ],
  providers: [PrismaService, ReportsService],
})
export class AppModule {}
