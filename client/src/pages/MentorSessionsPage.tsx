// client/src/pages/MentorSessionsPage.tsx

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';

import Spinner from '../components/Spinner';
import { useCalendar } from '../hooks/useCalendar'; // <-- Add this import
import { fetchSessionsAsMentor } from '../services/sessionService';
import { Session } from '../types';

const getStatusClasses = (status: Session['status']) => {
    // ... (this function remains the same)
};

const MentorSessionsPage = () => {
  // --- MODIFICATION: Initialize the custom hook ---
  const { generateCalendarInvite } = useCalendar();
  
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions', 'mentor'],
    queryFn: fetchSessionsAsMentor,
  });

  // Sort sessions to show upcoming ones first
  const sortedSessions = sessions?.sort((a, b) => 
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary mb-6">My Sessions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sortedSessions && sortedSessions.length > 0 ? (
            sortedSessions.map((session) => (
              <li key={session.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <p className="text-lg font-semibold text-brand-text">Session with: {session.mentee.name}</p>
                  <p className="text-sm text-brand-text-light">
                    {format(new Date(session.scheduledTime), 'eeee, MMM d @ h:mm a')}
                  </p>
                </div>
                {/* --- MODIFICATION: Add the calendar button for upcoming sessions --- */}
                {session.status === 'UPCOMING' && (
                    <button
                      onClick={() => generateCalendarInvite(session)}
                      className="mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                      Add to Calendar
                    </button>
                )}
                {session.status !== 'UPCOMING' && (
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(session.status)}`}>
                    {session.status}
                  </span>
                )}
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