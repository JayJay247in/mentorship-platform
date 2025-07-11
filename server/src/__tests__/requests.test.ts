// src/__tests__/requests.test.ts
import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Mentorship Request API Endpoints', () => {
    let menteeToken: string;
    let mentorToken: string;
    let testMentee: any;
    let testMentor: any;
    let requestId: string;

    // -- UPDATED beforeAll hook --
    beforeAll(async () => {
        // 1. Clean up in the correct order: requests first, then users
        await prisma.mentorshipRequest.deleteMany({
            where: {
                OR: [
                    { mentee: { email: { in: ['test.mentee@example.com', 'test.mentor@example.com'] } } },
                    { mentor: { email: { in: ['test.mentee@example.com', 'test.mentor@example.com'] } } },
                ]
            }
        });
        await prisma.user.deleteMany({
            where: { email: { in: ['test.mentee@example.com', 'test.mentor@example.com'] } },
        });

        // 2. Create users (same as before)
        const menteePassword = await bcrypt.hash('password123', 10);
        testMentee = await prisma.user.create({
            data: {
                email: 'test.mentee@example.com',
                name: 'Test Mentee',
                password: menteePassword,
                role: 'MENTEE',
            },
        });
        const mentorPassword = await bcrypt.hash('password123', 10);
        testMentor = await prisma.user.create({
            data: {
                email: 'test.mentor@example.com',
                name: 'Test Mentor',
                password: mentorPassword,
                role: 'MENTOR',
            },
        });

        // 3. Log in users (same as before)
        const menteeLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test.mentee@example.com', password: 'password123' });
        menteeToken = menteeLogin.body.token;

        const mentorLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test.mentor@example.com', password: 'password123' });
        mentorToken = mentorLogin.body.token;
    });

    // -- UPDATED afterAll hook --
    afterAll(async () => {
        const userEmails = ['test.mentee@example.com', 'test.mentor@example.com'];
        const users = await prisma.user.findMany({ where: { email: { in: userEmails } }, select: { id: true } });
        const userIds = users.map(u => u.id);

        await prisma.$transaction([
            prisma.mentorshipRequest.deleteMany({
                where: { OR: [{ menteeId: { in: userIds } }, { mentorId: { in: userIds } }] },
            }),
            prisma.user.deleteMany({ where: { id: { in: userIds } } }),
        ]);

        await prisma.$disconnect();
    });

    // ... All your 'it' test cases remain exactly the same ...
    
    it('1. should allow a mentee to send a mentorship request to a mentor', async () => {
        const res = await request(app)
            .post('/api/requests')
            .set('Authorization', `Bearer ${menteeToken}`)
            .send({ mentorId: testMentor.id });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.status).toBe('PENDING');
        expect(res.body.menteeId).toBe(testMentee.id);
        requestId = res.body.id; // Save the request ID for the next tests
    });

    it('2. should allow a mentor to view their received requests', async () => {
        const res = await request(app)
            .get('/api/requests/received')
            .set('Authorization', `Bearer ${mentorToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(requestId);
        expect(res.body[0].mentee.name).toBe('Test Mentee');
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
        const updatedRequest = res.body.find((req: any) => req.id === requestId);
        expect(updatedRequest).toBeDefined();
        expect(updatedRequest.status).toBe('ACCEPTED');
    });

    it('should NOT allow a non-mentor to accept a request', async () => {
        const res = await request(app)
            .put(`/api/requests/${requestId}`)
            .set('Authorization', `Bearer ${menteeToken}`)
            .send({ status: 'ACCEPTED' });

        expect(res.status).toBe(403);
    });
});