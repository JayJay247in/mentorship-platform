// src/services/messageService.ts
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/AppError';

const prisma = new PrismaClient();

// --- Payload for creating a message ---
interface CreateMessagePayload {
  content: string;
  senderId: string;
  receiverId: string;
  requestId: string;
}

// --- EXISTING FUNCTION ---

export const markMessagesAsRead = async (requestId: string, currentUserId: string) => {
  // Update all messages in this request where the current user is the receiver
  // and the message is currently unread.
  return await prisma.message.updateMany({
    where: {
      requestId: requestId,
      receiverId: currentUserId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const getMessagesForRequest = async (requestId: string, currentUserId: string) => {
  // --- THIS IS THE CHANGE ---
  // We now fetch the request and include the participants' details
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
    include: {
      mentor: { select: { id: true, name: true, avatarUrl: true } },
      mentee: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!request) {
    throw new AppError('Mentorship request not found', 404);
  }
  if (request.menteeId !== currentUserId && request.mentorId !== currentUserId) {
    throw new AppError('You are not authorized to view these messages', 403);
  }

  const messages = await prisma.message.findMany({
    where: { requestId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
  });
  
  // Return a combined object with messages AND participant info
  return { messages, participants: { mentor: request.mentor, mentee: request.mentee } };
};


// --- NEW FUNCTION ---
/**
 * Creates and saves a new message to the database.
 * @returns The newly created message object with sender details included.
 */
export const createMessage = async (payload: CreateMessagePayload) => {
  const { content, senderId, receiverId, requestId } = payload;
  
  // Basic validation
  if (!content || !senderId || !receiverId || !requestId) {
    throw new AppError('Missing data for creating a message', 400);
  }

  // Create the new message in the database
  const newMessage = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
      requestId,
    },
    // Include the sender's details in the returned object so we can emit it immediately
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  return newMessage;
};