// server/src/services/userService.ts

import { Prisma, PrismaClient, User } from '@prisma/client';
import { PaginatedResponse } from '../types/pagination';

const prisma = new PrismaClient();

// --- MODIFICATION 1: Update the interface to include the new availability filter ---
interface MentorQueryOptions {
  search?: string;
  skills?: string;
  dayOfWeek?: number; // 0 for Sunday, 1 for Monday, etc.
  page?: number;
  pageSize?: number;
}

/**
 * Finds mentors with ADVANCED filtering (full-text, skills, availability) and pagination.
 */
export const findMentors = async (
  options: MentorQueryOptions
): Promise<PaginatedResponse<User>> => {
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const skip = (page - 1) * pageSize;

  // --- MODIFICATION 2: We now build an array of WHERE conditions ---
  // This makes it easier to handle multiple complex, optional filters.
  const whereConditions: Prisma.Sql[] = [Prisma.sql`"role" = 'MENTOR'`];

  // Condition 1: Full-Text Search on name and bio
  if (options.search) {
    // Reformat the search string for postgres full-text search query syntax
    const searchTerm = options.search.trim().split(' ').join(' & ');
    // This condition uses PostgreSQL's full-text search vectors.
    // It searches for the formatted 'searchTerm' within a combined vector of the 'name' and 'bio' fields.
    // This is far more powerful than a simple 'contains' filter.
    whereConditions.push(
      Prisma.sql`to_tsvector('english', name || ' ' || bio) @@ to_tsquery('english', ${searchTerm})`
    );
  }

  // Condition 2: Filter by Skills
  if (options.skills) {
    const skillIds = options.skills.split(',');
    // We use a subquery to check if the user is associated with ANY of the provided skillIds.
    whereConditions.push(
      Prisma.sql`"id" IN (SELECT "userId" FROM "UserSkill" WHERE "skillId" IN (${Prisma.join(skillIds)}))`
    );
  }
  
  // Condition 3: Filter by Day of Availability
  if (options.dayOfWeek !== undefined && options.dayOfWeek >= 0 && options.dayOfWeek <=6) {
      // This condition checks if the user has AT LEAST ONE availability slot for the given day.
      whereConditions.push(
        Prisma.sql`"id" IN (SELECT "mentorId" FROM "Availability" WHERE "dayOfWeek" = ${options.dayOfWeek})`
      );
  }

  // Combine all conditions with 'AND'
  const whereClause = Prisma.sql`WHERE ${Prisma.join(whereConditions, ' AND ')}`;

  // --- MODIFICATION 3: Use $queryRaw for complex queries and $transaction for counting ---
  // We use $queryRaw because Prisma's high-level API doesn't support full-text search syntax directly.
  // A second raw query gets the total count using the same WHERE clause for accurate pagination.
  const [mentors, countResult] = await prisma.$transaction([
    prisma.$queryRaw<User[]>`
        SELECT id, name, bio, "avatarUrl"
        FROM "User"
        ${whereClause}
        ORDER BY name ASC
        LIMIT ${pageSize}
        OFFSET ${skip};
      `,
    prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) FROM "User" ${whereClause};`,
  ]);
  
  // Note: For production, fetching the skills for each mentor would require another query or a more complex JOIN.
  // For simplicity here, we are omitting the skills from the paginated result, but they can be fetched on the profile page.
  // The full user profile fetch logic remains unchanged.

  const totalItems = Number(countResult[0].count);

  return {
    data: mentors,
    totalItems,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  // New fields
  title?: string;
  company?: string;
  socialLinks?: any; // Prisma expects `any` or `JsonValue` for JSON fields
  skills?: string[];
}

/**
 * Updates a user's profile with new enriched data.
 */
export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfilePayload
) => {
  const { name, bio, avatarUrl, title, company, socialLinks, skills } = payload;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatarUrl,
        // Update new fields
        title,
        company,
        socialLinks: socialLinks || Prisma.JsonNull, // Use Prisma.JsonNull to correctly handle nulls
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

  // Fetch and return the complete, updated profile
  const finalUpdatedProfile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, bio: true, role: true, avatarUrl: true, createdAt: true,
      // Select the new fields
      title: true, company: true, socialLinks: true,
      skills: { select: { skill: { select: { id: true, name: true } } } },
    },
  });

  return finalUpdatedProfile;
};

/**
 * Finds a single user's public profile, now with enriched data.
 */
export const findUserProfileById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, bio: true, role: true, avatarUrl: true, createdAt: true,
      // --- Select the new fields ---
      title: true, company: true, socialLinks: true,
      skills: { select: { skill: { select: { id: true, name: true } } } },
    },
  });
  return user;
};