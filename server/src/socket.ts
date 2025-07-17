// src/socket.ts
import { Server, Socket } from 'socket.io';
import * as messageService from './services/messageService'; // Import our new message service

const userSocketMap: Map<string, string> = new Map();

// --- Payload type for an incoming message from the client ---
interface IncomingMessagePayload {
  content: string;
  receiverId: string;
  requestId: string;
}

export const initSocketServer = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const currentUserId = socket.handshake.auth.userId;
    if (currentUserId) {
        console.log(`Registering user ${currentUserId} to socket ${socket.id}`);
        userSocketMap.set(currentUserId, socket.id);
    }
    
    socket.on('sendMessage', async (payload: IncomingMessagePayload, callback) => {
      const { content, receiverId, requestId } = payload;
      const senderId = currentUserId;

      if (!senderId) return callback?.({ error: 'User is not authenticated.' });

      try {
        const newMessage = await messageService.createMessage({
          content, senderId, receiverId, requestId,
        });

        const receiverSocketId = userSocketMap.get(receiverId);
        
        // --- THIS IS THE KEY CHANGE ---
        // Emit to the receiver if they are online
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        // ALSO emit the message back to the sender's socket
        // This confirms the message was saved and ensures the sender's UI updates.
        socket.emit('newMessage', newMessage);
        // --- END OF CHANGE ---

        // Acknowledgment for potential future use (like showing a "sent" checkmark)
        callback?.({ success: true });

      } catch (error: any) {
        console.error('Error handling message:', error);
        callback?.({ error: error.message || 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      if (currentUserId) {
        console.log(`User ${currentUserId} disconnected from socket ${socket.id}`);
        userSocketMap.delete(currentUserId);
      }
    });
  });
};

// --- Note: The global `emitNotification` function is separate from this direct messaging logic ---
// It can remain as is for system-wide notifications.
export const emitNotification = (userId: string, payload: any) => {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    const io = (global as any).io as Server;
    io.to(socketId).emit('notification', payload);
    console.log(`Emitted notification to user ${userId} on socket ${socketId}`);
  }
};