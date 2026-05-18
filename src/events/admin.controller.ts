import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, EventStatus } from 'packages/types';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private eventsService: EventsService) {}

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async approve(@Param('id') id: string) {
    return this.eventsService.updateStatus(id, EventStatus.APPROVED);
  }
}
