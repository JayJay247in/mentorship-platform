// client/src/services/mentorService.ts

import { Mentor, PaginatedResponse } from '../types';
import api from './api';

// --- MODIFICATION: Add day to the interface ---
interface FetchMentorsParams {
  search?: string;
  skills?: string;
  day?: number | null; // <-- Add new parameter, can be null
  pageParam?: number;
}

/**
 * Fetches a paginated list of mentors with advanced filters.
 */
export const fetchMentors = async ({
  search = '',
  skills = '',
  day = null, // <-- Default to null
  pageParam = 1,
}: FetchMentorsParams): Promise<PaginatedResponse<Mentor>> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (skills) params.append('skills', skills);
  params.append('page', pageParam.toString());

  // --- MODIFICATION: Only append the dayOfWeek if it's a valid number ---
  if (day !== null && day >= 0) {
    params.append('dayOfWeek', day.toString());
  }

  const { data } = await api.get('/users/mentors', { params });
  return data;
};