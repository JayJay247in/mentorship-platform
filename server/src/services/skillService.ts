// src/services/skillService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches all skills from the database.
 */
export const getAllSkills = async () => {
  return await prisma.skill.findMany({
    orderBy: {
      name: 'asc', // Return skills in alphabetical order
    },
  });
};
