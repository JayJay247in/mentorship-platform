// server/src/__tests__/sessions-and-admin.test.ts

import request from 'supertest';
import app from '../server';
import { PrismaClient, User } from '@prisma/client';

jest.mock('../services/mailService');

const prisma = new PrismaClient();

describe('Session and Admin API Endpoints', () => {
  jest.setTimeout(30000);

  let adminToken: string, mentorToken: string, menteeToken: string;
  let testMentor: User, testMentee: User;
  let requestId: string, sessionId: string;

  beforeAll(async () => {
    // 1. Database Cleanup
    await prisma.message.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.availability.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Create Users and get Tokens
    const adminRes = await request(app).post('/api/auth/register').send({ name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'ADMIN' });
    adminToken = adminRes.body.token;

    const mentorRes = await request(app).post('/api/auth/register').send({ name: 'Session Mentor', email: 'mentor@session.com', password: 'password123', role: 'MENTOR' });
    testMentor = mentorRes.body.user;
    mentorToken = mentorRes.body.token;
    
    const menteeRes = await request(app).post('/api/auth/register').send({ name: 'Session Mentee', email: 'mentee@session.com', password: 'password123', role: 'MENTEE' });
    testMentee = menteeRes.body.user;
    menteeToken = menteeRes.body.token;

    // 3. Create an ACCEPTED mentorship request to set up session tests
    const reqRes = await request(app).post('/api/requests').set('Authorization', `Bearer ${menteeToken}`).send({ mentorId: testMentor.id });
    requestId = reqRes.body.id;
    await request(app).put(`/api/requests/${requestId}`).set('Authorization', `Bearer ${mentorToken}`).send({ status: 'ACCEPTED' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  // --- SESSION TESTS ---
  describe('Session Endpoints', () => {
    it('should allow a mentee to schedule a session for an accepted request', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          requestId: requestId,
          scheduledTime: '2099-01-01T10:00:00.000Z',
        });
        
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      sessionId = res.body.id; // Correctly save the ID for the next test
    });

    it('should allow a mentor to view their upcoming sessions', async () => {
        const res = await request(app)
            .get('/api/sessions/mentor')
            .set('Authorization', `Bearer ${mentorToken}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(sessionId);
    });
    
    it('should allow a mentee to submit feedback for a past session', async () => {
        // First, programmatically set the session date to the past
        await prisma.session.update({
          where: { id: sessionId }, // Now sessionId is guaranteed to be defined
          data: { scheduledTime: '2020-01-01T10:00:00.000Z' },
        });
      
        const res = await request(app)
            .put(`/api/sessions/${sessionId}/feedback`)
            .set('Authorization', `Bearer ${menteeToken}`)
            .send({ rating: 5, comment: 'Great session!' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.rating).toBe(5);
    });
  });

  // --- ADMIN TESTS ---
  describe('Admin Endpoints', () => {
    it('should allow an admin to get a list of all users', async () => {
      const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should allow an admin to update a user role', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${testMentee.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'MENTOR' });
        
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('MENTOR');
    });

    it('should allow an admin to create a manual match', async () => {
        const res = await request(app)
            .post('/api/admin/matches')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ menteeId: testMentee.id, mentorId: testMentor.id });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('ACCEPTED');
    });

    it('should NOT allow a non-admin to access an admin route', async () => {
      const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${mentorToken}`);
      // Middleware should correctly identify this is not an Admin token and forbid access.
      expect(res.status).toBe(403);
    });
  });
});