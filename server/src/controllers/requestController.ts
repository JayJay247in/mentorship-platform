// src/controllers/requestController.ts
import { Response } from 'express';
import { PrismaClient, RequestStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

/**
 * @desc    Create a new mentorship request
 * @route   POST /api/requests
 * @access  Private (Mentees only)
 */
export const createMentorshipRequest = async (req: AuthRequest, res: Response) => {
    const { mentorId } = req.body;
    const menteeId = req.user!.userId;

    if (!mentorId) {
        return res.status(400).json({ message: 'Mentor ID is required' });
    }

    if (mentorId === menteeId) {
        return res.status(400).json({ message: 'You cannot send a mentorship request to yourself' });
    }

    try {
        // Check if the target user is actually a mentor
        const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
        if (!mentor || mentor.role !== 'MENTOR') {
            return res.status(404).json({ message: 'Mentor not found or user is not a mentor' });
        }

        // Check if a pending request already exists
        const existingRequest = await prisma.mentorshipRequest.findFirst({
            where: { menteeId, mentorId, status: 'PENDING' },
        });

        if (existingRequest) {
            return res.status(409).json({ message: 'A pending request to this mentor already exists' });
        }

        const newRequest = await prisma.mentorshipRequest.create({
            data: {
                menteeId,
                mentorId,
            },
        });
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating request' });
    }
};

/**
 * @desc    Get requests sent by the current mentee
 * @route   GET /api/requests/sent
 * @access  Private (Mentees only)
 */
export const getSentRequests = async (req: AuthRequest, res: Response) => {
    const menteeId = req.user!.userId;
    try {
        const requests = await prisma.mentorshipRequest.findMany({
            where: { menteeId },
            include: { // Include mentor's name for easier display on the frontend
                mentor: { select: { id: true, name: true, bio: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get requests received by the current mentor
 * @route   GET /api/requests/received
 * @access  Private (Mentors only)
 */
export const getReceivedRequests = async (req: AuthRequest, res: Response) => {
    const mentorId = req.user!.userId;
    try {
        const requests = await prisma.mentorshipRequest.findMany({
            where: { mentorId },
            include: { // Include mentee's name
                mentee: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Update the status of a request (accept/reject)
 * @route   PUT /api/requests/:id
 * @access  Private (Mentors only)
 */
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: RequestStatus };
    const mentorId = req.user!.userId;

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
    }

    try {
        const request = await prisma.mentorshipRequest.findUnique({ where: { id } });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // SECURITY CHECK: Ensure the user updating the request is the intended mentor
        if (request.mentorId !== mentorId) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to update this request' });
        }

        const updatedRequest = await prisma.mentorshipRequest.update({
            where: { id },
            data: { status },
        });

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};