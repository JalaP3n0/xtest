import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { EventsService } from './events.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: EventsService;

  const mockEventsService = {
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should approve an event', async () => {
    mockEventsService.updateStatus.mockResolvedValue({ id: 'e1', status: 'APPROVED' });

    const result = await controller.approve('e1');
    expect(result).toEqual({ id: 'e1', status: 'APPROVED' });
    expect(service.updateStatus).toHaveBeenCalledWith('e1', 'APPROVED');
  });
});
