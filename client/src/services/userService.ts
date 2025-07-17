// src/services/userService.ts
import { User } from '../types';
import api from './api';

// The payload now accepts all optional fields for updating
export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatarUrl?: string; // Add the new field
}

export const fetchMyProfile = async (): Promise<User> => {
  const { data } = await api.get('/auth/me');
  return data;
};

// This function can now update any part of the profile
export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const { data } = await api.put('/users/me/profile', payload);
  return data;
};