import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../lib/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  const mockPrisma = {
    event: {
      count: jest.fn(),
    },
    usher: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get event summary', async () => {
    mockPrisma.event.count.mockResolvedValueOnce(10); // total
    mockPrisma.event.count.mockResolvedValueOnce(5);  // active
    mockPrisma.usher.count.mockResolvedValue(20);

    const result = await service.getEventSummary('c1');

    expect(result).toEqual({
      totalEvents: 10,
      activeEvents: 5,
      usherCount: 20,
    });
    expect(mockPrisma.event.count).toHaveBeenCalledTimes(2);
  });

  it('should get marketing performance', async () => {
    const result = await service.getMarketingPerformance('camp1');
    expect(result).toHaveProperty('scans');
    expect(result).toHaveProperty('leads');
  });
});
