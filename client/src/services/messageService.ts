// src/services/messageService.ts
import api from './api';
import { ChatData, Message } from '../types';

export const fetchMessages = async (requestId: string): Promise<ChatData> => {
  const { data } = await api.get(`/messages/${requestId}`);
  return data;
};

// --- THIS IS THE NEW FUNCTION ---
/**
 * Notifies the backend that all messages in a conversation have been read by the current user.
 * @param requestId The ID of the conversation/request.
 * @param userId The ID of the user who is reading the messages.
 */
export const markMessagesAsRead = async (requestId: string, userId: string) => {
  // The backend already knows who the user is via the JWT, but sending the ID
  // can be useful for clarity or more complex logic in the future.
  const { data } = await api.put(`/messages/read/${requestId}`);
  return data;
};