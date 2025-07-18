// server/src/controllers/userController.ts

import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import handleError from '../utils/errorHandler';
import * as userService from '../services/userService';

/**
 * @desc    Get mentors with optional filters and pagination
 * @route   GET /api/users/mentors
 * @access  Public
 */
export const getMentors = async (req: Request, res: Response) => {
  try {
    const { search, skills, dayOfWeek } = req.query; // <-- Destructure new parameter
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    
    // --- MODIFICATION: Safely parse dayOfWeek to a number ---
    const dayOfWeekNum = dayOfWeek !== undefined ? parseInt(dayOfWeek as string, 10) : undefined;

    if (isNaN(page) || isNaN(pageSize)) {
      return res.status(400).json({ message: 'Page and pageSize must be numbers.' });
    }
    // Optional: Add validation for dayOfWeekNum if it exists
    if(dayOfWeekNum !== undefined && (isNaN(dayOfWeekNum) || dayOfWeekNum < 0 || dayOfWeekNum > 6)) {
        return res.status(400).json({ message: 'Invalid dayOfWeek provided.'});
    }

    const paginatedMentors = await userService.findMentors({
      search: search as string | undefined,
      skills: skills as string | undefined,
      dayOfWeek: dayOfWeekNum, // <-- Pass the new parameter
      page,
      pageSize,
    });
    res.json(paginatedMentors);
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * @desc    Get a specific user's public profile
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userIdToView = req.params.id;
    if (!userIdToView) {
      return res.status(400).json({ message: 'User ID parameter is required.' });
    }
    const userProfile = await userService.findUserProfileById(userIdToView);

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userProfile);
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * @desc    Update the currently authenticated user's profile
 * @route   PUT /api/users/me/profile
 * @access  Private
 */
export const updateCurrentUserProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const finalUserProfile = await userService.updateUserProfile(userId, req.body);
    res.json(finalUserProfile);
  } catch (error) {
    handleError(error, res);
  }
};