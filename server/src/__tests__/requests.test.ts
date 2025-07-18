// server/src/__tests__/requests.test.ts

import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Mentorship Request API Endpoints', () => {
  // Set a longer timeout for the entire test suite.
  jest.setTimeout(30000);

  let menteeToken: string;
  let mentorToken: string;
  let mentorId: string;
  let menteeId: string;
  let requestId: string;

  beforeAll(async () => {
    // 1. Clean up database
    await prisma.message.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.mentorshipRequest.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.availability.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Create a mentee and a mentor
    const menteeRes = await request(app).post('/api/auth/register').send({ name: 'Test Mentee', email: 'mentee@request.com', password: 'password123', role: 'MENTEE' });
    menteeId = menteeRes.body.user.id;
    menteeToken = menteeRes.body.token;
    
    const mentorRes = await request(app).post('/api/auth/register').send({ name: 'Test Mentor', email: 'mentor@request.com', password: 'password123', role: 'MENTOR' });
    mentorId = mentorRes.body.user.id;
    mentorToken = mentorRes.body.token;
  });

  it('1. should allow a mentee to send a mentorship request to a mentor', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${menteeToken}`)
      .send({ mentorId: mentorId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.mentorId).toBe(mentorId);
    expect(res.body.menteeId).toBe(menteeId);
    requestId = res.body.id; // Save the request ID for the next tests
  });
  
  it('2. should allow a mentor to view their received requests', async () => {
    const res = await request(app)
      .get('/api/requests/received')
      .set('Authorization', `Bearer ${mentorToken}`);
      
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBe(requestId);
  });
  
  it('3. should allow a mentor to accept a request', async () => {
    const res = await request(app)
      .put(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACCEPTED');
  });

  it('4. should allow the mentee to see that their request was accepted', async () => {
      const res = await request(app)
          .get('/api/requests/sent')
          .set('Authorization', `Bearer ${menteeToken}`);
          
      expect(res.status).toBe(200);
      expect(res.body[0].status).toBe('ACCEPTED');
  });

  it('should NOT allow a non-mentor to accept a request', async () => {
    const res = await request(app)
      .put(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${menteeToken}`) // Using mentee's token
      .send({ status: 'REJECTED' });

    // The middleware should reject this. Depending on your authMiddleware, this might be 403 Forbidden.
    // If your middleware just stops non-mentors without a specific message, 404 is also possible.
    // We will test for 403 as it is more semantically correct for authorization failures.
    expect(res.status).toBe(403);
  });
});