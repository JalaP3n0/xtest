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

export const authService = {
  async login(credentials: any) {
    let data: any;

    try {
      // Prefer Next.js API proxy (Express backend default).
      const response = await axios.post('/api/auth/login', credentials);
      data = response.data;
    } catch {
      // Fallback to direct API client (Nest backend / NEXT_PUBLIC_API_URL setups).
      const response = await api.post('/auth/login', credentials);
      data = response.data;
    }

    const accessToken = data.accessToken || data.token;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('ushereel_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
