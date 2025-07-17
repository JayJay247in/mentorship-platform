// src/context/SocketContext.tsx
import React, { createContext, ReactNode,useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';

import { useAuth } from './AuthContext';

interface Notification {
  message: string;
  link?: string;
}

interface SocketContextType {
  socket: Socket | null; // Expose the socket instance
  notifications: Notification[];
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Define socket outside the component to prevent re-creation on re-renders
let socket: Socket | null = null;
const socketUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Connect only if we have a user and no existing socket connection
    if (user && !socket) {
      // --- THIS IS THE CHANGE ---
      // Pass the user's ID in the 'auth' option upon connection
      socket = io(socketUrl, {
        auth: {
          userId: user.id,
        },
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket?.id);
      });

      // Set up the listener for new notifications
      socket.on('notification', (newNotification: Notification) => {
        setNotifications(prev => [newNotification, ...prev]);
        toast.info(newNotification.message);
      });

    } else if (!user && socket) {
      // If the user logs out, disconnect the socket
      socket.disconnect();
      socket = null;
    }

    // Clean up on component unmount
    return () => {
      // We don't want to disconnect on every re-render, only on logout,
      // which is handled by the condition above.
      // So the main cleanup is just removing the listener.
      socket?.off('notification');
    };
  }, [user]);

  const clearNotifications = () => setNotifications([]);
  
  const value = { socket, notifications, clearNotifications };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};