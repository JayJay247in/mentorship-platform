// src/services/availabilityService.ts
import api from './api';

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// Fetches the logged-in mentor's availability
export const fetchMyAvailability = async (): Promise<AvailabilitySlot[]> => {
  const { data } = await api.get('/availability/me');
  return data;
};

// Fetches a specific mentor's availability
export const fetchMentorAvailability = async (mentorId: string): Promise<AvailabilitySlot[]> => {
    const { data } = await api.get(`/availability/${mentorId}`);
    return data;
};

// This function takes the array of slots and sends it in the request body
export const updateMyAvailability = async (slots: AvailabilitySlot[]) => {
  // The backend expects the data under a 'slots' key in the body
  const { data } = await api.put('/availability/me', { slots });
  return data;
};