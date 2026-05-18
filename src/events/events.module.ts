import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { AdminController } from './admin.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../lib/prisma.service';
import { StaffingModule } from '../staffing/staffing.module';

@Module({
  imports: [StaffingModule],
  controllers: [EventsController, AdminController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
