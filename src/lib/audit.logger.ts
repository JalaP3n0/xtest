import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export enum AuditLevel {
  SECURITY = 'SECURITY',
  OPERATION = 'OPERATION',
  SYSTEM = 'SYSTEM',
}

@Injectable()
export class AuditLogger {
  private readonly logger = new Logger('Audit');

  constructor(private prisma: PrismaService) {}

  async log(level: string, action: string, userId: string, companyId: string | null, metadata: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          level,
          action,
          userId,
          companyId,
          metadata: metadata || {},
        },
      });

      this.logger.log(`[${level}] ${action} by User ${userId} (Company: ${companyId}): ${JSON.stringify(metadata)}`);
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
    }
  }
}
