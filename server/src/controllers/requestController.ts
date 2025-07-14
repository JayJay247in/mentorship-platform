// src/controllers/requestController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as requestService from '../services/requestService';
import AppError from '../utils/AppError';

// A helper function to handle errors consistently
const handleError = (error: unknown, res: Response) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: 'An internal server error occurred' });
};

export const createMentorshipRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { mentorId } = req.body;
    const menteeId = req.user!.userId;
    const newRequest = await requestService.createRequest(menteeId, mentorId);
    res.status(201).json(newRequest);
  } catch (error) {
    handleError(error, res);
  }
};

export const getSentRequests = async (req: AuthRequest, res: Response) => {
  try {
    const menteeId = req.user!.userId;
    const requests = await requestService.getSent(menteeId);
    res.json(requests);
  } catch (error) {
    handleError(error, res);
  }
};

export const getReceivedRequests = async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = req.user!.userId;
    const requests = await requestService.getReceived(mentorId);
    res.json(requests);
  } catch (error) {
    handleError(error, res);
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const mentorId = req.user!.userId;
    if (!id) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }
    const updatedRequest = await requestService.updateStatus(
      id,
      mentorId,
      status
    );
    res.json(updatedRequest);
  } catch (error) {
    handleError(error, res);
  }
};
