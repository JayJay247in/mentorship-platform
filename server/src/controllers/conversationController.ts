// src/controllers/conversationController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as conversationService from '../services/conversationService';
import handleError from '../utils/errorHandler';

export const getMyConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await conversationService.getConversationsForUser(req.user!.userId);
    res.json(conversations);
  } catch (error) {
    handleError(error, res);
  }
};