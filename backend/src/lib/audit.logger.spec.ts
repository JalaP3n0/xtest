import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogger } from './audit.logger';
import { PrismaService } from './prisma.service';

describe('AuditLogger', () => {
  let logger: AuditLogger;
  let prisma: PrismaService;

  const mockPrisma = {
    auditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogger,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    logger = module.get<AuditLogger>(AuditLogger);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should create an audit log entry', async () => {
    mockPrisma.auditLog.create.mockResolvedValue({ id: '1' });

    await logger.log('SECURITY', 'Login attempt', 'u1', 'cmp1', { ip: '127.0.0.1' });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        level: 'SECURITY',
        action: 'Login attempt',
        userId: 'u1',
        companyId: 'cmp1',
        metadata: { ip: '127.0.0.1' },
      }
    });
  });
});
