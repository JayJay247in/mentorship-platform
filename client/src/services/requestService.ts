// src/services/requestService.ts
import { ReceivedRequest,SentRequest } from '../types';
import api from './api';

// Types for mutation function arguments
interface CreateRequestPayload {
  mentorId: string;
}

interface UpdateRequestPayload {
  requestId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

// === QUERIES (for useQuery) ===
export const fetchSentRequests = async (): Promise<SentRequest[]> => {
  const { data } = await api.get('/requests/sent');
  return data;
};

export const fetchReceivedRequests = async (): Promise<ReceivedRequest[]> => {
  const { data } = await api.get('/requests/received');
  return data;
};

// === MUTATIONS (for useMutation) ===
export const createRequest = async (
  payload: CreateRequestPayload
): Promise<any> => {
  const { data } = await api.post('/requests', payload);
  return data;
};

export const updateRequestStatus = async (
  payload: UpdateRequestPayload
): Promise<any> => {
  const { data } = await api.put(`/requests/${payload.requestId}`, {
    status: payload.status,
  });
  return data;
};
