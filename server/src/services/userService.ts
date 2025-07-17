// src/services/userService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatarUrl?: string; // Add the new field
  skills?: string[];
}

export const updateUserProfile = async (userId: string, payload: UpdateProfilePayload) => {
  const { name, bio, skills, avatarUrl } = payload; // Destructure avatarUrl

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatarUrl, // Pass avatarUrl to the update data
      },
    });

    if (skills) {
      await tx.userSkill.deleteMany({ where: { userId: userId } });
      if (skills.length > 0) {
        await tx.userSkill.createMany({
          data: skills.map((skillId) => ({ userId, skillId })),
        });
      }
    }
  });
  
  // --- THIS IS THE KEY CHANGE ---
  // After the transaction is successful, fetch the full, final user profile
  // including the newly updated avatarUrl and skills.
  const finalUpdatedProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          role: true,
          avatarUrl: true, // Make sure to select the new field
          skills: { select: { skill: { select: { id: true, name: true } } } }
      }
  });

  return finalUpdatedProfile;
};