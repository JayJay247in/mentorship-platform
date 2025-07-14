// src/socket.ts
import { Server, Socket } from 'socket.io';

// This will keep track of which user ID belongs to which socket ID
const userSocketMap: Map<string, string> = new Map();

export const initSocketServer = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    // When a user connects, they should send an event to register their user ID
    socket.on('register', (userId: string) => {
      console.log(`Registering user ${userId} to socket ${socket.id}`);
      userSocketMap.set(userId, socket.id);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Clean up the map on disconnect
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

// This is a helper function we can call from our services
export const emitNotification = (userId: string, payload: any) => {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    const io = (global as any).io as Server; // A way to access the io instance globally
    io.to(socketId).emit('notification', payload);
    console.log(`Emitted notification to user ${userId} on socket ${socketId}`);
  } else {
    console.log(`User ${userId} not connected, notification not sent.`);
  }
};