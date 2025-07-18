// server/src/controllers/dashboardController.ts

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as dashboardService from '../services/dashboardService';
import handleError from '../utils/errorHandler';
import { Role } from '@prisma/client'; // <-- Import the Role enum

/**
 * Fetches dashboard data based on the authenticated user's role.
 */
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    
    // --- THIS IS THE FIX ---
    // We cast the `userRole` (string) to the `Role` enum type.
    // This assures TypeScript that the value is one of the allowed enum values.
    const dashboardData = await dashboardService.getDashboardData(userId, userRole as Role);
    res.json(dashboardData);
  } catch (error) {
    handleError(error, res);
  }
};