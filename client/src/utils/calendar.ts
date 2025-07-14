// src/utils/calendar.ts
import {
  addDays,
  addHours,
  getDay,
  isAfter,
  isBefore,
  startOfDay,
  startOfHour,
} from 'date-fns';

import { AvailabilitySlot } from '../services/availabilityService';

// Define a simpler type for what our API actually returns
interface BookedSessionTime {
  scheduledTime: string;
}

// Update the function to accept the new, correct type
export const generateAvailableSlots = (
  recurringAvailability: AvailabilitySlot[],
  bookedSessions: BookedSessionTime[] // <-- CORRECTED TYPE
): Date[] => {
  const availableSlots: Date[] = [];
  const now = new Date();

  // The logic inside the function remains the same, as it only uses scheduledTime
  const bookedTimes = new Set(
    bookedSessions.map((session) =>
      startOfHour(new Date(session.scheduledTime)).getTime()
    )
  );

  for (let i = 0; i < 30; i++) {
    const date = addDays(startOfDay(now), i);
    const dayOfWeek = getDay(date);

    const dayAvailability = recurringAvailability.filter(
      (slot) => slot.dayOfWeek === dayOfWeek
    );

    dayAvailability.forEach((slot) => {
      const [startHour] = slot.startTime.split(':').map(Number);
      const [endHour] = slot.endTime.split(':').map(Number);

      let currentSlotTime = addHours(date, startHour);
      const endSlotTime = addHours(date, endHour);

      while (isBefore(currentSlotTime, endSlotTime)) {
        if (
          isAfter(currentSlotTime, now) &&
          !bookedTimes.has(currentSlotTime.getTime())
        ) {
          availableSlots.push(currentSlotTime);
        }
        currentSlotTime = addHours(currentSlotTime, 1);
      }
    });
  }

  return availableSlots;
};
