import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { OpenAI } from 'openai';

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        embeddings: {
          create: jest.fn(),
        },
        chat: {
          completions: {
            create: jest.fn(),
          },
        },
      };
    }),
  };
});

describe('AIService', () => {
  let service: AIService;
  let mockOpenAIInstance: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIService],
    }).compile();

    service = module.get<AIService>(AIService);
    mockOpenAIInstance = (service as any).openai;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate embedding', async () => {
    const mockResponse = {
      data: [{ embedding: [0.1, 0.2] }],
    };
    mockOpenAIInstance.embeddings.create.mockResolvedValue(mockResponse);

    const result = await service.generateEmbedding('test');
    expect(result).toEqual([0.1, 0.2]);
    expect(mockOpenAIInstance.embeddings.create).toHaveBeenCalledWith({
      model: 'text-embedding-3-small',
      input: 'test',
    });
  });

  it('should get ranking explanation', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Explanation' } }],
    };
    mockOpenAIInstance.chat.completions.create.mockResolvedValue(mockResponse);

    const result = await service.getRankingExplanation('profile', 'requirements');
    expect(result).toBe('Explanation');
    expect(mockOpenAIInstance.chat.completions.create).toHaveBeenCalled();
  });

  it('should return default explanation if no content', async () => {
    const mockResponse = {
      choices: [{ message: { content: null } }],
    };
    mockOpenAIInstance.chat.completions.create.mockResolvedValue(mockResponse);

    const result = await service.getRankingExplanation('profile', 'requirements');
    expect(result).toBe('No explanation available.');
  });
});
