import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { authService } from './auth.service';

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should call register', async () => {
    const mockData = { user: { id: '1', email: 'test@example.com' } };
    (axios.post as any).mockResolvedValue({ data: mockData });

    const result = await authService.register({ email: 'test@example.com', password: 'password', role: 'usher' });

    expect(axios.post).toHaveBeenCalledWith('/auth/signup', { email: 'test@example.com', password: 'password', role: 'usher' });
    expect(result).toEqual(mockData);
  });

  it('should call login and store tokens', async () => {
    const mockData = {
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { id: '1', email: 'test@example.com' },
    };
    (axios.post as any).mockResolvedValue({ data: mockData });

    const result = await authService.login({ email: 'test@example.com', password: 'password' });

    expect(axios.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'password' });
    expect(localStorage.getItem('accessToken')).toBe('access');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockData.user);
    expect(result).toEqual(mockData);
  });

  it('should clear storage on logout', () => {
    localStorage.setItem('accessToken', 'test');
    authService.logout();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
