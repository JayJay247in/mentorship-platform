// src/services/requestService.ts
import { PrismaClient, RequestStatus } from '@prisma/client';
import AppError from '../utils/AppError';
import { sendEmail } from './mailService';
import { emitNotification } from '../socket';
import { createNotification } from './notificationService';

const prisma = new PrismaClient();

// Service to create a new mentorship request
export const createRequest = async (menteeId: string, mentorId: string) => {
  if (!mentorId) {
    throw new AppError('Mentor ID is required', 400);
  }
  if (mentorId === menteeId) {
    throw new AppError('You cannot send a mentorship request to yourself', 400);
  }

  const mentor = await prisma.user.findUnique({ where: { id: mentorId } });
  if (!mentor || mentor.role !== 'MENTOR') {
    throw new AppError('Mentor not found or user is not a mentor', 404);
  }
  
  const mentee = await prisma.user.findUnique({ where: { id: menteeId } });
  if (!mentee) {
      throw new AppError('Mentee profile not found.', 404);
  }

  const existingRequest = await prisma.mentorshipRequest.findFirst({
    where: { menteeId, mentorId, status: 'PENDING' },
  });
  if (existingRequest) {
    throw new AppError('A pending request to this mentor already exists', 409);
  }

  const newRequest = await prisma.mentorshipRequest.create({
    data: { menteeId, mentorId },
  });

  // Send email notification
  await sendEmail({
    to: mentor.email,
    subject: 'You have a new mentorship request!',
    html: `<p>Hi ${mentor.name}, you have a new request from ${mentee.name}. Please log in to respond.</p>`,
  });

  // Send real-time notification
  emitNotification(mentor.id, {
    message: `You have a new mentorship request from ${mentee.name}.`,
    link: '/mentor/requests',
  });

  return newRequest;
};

// Service to get requests sent by a mentee
export const getSent = async (menteeId: string) => {
    // ... (This function is correct and doesn't need changes)
    return await prisma.mentorshipRequest.findMany({ where: { menteeId }, include: { mentor: { select: { id: true, name: true, bio: true } } }, orderBy: { createdAt: 'desc' } });
};

// Service to get requests received by a mentor
export const getReceived = async (mentorId: string) => {
    // ... (This function is correct and doesn't need changes)
    return await prisma.mentorshipRequest.findMany({ where: { mentorId }, include: { mentee: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
};

// Service to update the status of a request
export const updateStatus = async (
  requestId: string,
  mentorId: string,
  status: RequestStatus
) => {
  const updatedRequest = await prisma.mentorshipRequest.update({
    where: { id: requestId, mentorId: mentorId },
    data: { status },
    include: {
      mentee: { select: { name: true } },
      mentor: { select: { name: true } },
    },
  });

  // --- ADD NOTIFICATION LOGIC ---
  if (status === 'ACCEPTED') {
    await createNotification({
      userId: updatedRequest.menteeId,
      message: `Your request with ${updatedRequest.mentor.name} was accepted!`,
      link: `/my-requests`, // Link to the page where they can book a session
    });
  } else if (status === 'REJECTED') {
    await createNotification({
      userId: updatedRequest.menteeId,
      message: `Your request with ${updatedRequest.mentor.name} was declined.`,
      link: `/mentors`, // Suggest they find another mentor
    });
  }

  return updatedRequest;
};