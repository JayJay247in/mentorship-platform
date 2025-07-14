// src/components/NotificationBell.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useSocket } from '../context/SocketContext';

const NotificationBell = () => {
  const { notifications, clearNotifications } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isOpen) {
      // When opening, we can consider the notifications "read"
      // A more advanced version might track read/unread status individually
    }
    setIsOpen(!isOpen);
  };
  
  const handleClear = () => {
      clearNotifications();
      setIsOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative">
        <svg className="h-6 w-6 text-brand-text-light hover:text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="font-semibold">Notifications</h4>
            <button onClick={handleClear} className="text-sm text-brand-secondary hover:underline">Clear all</button>
          </div>
          <ul className="divide-y max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <li key={index}>
                  <Link to={notif.link || '#'} onClick={() => setIsOpen(false)} className="block p-4 hover:bg-gray-50">
                    <p className="text-sm text-gray-700">{notif.message}</p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-center text-gray-500">You have no new notifications.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;