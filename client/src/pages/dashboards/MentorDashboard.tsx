// src/pages/dashboards/MentorDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import MentorActionItems from '../../components/dashboard/MentorActionItems';
import MentorUpcomingSessions from '../../components/dashboard/MentorUpcomingSessions';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
// --- THIS IS THE FIX ---
// We ONLY import the function and type from our service file.
// All local declarations have been removed.
import {
  Conversation,
  fetchMyConversations,
} from '../../services/conversationService';

const ActiveChatsCard = () => {
  const { data: convos, isLoading } = useQuery<Conversation[]>({
    queryKey: ['myConversations'],
    queryFn: fetchMyConversations,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-brand-primary">Your Conversations</h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-4 max-h-60 overflow-y-auto">
          {convos && convos.length > 0 ? (
            <ul className="space-y-3">
              {convos.map((convo) => (
                <li key={convo.requestId}>
                  <Link
                    to={`/chat/${convo.requestId}`}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <img
                      src={
                        convo.participant.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          convo.participant.name
                        )}`
                      }
                      alt={convo.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-brand-text">
                      {convo.participant.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-text-light">No active conversations.</p>
          )}
        </div>
      )}
    </div>
  );
};

const MentorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display text-brand-primary">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-brand-text-light">
        Here's a summary of your mentorship activities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MentorActionItems />
        <MentorUpcomingSessions />
      </div>

      <div className="mt-6">
        <ActiveChatsCard />
      </div>
    </div>
  );
};

export default MentorDashboard;