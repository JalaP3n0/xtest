import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { PrismaService } from '../lib/prisma.service';

describe('TrackingService', () => {
  let service: TrackingService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should track scan', async () => {
    const result = await service.trackScan('camp1', { ip: '1.2.3.4' });
    expect(result.tracked).toBe(true);
  });

  it('should collect lead', async () => {
    const result = await service.collectLead('camp1', { email: 'lead@test.com' });
    expect(result.status).toBe('success');
  });
});
