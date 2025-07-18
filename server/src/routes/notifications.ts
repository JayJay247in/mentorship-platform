// server/src/routes/notifications.ts

import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getMyNotifications,
  markAsRead,
} from '../controllers/notificationController';

const router = Router();

router.use(protect); // All notification routes are protected

// Route to get all of the current user's notifications
router.get('/', getMyNotifications);

// Route to mark a specific notification as read
router.patch('/:notificationId/read', markAsRead);

export default router;