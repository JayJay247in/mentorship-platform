// src/services/skillService.ts
import { Skill } from '../types';
import api from './api';

/**
 * Fetches the complete list of all skills available on the platform.
 */
export const fetchAllSkills = async (): Promise<Skill[]> => {
  const { data } = await api.get('/skills');
  return data;
};
