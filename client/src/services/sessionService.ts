// src/services/sessionService.ts
import { Session } from '../types'; // <-- CORRECTED IMPORT
import api from './api';

interface BookedSessionTime {
  scheduledTime: string;
}

interface SubmitFeedbackPayload {
  sessionId: string;
  rating: number;
  comment?: string;
}

export const fetchSessionsAsMentee = async (): Promise<Session[]> => { // Use the correct type
  const { data } = await api.get('/sessions/mentee');
  return data;
};

export const fetchSessionsAsMentor = async (): Promise<Session[]> => { // Use the correct type
  const { data } = await api.get('/sessions/mentor');
  return data;
};

export const scheduleSession = async (payload: { requestId: string; scheduledTime: string }) => {
  const { data } = await api.post('/sessions', payload);
  return data;
};

export const fetchUserSessions = async (userId: string): Promise<BookedSessionTime[]> => {
  const { data } = await api.get(`/sessions/of-user/${userId}`);
  return data;
};

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  const { sessionId, rating, comment } = payload;
  const { data } = await api.put(`/sessions/${sessionId}/feedback`, { rating, comment });
  return data;
};