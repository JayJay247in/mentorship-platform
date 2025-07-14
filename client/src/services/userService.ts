// src/services/userService.ts
import { User } from '../types';
import api from './api';

// The payload for the update mutation
export interface UpdateProfilePayload {
  name: string;
  bio?: string;
}

// Fetches the profile of the currently logged-in user
export const fetchMyProfile = async (): Promise<User> => {
  const { data } = await api.get('/auth/me'); // We can reuse the /me endpoint
  return data;
};

// Updates the profile of the currently logged-in user
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<User> => {
  const { data } = await api.put('/users/me/profile', payload);
  return data;
};
