import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const data = { email: 'test@example.com', password: 'password' };
    mockAuthService.register.mockResolvedValue({ id: '1' });

    const result = await controller.register(data);
    expect(result).toEqual({ id: '1' });
    expect(service.register).toHaveBeenCalledWith(data);
  });

  it('should login a user', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    mockAuthService.login.mockResolvedValue({ accessToken: 'token' });

    const result = await controller.login(credentials);
    expect(result).toEqual({ accessToken: 'token' });
    expect(service.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should return user profile', () => {
    const req = { user: { id: '1', email: 'test@example.com' } };
    const result = controller.getProfile(req);
    expect(result).toEqual(req.user);
  });
});
