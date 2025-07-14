// src/components/dashboard/MentorUpcomingSessions.tsx
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';

import { fetchSessionsAsMentor } from '../../services/sessionService';
import Spinner from '../Spinner';

const MentorUpcomingSessions = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', 'mentor'], // This uses the mentor's session query
    queryFn: fetchSessionsAsMentor,
  });

  const upcoming = sessions
    ?.filter((s) => new Date(s.scheduledTime) > new Date())
    .slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">
        Your Upcoming Sessions
      </h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="mt-4 space-y-3">
          {upcoming && upcoming.length > 0 ? (
            upcoming.map((session) => (
              <li key={session.id} className="p-3 bg-gray-50 rounded-md">
                <p className="font-semibold">With {session.mentee.name}</p>
                <p className="text-sm text-gray-600">
                  {format(
                    new Date(session.scheduledTime),
                    'eeee, MMM d @ h:mm a'
                  )}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">You have no upcoming sessions.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default MentorUpcomingSessions;
