// src/controllers/messageController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as messageService from '../services/messageService';
import handleError from '../utils/errorHandler';

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }
    const messages = await messageService.getMessagesForRequest(requestId, req.user!.userId);
    res.json(messages);
  } catch (error) {
    handleError(error, res);
  }
};

// --- NEW CONTROLLER FUNCTION ---
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    if (!requestId) {
        return res.status(400).json({ message: 'Request ID is required' });
    }
    // The service will handle the logic of updating messages for the current user
    await messageService.markMessagesAsRead(requestId, req.user!.userId);
    res.status(200).json({ message: 'Messages marked as read.' });
  } catch (error) {
    handleError(error, res);
  }
};