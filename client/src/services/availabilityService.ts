// client/src/services/availabilityService.ts
import api from './api';

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const fetchMyAvailability = async (): Promise<AvailabilitySlot[]> => {
  // We need the user's ID. Let's assume the /me endpoint can give it to us,
  // or we get it from our auth context. For now, let's create a dedicated endpoint.
  // **BACKEND CHANGE NEEDED**: Let's add GET /api/availability/me
  // For now, we'll assume it exists.
  const { data } = await api.get('/availability/me'); // We will add this backend route
  return data;
};

export const fetchMentorAvailability = async (
  mentorId: string
): Promise<AvailabilitySlot[]> => {
  const { data } = await api.get(`/availability/${mentorId}`);
  return data;
};

export const updateMyAvailability = async (slots: AvailabilitySlot[]) => {
  const { data } = await api.put('/availability/me', { slots });
  return data;
};
