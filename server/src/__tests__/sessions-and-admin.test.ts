// src/__tests__/sessions-and-admin.test.ts
import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Session and Admin API Endpoints', () => {
  let menteeToken: string;
  let mentorToken: string;
  let adminToken: string;
  let testMentee: any;
  let testMentor: any;
  let testAdmin: any;
  let acceptedRequestId: string;
  let sessionId: string;

  // ==== SETUP: Runs ONCE before all tests in this file ====
  beforeAll(async () => {
    // 1. Clean up previous test users to ensure a fresh start
    // ---- THIS IS THE CRUCIAL FIX ----
    // Delete in the correct order to respect foreign key constraints

    // First, delete records that depend on users
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.userSkill.deleteMany({});

    // Now it's safe to delete the users themselves
    await prisma.user.deleteMany({
      where: { email: { contains: '@test.example.com' } },
    });

    // 2. Create fresh test users (mentee, mentor, admin)
    const menteePassword = await bcrypt.hash('password123', 10);
    testMentee = await prisma.user.create({
      data: {
        email: 'session.mentee@test.example.com',
        name: 'Session Mentee',
        password: menteePassword,
        role: 'MENTEE',
      },
    });

    const mentorPassword = await bcrypt.hash('password123', 10);
    testMentor = await prisma.user.create({
      data: {
        email: 'session.mentor@test.example.com',
        name: 'Session Mentor',
        password: mentorPassword,
        role: 'MENTOR',
      },
    });

    const adminPassword = await bcrypt.hash('password123', 10);
    testAdmin = await prisma.user.create({
      data: {
        email: 'session.admin@test.example.com',
        name: 'Session Admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // 3. Log them in to get their JWTs
    const menteeLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testMentee.email, password: 'password123' });
    menteeToken = menteeLogin.body.token;

    const mentorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testMentor.email, password: 'password123' });
    mentorToken = mentorLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: 'password123' });
    adminToken = adminLogin.body.token;

    // 4. Create a pre-accepted request to be used for session tests
    const acceptedRequest = await prisma.mentorshipRequest.create({
      data: {
        menteeId: testMentee.id,
        mentorId: testMentor.id,
        status: 'ACCEPTED',
      },
    });
    acceptedRequestId = acceptedRequest.id;
  }, 30000);

  // ==== TEARDOWN: Runs ONCE after all tests ====
  afterAll(async () => {
    // Clean up in the correct order again
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.userSkill.deleteMany({});

    await prisma.user.deleteMany({
      where: { email: { contains: '@test.example.com' } },
    });

    await prisma.$disconnect();
  });

  // --- SESSION TESTS ---
  describe('Session Endpoints', () => {
    it('should allow a mentee to schedule a session for an accepted request', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({
          requestId: acceptedRequestId,
          scheduledTime: '2099-01-01T10:00:00.000Z',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      sessionId = res.body.id; // Save for feedback test
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
      // First, update the session time to be in the past
      await prisma.session.update({
        where: { id: sessionId },
        data: { scheduledTime: '2020-01-01T10:00:00.000Z' },
      });

      const res = await request(app)
        .put(`/api/sessions/${sessionId}/feedback`)
        .set('Authorization', `Bearer ${menteeToken}`)
        .send({ rating: 5, comment: 'Great session!' });

      expect(res.status).toBe(200);
      expect(res.body.rating).toBe(5);
    });
  });

  // --- ADMIN TESTS ---
  describe('Admin Endpoints', () => {
    it('should allow an admin to get a list of all users', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
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
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${mentorToken}`); // Using mentor token
      expect(res.status).toBe(403); // Forbidden
    });
  });
});
