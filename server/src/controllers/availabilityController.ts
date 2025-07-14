// src/controllers/availabilityController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as availabilityService from '../services/availabilityService';
import handleError from '../utils/errorHandler'; // Make sure to use the central handler

export const setMyAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = req.user!.userId;
    const { slots } = req.body; // Expects an array of { dayOfWeek, startTime, endTime }
    await availabilityService.setAvailability(mentorId, slots);
    res.status(200).json({ message: 'Availability updated successfully.' });
  } catch (error) {
    handleError(error, res);
  }
};

export const getMyAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = req.user!.userId;
    const availability = await availabilityService.getAvailability(mentorId);
    res.json(availability);
  } catch (error) {
    handleError(error, res);
  }
};

export const getMentorAvailability = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { mentorId } = req.params;

    // --- THIS IS THE FIX ---
    // Validate that the mentorId parameter exists before using it.
    if (!mentorId) {
      return res
        .status(400)
        .json({ message: 'Mentor ID parameter is required.' });
    }

    const availability = await availabilityService.getAvailability(mentorId);
    res.json(availability);
  } catch (error) {
    handleError(error, res);
  }
};
