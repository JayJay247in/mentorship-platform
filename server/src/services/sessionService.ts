// src/services/sessionService.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// A payload type for creating a session
interface ScheduleSessionPayload {
  requestId: string;
  menteeId: string;
  scheduledTime: string;
}

// A payload type for submitting feedback
interface SubmitFeedbackPayload {
  sessionId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export const scheduleSession = async (payload: ScheduleSessionPayload) => {
  const { requestId, menteeId, scheduledTime } = payload;
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new AppError('Mentorship request not found', 404);
  if (request.menteeId !== menteeId)
    throw new AppError(
      'Forbidden: You can only book sessions for your own requests',
      403
    );
  if (request.status !== 'ACCEPTED')
    throw new AppError(
      'Cannot book a session for a request that is not accepted',
      400
    );
  const existingSession = await prisma.session.findUnique({
    where: { requestId },
  });
  if (existingSession)
    throw new AppError(
      'A session has already been scheduled for this request',
      409
    );

  return await prisma.session.create({
    data: {
      requestId,
      menteeId: request.menteeId,
      mentorId: request.mentorId,
      scheduledTime: new Date(scheduledTime),
    },
  });
};

export const getSessionsAsMentee = async (menteeId: string) => {
  return await prisma.session.findMany({
    where: { menteeId },
    include: { mentor: { select: { id: true, name: true } } },
    orderBy: { scheduledTime: 'asc' },
  });
};

export const getSessionsAsMentor = async (mentorId: string) => {
  return await prisma.session.findMany({
    where: { mentorId },
    include: { mentee: { select: { id: true, name: true } } },
    orderBy: { scheduledTime: 'asc' },
  });
};

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  const { sessionId, userId, rating, comment } = payload;
  if (
    rating === undefined ||
    typeof rating !== 'number' ||
    rating < 1 ||
    rating > 5
  ) {
    throw new AppError('A rating between 1 and 5 is required', 400);
  }
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError('Session not found', 404);
  if (session.menteeId !== userId)
    throw new AppError(
      'Forbidden: You can only give feedback on your own sessions',
      403
    );
  if (new Date(session.scheduledTime) > new Date())
    throw new AppError(
      'Cannot give feedback for a session that has not yet occurred',
      400
    );

  const feedback = await prisma.feedback.upsert({
    where: { sessionId },
    update: { rating, comment },
    create: { sessionId, rating, comment, authorId: userId },
  });
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'COMPLETED' },
  });
  return feedback;
};

export const getSessionsByUserId = async (userId: string) => {
  if (!userId) {
    throw new AppError('User ID is required', 400);
  }
  return await prisma.session.findMany({
    where: {
      OR: [{ mentorId: userId }, { menteeId: userId }],
      status: 'UPCOMING',
    },
    select: { scheduledTime: true },
  });
};
