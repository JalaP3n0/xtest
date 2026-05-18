import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../lib/prisma.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: PrismaService;

  const mockPrisma = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const data = { name: 'Test Corp' };
      mockPrisma.company.create.mockResolvedValue({ id: '1', ...data });

      const result = await service.create(data.name);

      expect(prisma.company.create).toHaveBeenCalledWith({
        data: { name: data.name }
      });
      expect(result.id).toBe('1');
    });
  });
});
