// src/controllers/sessionController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as sessionService from '../services/sessionService';
import handleError from '../utils/errorHandler';

export const scheduleSession = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, scheduledTime } = req.body;
    const menteeId = req.user!.userId;
    const newSession = await sessionService.scheduleSession({
      requestId,
      menteeId,
      scheduledTime,
    });
    res.status(201).json(newSession);
  } catch (error) {
    handleError(error, res);
  }
};

export const getSessionsAsMentee = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await sessionService.getSessionsAsMentee(req.user!.userId);
    res.json(sessions);
  } catch (error) {
    handleError(error, res);
  }
};

export const getSessionsAsMentor = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await sessionService.getSessionsAsMentor(req.user!.userId);
    res.json(sessions);
  } catch (error) {
    handleError(error, res);
  }
};

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!.userId;

    // --- THIS IS THE FIX ---
    // Validate that the sessionId parameter exists before using it.
    if (!sessionId) {
      return res
        .status(400)
        .json({ message: 'Session ID parameter is required.' });
    }

    const feedback = await sessionService.submitFeedback({
      sessionId,
      userId,
      rating,
      comment,
    });
    res.json(feedback);
  } catch (error) {
    handleError(error, res);
  }
};

export const getSessionsOfUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'User ID parameter is required.' });
    }

    const sessions = await sessionService.getSessionsByUserId(userId);
    res.json(sessions);
  } catch (error) {
    handleError(error, res);
  }
};
