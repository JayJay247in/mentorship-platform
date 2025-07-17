// src/services/conversationService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getConversationsForUser = async (userId: string) => {
  const requests = await prisma.mentorshipRequest.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ menteeId: userId }, { mentorId: userId }],
    },
    include: {
      mentor: { select: { id: true, name: true, avatarUrl: true } },
      mentee: { select: { id: true, name: true, avatarUrl: true } },
      // --- THIS IS THE KEY CHANGE ---
      // For each request, count the messages that are unread AND sent to the current user
      _count: {
        select: {
          messages: {
            where: {
              receiverId: userId,
              isRead: false,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const conversations = requests.map(req => {
    const otherParticipant = req.mentorId === userId ? req.mentee : req.mentor;
    return {
      requestId: req.id,
      participant: otherParticipant,
      unreadCount: req._count.messages, // The unread count is now available here
    };
  });

  return conversations;
};