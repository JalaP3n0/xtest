import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  };

  const mockSocket = {
    id: 's1',
    join: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = mockServer as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle joinEvent', () => {
    const result = gateway.handleJoinEvent('e1', mockSocket);
    expect(mockSocket.join).toHaveBeenCalledWith('event_e1');
    expect(result).toEqual({ event: 'joined', data: 'e1' });
  });

  it('should handle sendMessage', () => {
    const data = { eventId: 'e1', content: 'hi', senderId: 'u1', senderName: 'User 1' };
    gateway.handleMessage(data, mockSocket);
    expect(mockServer.to).toHaveBeenCalledWith('event_e1');
    expect(mockServer.emit).toHaveBeenCalledWith('message', data);
  });

  it('should handle connection', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    gateway.handleConnection(mockSocket);
    expect(consoleSpy).toHaveBeenCalledWith('Client connected: s1');
    consoleSpy.mockRestore();
  });

  it('should handle disconnect', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    gateway.handleDisconnect(mockSocket);
    expect(consoleSpy).toHaveBeenCalledWith('Client disconnected: s1');
    consoleSpy.mockRestore();
  });
});
