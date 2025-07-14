// src/services/userService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  skills?: string[];
}

// This service handles updating a user's profile
export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
  const { name, bio, skills } = payload;

  // Use a transaction to ensure all updates succeed or none do.
  return await prisma.$transaction(async (tx) => {
    // 1. Update the basic user info if provided
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        name, // If name is undefined, Prisma just ignores it
        bio, // Same for bio
      },
    });

    // 2. Handle skills update only if the skills array is provided
    if (skills) {
      // First, remove all existing skills for this user
      await tx.userSkill.deleteMany({
        where: { userId: userId },
      });

      // Then, add the new skills if the array is not empty
      if (skills.length > 0) {
        await tx.userSkill.createMany({
          data: skills.map((skillId: string) => ({
            userId: userId,
            skillId: skillId,
          })),
        });
      }
    }

    // Return the updated user's core info
    return updatedUser;
  });
};
