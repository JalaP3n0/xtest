import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Role } from 'packages/types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return true if user has required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    mockContext.getRequest.mockReturnValue({ user: { role: Role.ADMIN } });
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return false if user does not have required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    mockContext.getRequest.mockReturnValue({ user: { role: Role.USHER } });
    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
