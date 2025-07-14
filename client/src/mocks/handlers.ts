// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api'; // Make sure this matches your api.ts

export const handlers = [
  // Mock the "Login" endpoint
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const info = (await request.json()) as any;

    // Simulate a successful login
    if (info.email === 'test@example.com' && info.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        userId: 'cuid123',
        role: 'MENTEE',
      });
    }

    // Simulate a failed login
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  // Mock the "Get Me" endpoint, which is called after login
  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      id: 'cuid123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'MENTEE',
    });
  }),
];
