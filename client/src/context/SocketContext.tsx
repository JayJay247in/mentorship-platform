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
  notifications: Notification[];
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const socketUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
let socket: Socket;

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      // Connect to the server if not already connected
      if (!socket) {
        socket = io(socketUrl);
      }

      // Register the user with the socket server
      socket.emit('register', user.id);

      // Set up the listener for new notifications
      socket.on('notification', (newNotification: Notification) => {
        setNotifications(prev => [newNotification, ...prev]);
        toast.info(newNotification.message); // Also show a toast!
      });

    }

    // Clean up on component unmount or user logout
    return () => {
      if (socket) {
        socket.off('notification');
        // You might choose to disconnect here if the user logs out
        // socket.disconnect();
      }
    };
  }, [user]);

  const clearNotifications = () => setNotifications([]);
  
  const value = { notifications, clearNotifications };

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