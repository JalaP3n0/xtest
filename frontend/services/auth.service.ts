import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-2bdc.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor ensures every request gets the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: any) {
    // Call the backend directly via our configured 'api' instance
    const response = await api.post('/auth/login', credentials);
    const data = response.data;

    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    // This now correctly hits /api/auth/me with the Authorization header
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
