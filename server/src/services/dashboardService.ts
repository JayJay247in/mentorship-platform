// server/src/services/dashboardService.ts

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches dashboard data tailored to the user's role.
 * @param userId The ID of the authenticated user.
 * @param role The role of the authenticated user.
 */
export const getDashboardData = async (userId: string, role: Role) => {
  // --- MENTEE DASHBOARD DATA ---
  if (role === 'MENTEE') {
    // We run multiple queries in parallel for efficiency
    const [upcomingSession, recentMessages, suggestedMentors] =
      await prisma.$transaction([
        // 1. Get the very next upcoming session
        prisma.session.findFirst({
          where: {
            menteeId: userId,
            status: 'UPCOMING',
            scheduledTime: { gte: new Date() },
          },
          orderBy: { scheduledTime: 'asc' },
          include: { mentor: { select: { id: true, name: true } } },
        }),
        // 2. Get the 3 most recent conversations
        prisma.message.findMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
          orderBy: { createdAt: 'desc' },
          distinct: ['requestId'],
          take: 3,
          include: {
            request: {
                select: {
                    mentor: { select: { id: true, name: true, avatarUrl: true } },
                    mentee: { select: { id: true, name: true, avatarUrl: true } },
                }
            }
          },
        }),
        // 3. Suggest 3 random mentors the mentee hasn't interacted with
        prisma.user.findMany({
          where: {
            role: 'MENTOR',
            // Exclude mentors the user has already sent a request to
            requestsReceived: {
                none: { menteeId: userId },
            },
          },
          take: 3,
          select: { id: true, name: true, bio: true, avatarUrl: true, skills: { select: { skill: { select: { name: true }}}}}
        }),
      ]);
    return { upcomingSession, recentMessages, suggestedMentors };
  }

  // --- MENTOR DASHBOARD DATA ---
  if (role === 'MENTOR') {
    // Run queries in parallel
    const [
      pendingRequestsCount,
      upcomingSessions,
      completedSessionsCount,
      newestRequest,
    ] = await prisma.$transaction([
      // 1. Count pending requests
      prisma.mentorshipRequest.count({
        where: { mentorId: userId, status: 'PENDING' },
      }),
      // 2. Get the next 3 upcoming sessions
      prisma.session.findMany({
        where: {
          mentorId: userId,
          status: 'UPCOMING',
          scheduledTime: { gte: new Date() },
        },
        orderBy: { scheduledTime: 'asc' },
        take: 3,
        include: { mentee: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      // 3. Count total completed sessions
      prisma.session.count({
        where: { mentorId: userId, status: 'COMPLETED' },
      }),
      // 4. Get the most recent pending request for a quick link
      prisma.mentorshipRequest.findFirst({
        where: { mentorId: userId, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        include: { mentee: { select: { name: true } } },
      }),
    ]);
    return {
      pendingRequestsCount,
      upcomingSessions,
      completedSessionsCount,
      newestRequest,
    };
  }

  // Admin or other roles can have a simple return object
  return { message: "Welcome, Admin! Full dashboard analytics coming soon." };
};