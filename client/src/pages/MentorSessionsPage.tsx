// src/pages/MentorSessionsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MentorSession } from '../types';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
};

const getStatusClasses = (status: MentorSession['status']) => {
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
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions/mentor');
        setSessions(response.data);
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (isLoading) return <div>Loading your sessions...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Sessions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <li key={session.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Session with: {session.mentee.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Scheduled for: {formatDate(session.scheduledTime)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(session.status)}`}>
                  {session.status}
                </span>
              </li>
            ))
          ) : (
            <p className="p-4 text-gray-600">You have no scheduled sessions.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MentorSessionsPage;