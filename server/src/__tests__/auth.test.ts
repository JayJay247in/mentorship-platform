// server/src/__tests__/auth.test.ts

import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication API - /api/auth', () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await prisma.message.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.availability.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.user.deleteMany({});
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return a token and user object', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'MENTEE',
        });
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail to register a user with an already existing email with a 409 status', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Another User',
        });
        
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User with this email already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token and user object', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail with an incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});