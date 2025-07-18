// server/src/services/notificationService.ts

import { PrismaClient } from '@prisma/client';
import { emitNotification } from '../socket'; // Import the socket emitter you already have

const prisma = new PrismaClient();

interface NotificationPayload {
  userId: string;
  message: string;
  link?: string;
}

/**
 * Creates a persistent notification and emits a real-time event.
 * This is the central function for all user notifications.
 * @param payload - The data for the notification.
 */
export const createNotification = async (payload: NotificationPayload) => {
  const { userId, message, link } = payload;

  // Step 1: Save the notification to the database
  const newNotification = await prisma.notification.create({
    data: {
      userId,
      message,
      link,
    },
  });

  // Step 2: Emit the real-time event to the user if they are online.
  // We pass the full notification object so the frontend gets all the info.
  emitNotification(userId, newNotification);

  return newNotification;
};

/**
 * Fetches all notifications for a specific user.
 * @param userId - The ID of the user.
 */
export const getNotificationsForUser = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit to the most recent 50 to avoid huge payloads
  });
  return notifications;
};

/**
 * Marks a single notification as read.
 * @param notificationId - The ID of the notification.
 * @param userId - The ID of the user, for security, to ensure they own the notification.
 */
export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.update({
    where: {
      id: notificationId,
      userId: userId, // Ensure a user can only mark their own notification as read
    },
    data: { isRead: true },
  });
  return notification;
};