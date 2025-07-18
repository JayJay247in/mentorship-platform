// client/src/components/NotificationBell.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect,useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSocket } from '../context/SocketContext'; // To listen for real-time updates
import { fetchNotifications, markNotificationAsRead } from '../services/notificationService';
import { Notification } from '../types';

// The bell icon SVG
const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    {hasUnread && <circle cx="18" cy="7" r="4" fill="red" className="animate-pulse" />}
  </svg>
);

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (updatedNotification) => {
        // Manually update the query cache to reflect the 'isRead' status instantly
        queryClient.setQueryData<Notification[]>(['notifications'], (oldData) =>
            oldData?.map((n) => (n.id === updatedNotification.id ? updatedNotification : n)) || []
        );
    },
  });
  
  // Listen for real-time notifications from the socket server
  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (newNotification: Notification) => {
      // Add the new notification to the top of the list in the query cache
      queryClient.setQueryData<Notification[]>(['notifications'], (oldData) =>
        [newNotification, ...(oldData || [])]
      );
    };
    socket.on('notification', handleNewNotification);
    return () => { socket.off('notification', handleNewNotification); };
  }, [socket, queryClient]);


  const unreadCount = useMemo(() => notifications?.filter((n) => !n.isRead).length || 0, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <BellIcon hasUnread={unreadCount > 0} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b">
            <h3 className="font-bold text-brand-primary">Notifications</h3>
          </div>
          <div className="py-1 max-h-96 overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link || '#'}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block px-4 py-3 text-sm hover:bg-gray-100 ${!notification.isRead ? 'font-bold' : 'font-normal'}`}
                >
                  <p className="text-gray-800">{notification.message}</p>
                  <p className={`mt-1 text-xs ${!notification.isRead ? 'text-blue-500' : 'text-gray-500'}`}>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </Link>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-gray-500">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;