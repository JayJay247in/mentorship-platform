// src/services/conversationService.ts
import { User } from '../types';
import api from './api';

export interface Conversation {
  requestId: string;
  participant: User;
  unreadCount: number;
}

export const fetchMyConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get('/conversations');
  return data;
};