// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API URL
});

// Interceptor to add the auth token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;