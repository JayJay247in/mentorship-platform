// src/controllers/sessionController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

/**
 * @desc    Schedule a new session from an accepted request
 * @route   POST /api/sessions
 * @access  Private (Mentees only)
 */
export const scheduleSession = async (req: AuthRequest, res: Response) => {
    const { requestId, scheduledTime } = req.body;
    const menteeId = req.user!.userId;

    if (!requestId || !scheduledTime) {
        return res.status(400).json({ message: 'Request ID and scheduled time are required' });
    }

    try {
        // 1. Find the original mentorship request
        const request = await prisma.mentorshipRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return res.status(404).json({ message: 'Mentorship request not found' });
        }

        // 2. Security & Logic Checks
        if (request.menteeId !== menteeId) {
            return res.status(403).json({ message: 'Forbidden: You can only book sessions for your own requests' });
        }
        if (request.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Cannot book a session for a request that is not accepted' });
        }
        
        // 3. Check if a session has already been booked for this request
        const existingSession = await prisma.session.findUnique({
            where: { requestId: requestId },
        });

        if (existingSession) {
            return res.status(409).json({ message: 'A session has already been scheduled for this request' });
        }

        // 4. Create the session
        const newSession = await prisma.session.create({
            data: {
                requestId: requestId,
                menteeId: request.menteeId,
                mentorId: request.mentorId,
                scheduledTime: new Date(scheduledTime), // Ensure it's a valid Date object
            },
        });

        res.status(201).json(newSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while scheduling session' });
    }
};

/**
 * @desc    Get all sessions for the current user (as mentee)
 * @route   GET /api/sessions/mentee
 * @access  Private (Mentees only)
 */
export const getSessionsAsMentee = async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { menteeId: req.user!.userId },
            include: { mentor: { select: { id: true, name: true } } },
            orderBy: { scheduledTime: 'asc' },
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get all sessions for the current user (as mentor)
 * @route   GET /api/sessions/mentor
 * @access  Private (Mentors only)
 */
export const getSessionsAsMentor = async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { mentorId: req.user!.userId },
            include: { mentee: { select: { id: true, name: true } } },
            orderBy: { scheduledTime: 'asc' },
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Submit feedback for a completed session
 * @route   PUT /api/sessions/:id/feedback
 * @access  Private (Mentees only, for this implementation)
 */
export const submitFeedback = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Session ID is required' });
    }
    const sessionId: string = id;
    const { rating, comment } = req.body;
    const userId = req.user!.userId;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
    }

    if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'A rating between 1 and 5 is required' });
    }

    try {
        // 1. Find the session
        const session = await prisma.session.findUnique({ where: { id: sessionId } });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // 2. Security & Logic Checks
        if (session.menteeId !== userId) {
            return res.status(403).json({ message: 'Forbidden: You can only give feedback on your own sessions' });
        }
        if (new Date(session.scheduledTime) > new Date()) {
            return res.status(400).json({ message: 'Cannot give feedback for a session that has not yet occurred' });
        }
        
        // 3. Create or update the feedback
        // Using upsert is a robust way to handle this. It will create feedback if it doesn't exist,
        // or update it if the user wants to change their rating/comment.
        const feedback = await prisma.feedback.upsert({
            where: { sessionId: sessionId }, // Unique constraint on sessionId
            update: {
                rating,
                comment,
            },
            create: {
                sessionId,
                rating,
                comment,
                authorId: userId,
            },
        });

        // Optionally, update the session status to 'COMPLETED'
        await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'COMPLETED' },
        });

        res.json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while submitting feedback' });
    }
};