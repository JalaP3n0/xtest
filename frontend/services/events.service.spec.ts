import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { eventsService } from './events.service';

vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn().mockReturnThis(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  };
  return {
    default: mockAxios,
    ...mockAxios
  };
});

describe('eventsService', () => {
  it('should call create event', async () => {
    const data = { name: 'Event 1' };
    await eventsService.create(data);
    expect(axios.post).toHaveBeenCalledWith('/events', data);
  });

  it('should call getAll events', async () => {
    await eventsService.getAll();
    expect(axios.get).toHaveBeenCalledWith('/events');
  });

  it('should call approve event', async () => {
    await eventsService.approve('e1');
    expect(axios.patch).toHaveBeenCalledWith('/admin/events/e1/approve');
  });

  it('should call getRecommendations', async () => {
    await eventsService.getRecommendations('e1');
    expect(axios.get).toHaveBeenCalledWith('/events/e1/recommendations');
  });
});
