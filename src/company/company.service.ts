import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.company.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.company.findMany();
  }
}
