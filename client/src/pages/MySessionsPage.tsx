// src/pages/MySessionsPage.tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import FeedbackModal from '../components/FeedbackModal';
import Spinner from '../components/Spinner';
import { fetchSessionsAsMentee } from '../services/sessionService';

const MySessionsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', 'mentee'],
    queryFn: fetchSessionsAsMentee,
  });

  const handleOpenModal = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const onFeedbackSuccess = () => {
    toast.success('Thank you for your feedback!');
    // Refetch the sessions data to update the UI (e.g., hide the button)
    queryClient.invalidateQueries({ queryKey: ['sessions', 'mentee'] });
  };

  const now = new Date();
  const upcomingSessions = sessions?.filter(
    (s) => new Date(s.scheduledTime) >= now
  );
  const pastSessions = sessions?.filter((s) => new Date(s.scheduledTime) < now);

  if (isLoading) return <Spinner />;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">My Sessions</h1>

      {/* Upcoming Sessions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-display">Upcoming</h2>
        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-4">
                <p className="font-semibold">With {session.mentor.name}</p>
                <p className="text-sm text-gray-600">
                  {format(
                    new Date(session.scheduledTime),
                    'eeee, MMM d @ h:mm a'
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </div>

      {/* Past Sessions Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-display">Past</h2>
        {pastSessions && pastSessions.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {pastSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">With {session.mentor.name}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.scheduledTime), 'eeee, MMM d')}
                  </p>
                </div>
                {session.status !== 'COMPLETED' ? ( // Check if feedback has been given
                  <button
                    onClick={() => handleOpenModal(session.id)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Leave Feedback
                  </button>
                ) : (
                  <span className="text-sm font-medium text-green-600">
                    Feedback Submitted
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No past sessions.</p>
        )}
      </div>

      {selectedSessionId && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sessionId={selectedSessionId}
          onSuccess={onFeedbackSuccess}
        />
      )}
    </>
  );
};

export default MySessionsPage;
