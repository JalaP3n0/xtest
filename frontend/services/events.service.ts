import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventsService = {
  async create(data: any) {
    return api.post('/events', data);
  },

  async getAll() {
    return api.get('/events');
  },

  async approve(id: string) {
    return api.patch(`/admin/events/${id}/approve`);
  },

  async getRecommendations(id: string) {
    return api.get(`/events/${id}/recommendations`);
  },
};
