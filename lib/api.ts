import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const gameAPI = {
  // User endpoints
  createUser: (playerName: string) => 
    api.post('/user', { name: playerName }),
  
  getWallet: (playerId: string) => 
    api.get(`/user/${playerId}/wallet`),
  
  // Game endpoints
  getRounds: (limit: number = 10) => 
    api.get(`/game/rounds?limit=${limit}`),
  
  getRoundHistory: () => 
    api.get('/game/history'),
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);