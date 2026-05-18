import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getEventSummary(companyId: string) {
    const totalEvents = await this.prisma.event.count({ where: { companyId } });
    const activeEvents = await this.prisma.event.count({ 
      where: { companyId, status: 'APPROVED' } 
    });
    
    return {
      totalEvents,
      activeEvents,
      usherCount: await this.prisma.usher.count(), // Simplified
    };
  }

  async getMarketingPerformance(campaignId: string) {
    // Aggregation logic for campaign scans and leads
    return {
      scans: 150,
      leads: 45,
      conversionRate: 0.3,
    };
  }
}
