// src/controllers/adminController.ts
import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import { createNotification } from '../services/notificationService';

const prisma = new PrismaClient();

/**
 * @desc    Admin: Get a list of all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        // Exclude password from the result
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Admin: Update a user's role and notify them
 * @route   PUT /api/admin/users/:id/role
 * @access  Private (Admin only)
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body as { role: Role };

  if (!role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    // --- NOTIFY THE USER OF THE ROLE CHANGE ---
    await createNotification({
      userId: updatedUser.id, // The recipient is the user whose role was changed
      message: `An admin has updated your role to: ${role}.`,
      link: '/profile', // A neutral page they can land on
    });

    res.json(updatedUser);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Admin: Get all mentorship requests in the system
 * @route   GET /api/admin/requests
 * @access  Private (Admin only)
 */
export const getAllRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.mentorshipRequest.findMany({
      include: {
        mentor: { select: { id: true, name: true } },
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
 * @desc    Admin: Get all sessions in the system
 * @route   GET /api/admin/sessions
 * @access  Private (Admin only)
 */
export const getAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        mentor: { select: { id: true, name: true } },
        mentee: { select: { id: true, name: true } },
      },
      orderBy: { scheduledTime: 'desc' },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Admin: Manually create a match between a mentor and a mentee
 * @route   POST /api/admin/matches
 * @access  Private (Admin only)
 */
export const createManualMatch = async (req: AuthRequest, res: Response) => {
  const { mentorId, menteeId } = req.body;

  if (!mentorId || !menteeId) {
    return res
      .status(400)
      .json({ message: 'Mentor ID and Mentee ID are required' });
  }

  try {
    // This creates a mentorship request and immediately sets it to 'ACCEPTED'
    const newMatch = await prisma.mentorshipRequest.create({
      data: {
        mentorId,
        menteeId,
        status: 'ACCEPTED',
      },
    });
    res.status(201).json(newMatch);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: 'Failed to create manual match. Ensure user IDs are valid.',
      });
  }
};
