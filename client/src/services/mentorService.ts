// src/services/mentorService.ts
import { Mentor } from '../types';
import api from './api';

interface FetchMentorsParams {
  search?: string;
  skills?: string; // Comma-separated IDs
}

export const fetchMentors = async (
  params: FetchMentorsParams = {}
): Promise<Mentor[]> => {
  // Use URLSearchParams to safely build the query string
  const queryParams = new URLSearchParams();
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.skills) {
    queryParams.append('skills', params.skills);
  }

  const { data } = await api.get(`/users/mentors?${queryParams.toString()}`);
  return data;
};
