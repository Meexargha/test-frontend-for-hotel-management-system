import axios from 'axios';
import toast from 'react-hot-toast';

// Default to local backend, but allow override via localStorage for flexibility
// Use 127.0.0.1 instead of localhost to avoid potential IPv6 lookup issues in some Node versions
const BASE_URL = localStorage.getItem('api_url') || 'http://127.0.0.1:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors (server down, CORS, wrong URL)
    if (error.message === 'Network Error') {
      toast.error(`Cannot connect to server at ${BASE_URL}. Is the backend running?`);
    }

    // Handle Authentication Errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page to avoid loops
      if (!window.location.hash.includes('login')) {
         window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;