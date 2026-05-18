import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtGuard } from './ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

describe('WsJwtGuard', () => {
  let guard: WsJwtGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockContext = {
    switchToWs: jest.fn().mockReturnThis(),
    getClient: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WsJwtGuard,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    guard = module.get<WsJwtGuard>(WsJwtGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw WsException if no token', async () => {
    mockContext.getClient.mockReturnValue({ handshake: { auth: {} } });
    await expect(guard.canActivate(mockContext)).rejects.toThrow(WsException);
  });

  it('should validate token and attach user to socket', async () => {
    const mockSocket = { 
      handshake: { auth: { token: 'valid-token' } },
      data: {},
    } as any;
    mockContext.getClient.mockReturnValue(mockSocket);
    mockJwtService.verifyAsync.mockResolvedValue({ userId: '1' });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockSocket.data.user).toEqual({ userId: '1' });
  });

  it('should throw WsException if token is invalid', async () => {
    mockContext.getClient.mockReturnValue({ handshake: { auth: { token: 'invalid' } } });
    mockJwtService.verifyAsync.mockRejectedValue(new Error());
    await expect(guard.canActivate(mockContext)).rejects.toThrow(WsException);
  });
});
