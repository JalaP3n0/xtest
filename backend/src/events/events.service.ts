import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { EventStatus } from 'packages/types';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, companyId: string, data: any) {
    return this.prisma.event.create({
      data: {
        ...data,
        clientId,
        companyId,
        status: EventStatus.PENDING,
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.event.findMany({
      where: { companyId },
    });
  }

  async updateStatus(id: string, status: EventStatus) {
    return this.prisma.event.update({
      where: { id },
      data: { status },
    });
  }
}
