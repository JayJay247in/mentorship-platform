// client/src/pages/MySessionsPage.tsx

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import FeedbackModal from '../components/FeedbackModal';
import Spinner from '../components/Spinner';
import { useCalendar } from '../hooks/useCalendar'; // <-- Add this import
import { fetchSessionsAsMentee } from '../services/sessionService';
import { Session } from '../types';

const MySessionsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // --- MODIFICATION: Initialize the custom hook ---
  const { generateCalendarInvite } = useCalendar();

  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions', 'mentee'],
    queryFn: fetchSessionsAsMentee,
  });

  const handleOpenModal = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const onFeedbackSuccess = () => {
    toast.success('Thank you for your feedback!');
    queryClient.invalidateQueries({ queryKey: ['sessions', 'mentee'] });
  };

  const now = new Date();
  const upcomingSessions = sessions?.filter((s) => new Date(s.scheduledTime) >= now).sort((a,b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  const pastSessions = sessions?.filter((s) => new Date(s.scheduledTime) < now).sort((a,b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

  if (isLoading) return <Spinner />;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">My Sessions</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-display">Upcoming</h2>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <p className="font-semibold">With {session.mentor.name}</p>
                  <p className="text-sm text-gray-600">{format(new Date(session.scheduledTime), 'eeee, MMM d @ h:mm a')}</p>
                </div>
                {/* --- MODIFICATION: Add the calendar button --- */}
                <button
                    onClick={() => generateCalendarInvite(session)}
                    className="mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                    Add to Calendar
                </button>
              </div>
            ))}
          </div>
        ) : ( <p>No upcoming sessions.</p> )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-display">Past</h2>
        {pastSessions && pastSessions.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {pastSessions.map((session) => (
              <div key={session.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">With {session.mentor.name}</p>
                  <p className="text-sm text-gray-600">{format(new Date(session.scheduledTime), 'eeee, MMM d')}</p>
                </div>
                {/* --- Logic for feedback remains unchanged --- */}
                {!session.feedback ? (
                  <button onClick={() => handleOpenModal(session.id)} className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    Leave Feedback
                  </button>
                ) : (
                  <span className="text-sm font-medium text-green-600">Feedback Submitted</span>
                )}
              </div>
            ))}
          </div>
        ) : ( <p>No past sessions.</p> )}
      </div>

      {selectedSessionId && <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sessionId={selectedSessionId} onSuccess={onFeedbackSuccess}/>}
    </>
  );
};

export default MySessionsPage;