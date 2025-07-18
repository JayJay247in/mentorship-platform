// server/src/controllers/notificationController.ts

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as notificationService from '../services/notificationService';
import handleError from '../utils/errorHandler';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notifications = await notificationService.getNotificationsForUser(userId);
    res.json(notifications);
  } catch (error) {
    handleError(error, res);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user!.userId;

    // --- THIS IS THE FIX ---
    // Add a check to ensure notificationId is not undefined before calling the service.
    if (!notificationId) {
        return res.status(400).json({ message: "Notification ID is required." });
    }

    const updatedNotification = await notificationService.markNotificationAsRead(
      notificationId,
      userId
    );
    res.json(updatedNotification);
  } catch (error) {
    handleError(error, res);
  }
};