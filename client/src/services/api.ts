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
      // This is the correct and safe way to add the header.
      // Axios ensures config.headers exists. We just add our property.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // On success, just return the response
  (error) => {
    // If the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Remove the token from storage
      localStorage.removeItem('token');
      // Redirect to the login page
      // This is a bit forceful, but ensures security.
      window.location.href = '/login';
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api;
