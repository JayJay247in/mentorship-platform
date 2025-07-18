// client/src/services/userService.ts

import { User } from '../types';
import api from './api';

/**
 * Fetches a user's public profile by their ID.
 * @param userId - The ID of the user to fetch.
 */
export const findUserProfileById = async (userId: string): Promise<User> => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

// Interface for the data payload when updating a profile.
interface UpdateUserPayload {
  userId: string;
  name?: string;
  bio?: string;
  title?: string;
  company?: string;
  socialLinks?: any;
  skills?: string[];
}

/**
 * Updates the current user's profile.
 * @param payload - An object containing the user's ID and the fields to update.
 */
export const updateUserProfile = async (payload: UpdateUserPayload): Promise<User> => {
  // We separate the userId from the rest of the data to be sent in the body
  const { userId, ...updateData } = payload;
  const { data } = await api.put(`/users/me/profile`, updateData);
  return data;
};