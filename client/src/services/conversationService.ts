// src/services/conversationService.ts
import api from './api';
import { User } from '../types';

export interface Conversation {
  requestId: string;
  participant: User;
  unreadCount: number;
}

export const fetchMyConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get('/conversations');
  return data;
};