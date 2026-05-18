import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { RecommendationEngine } from '../staffing/recommendation.engine';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;
  let recommendationEngine: RecommendationEngine;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockRecommendationEngine = {
    recommendUshers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
        { provide: RecommendationEngine, useValue: mockRecommendationEngine },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
    recommendationEngine = module.get<RecommendationEngine>(RecommendationEngine);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an event', async () => {
    const req = { user: { userId: 'u1', companyId: 'c1' } };
    const data = { name: 'Event 1' };
    mockEventsService.create.mockResolvedValue({ id: 'e1' });

    const result = await controller.create(req, data);
    expect(result).toEqual({ id: 'e1' });
    expect(eventsService.create).toHaveBeenCalledWith('u1', 'c1', data);
  });

  it('should find all events for company', async () => {
    const req = { user: { companyId: 'c1' } };
    mockEventsService.findAll.mockResolvedValue([{ id: 'e1' }]);

    const result = await controller.findAll(req);
    expect(result).toEqual([{ id: 'e1' }]);
    expect(eventsService.findAll).toHaveBeenCalledWith('c1');
  });

  it('should get recommendations', async () => {
    mockRecommendationEngine.recommendUshers.mockResolvedValue([{ id: 'u1' }]);

    const result = await controller.getRecommendations('e1');
    expect(result).toEqual([{ id: 'u1' }]);
    expect(recommendationEngine.recommendUshers).toHaveBeenCalledWith('e1');
  });
});
