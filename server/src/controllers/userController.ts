// src/controllers/userController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import handleError from '../utils/errorHandler';
import * as userService from '../services/userService'; // Import the new user service

const prisma = new PrismaClient();

// --- MODIFIED CONTROLLER ---
export const getMentors = async (req: AuthRequest, res: Response) => {
  try {
    // Extract search and filter criteria from query parameters
    const { search, skills } = req.query;

    // The 'where' clause for our Prisma query will be built dynamically
    const where: any = { role: 'MENTOR' };

    // 1. Add search condition if 'search' query exists
    if (search && typeof search === 'string') {
      where.name = {
        contains: search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    // 2. Add skills filter if 'skills' query exists
    if (skills && typeof skills === 'string') {
      const skillIds = skills.split(','); // Expecting a comma-separated list of IDs
      where.skills = {
        some: {
          skillId: {
            in: skillIds,
          },
        },
      };
    }

    const mentors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        bio: true,
        skills: {
          select: {
            skill: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(mentors);
  } catch (error) {
    handleError(error, res);
  }
};

// This one too
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id } /* ... select fields */,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(error, res);
  }
};

// --- REFACTORED CONTROLLER ---
// This controller now delegates all logic to the service.
export const updateCurrentUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        
        // The service now handles both updating AND fetching the final data.
        const finalUserProfile = await userService.updateUserProfile(userId, req.body);

        res.json(finalUserProfile);
    } catch (error) {
        handleError(error, res);
    }
};
