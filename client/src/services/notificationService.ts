// client/src/services/notificationService.ts

import { Notification } from '../types'; // Make sure you have a Notification type defined
import api from './api';

/**
 * Fetches all notifications for the current user.
 */
export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/notifications');
  return data;
};

/**
 * Marks a specific notification as read.
 * @param notificationId - The ID of the notification to update.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return data;
};