import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'packages/types';
import { RecommendationEngine } from '../staffing/recommendation.engine';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private recommendationEngine: RecommendationEngine,
  ) {}

  @Post()
  @Roles(Role.CLIENT)
  async create(@Request() req, @Body() data: any) {
    return this.eventsService.create(req.user.userId, req.user.companyId, data);
  }

  @Get()
  async findAll(@Request() req) {
    return this.eventsService.findAll(req.user.companyId);
  }

  @Get(':id/recommendations')
  @Roles(Role.CLIENT, Role.ADMIN, Role.SUPER_ADMIN)
  async getRecommendations(@Param('id') id: string) {
    return this.recommendationEngine.recommendUshers(id);
  }
}
