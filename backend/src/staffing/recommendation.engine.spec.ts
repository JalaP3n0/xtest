import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationEngine } from './recommendation.engine';
import { PrismaService } from '../lib/prisma.service';
import { AIService } from './ai.service';

describe('RecommendationEngine', () => {
  let engine: RecommendationEngine;
  let prisma: PrismaService;
  let ai: AIService;

  const mockPrisma = {
    event: {
      findUnique: jest.fn(),
    },
    $queryRawUnsafe: jest.fn(),
  };

  const mockAI = {
    generateEmbedding: jest.fn(),
    getRankingExplanation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationEngine,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AIService, useValue: mockAI },
      ],
    }).compile();

    engine = module.get<RecommendationEngine>(RecommendationEngine);
    prisma = module.get<PrismaService>(PrismaService);
    ai = module.get<AIService>(AIService);
  });

  it('should be defined', () => {
    expect(engine).toBeDefined();
  });

  it('should throw error if event not found', async () => {
    mockPrisma.event.findUnique.mockResolvedValue(null);
    await expect(engine.recommendUshers('e1')).rejects.toThrow('Event not found');
  });

  it('should recommend ushers', async () => {
    const mockEvent = { id: 'e1', name: 'Event 1', language: 'English', companyId: 'c1' };
    mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
    mockAI.generateEmbedding.mockResolvedValue([0.1, 0.2]);
    
    const mockUshers = [
      { id: 'u1', userId: 'usr1', bio: 'Bio 1', experience: 'Exp 1', rating: 5, reliabilityScore: 100, distance: 0.1 },
    ];
    mockPrisma.$queryRawUnsafe.mockResolvedValue(mockUshers);
    mockAI.getRankingExplanation.mockResolvedValue('Explanation');

    const result = await engine.recommendUshers('e1');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'u1',
      similarity: 0.9,
      explanation: 'Explanation',
    });
    expect(mockAI.generateEmbedding).toHaveBeenCalledWith('Event 1 language: English');
  });
});
