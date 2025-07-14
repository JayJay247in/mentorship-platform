// src/pages/MentorSessionsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';

import Spinner from '../components/Spinner';
import { fetchSessionsAsMentor } from '../services/sessionService';
import { Session } from '../types'; // <-- CORRECTED IMPORT

const getStatusClasses = (status: Session['status']) => {
  switch (status) {
    case 'UPCOMING':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-gray-200 text-gray-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MentorSessionsPage = () => {
  const { data: sessions, isLoading } = useQuery<Session[]>({ // Use the correct type
    queryKey: ['sessions', 'mentor'],
    queryFn: fetchSessionsAsMentor,
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary mb-6">My Sessions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-brand-text">
                    Session with: {session.mentee.name}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    Scheduled for: {format(new Date(session.scheduledTime), 'eeee, MMM d @ h:mm a')}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(session.status)}`}>
                  {session.status}
                </span>
              </li>
            ))
          ) : (
            <p className="p-4 text-brand-text-light">You have no scheduled sessions.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MentorSessionsPage;