// src/services/availabilityService.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// This service replaces the mentor's entire availability schedule.
export const setAvailability = async (
  mentorId: string,
  slots: AvailabilitySlot[]
) => {
  // Validate slots to prevent errors
  for (const slot of slots) {
    if (slot.startTime >= slot.endTime) {
      throw new AppError('Start time must be before end time.', 400);
    }
  }

  // Use a transaction to ensure this is an all-or-nothing operation
  return await prisma.$transaction(async (tx) => {
    // 1. Delete all old availability for this mentor
    await tx.availability.deleteMany({
      where: { mentorId },
    });

    // 2. Create the new availability slots
    const newAvailability = await tx.availability.createMany({
      data: slots.map((slot) => ({ ...slot, mentorId })),
    });

    return newAvailability;
  });
};

// This service gets the availability for a specific mentor
export const getAvailability = async (mentorId: string) => {
  return await prisma.availability.findMany({
    where: { mentorId },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
};
