import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './monitoring.service';
import { ChatGateway } from '../chat/chat.gateway';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let chatGateway: ChatGateway;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockChatGateway = {
    server: mockServer,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringService,
        { provide: ChatGateway, useValue: mockChatGateway },
      ],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
    chatGateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request random photo', async () => {
    await service.requestRandomPhoto('e1');

    expect(mockServer.to).toHaveBeenCalledWith('event_e1');
    expect(mockServer.emit).toHaveBeenCalledWith('message', expect.objectContaining({
      eventId: 'e1',
      senderId: 'system-bot',
    }));
  });

  it('should handle event start', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await service.onEventStart('e1');
    expect(consoleSpy).toHaveBeenCalledWith('Monitoring started for event e1');
    consoleSpy.mockRestore();
  });
});
