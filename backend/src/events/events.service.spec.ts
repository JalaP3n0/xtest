import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../lib/prisma.service';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  const mockPrisma = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event with PENDING status', async () => {
      const data = { title: 'Test Event', date: new Date() };
      mockPrisma.event.create.mockResolvedValue({ id: '1', ...data, status: 'PENDING' });

      const result = await service.create('c1', 'cmp1', data);

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          ...data,
          clientId: 'c1',
          companyId: 'cmp1',
          status: 'PENDING',
        }
      });
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return events for a company', async () => {
      mockPrisma.event.findMany.mockResolvedValue([{ id: '1' }]);

      const result = await service.findAll('cmp1');

      expect(prisma.event.findMany).toHaveBeenCalledWith({
        where: { companyId: 'cmp1' }
      });
      expect(result.length).toBe(1);
    });
  });
});
