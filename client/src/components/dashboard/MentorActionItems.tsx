// src/components/dashboard/MentorActionItems.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import { fetchReceivedRequests } from '../../services/requestService';
import Spinner from '../Spinner';

const MentorActionItems = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['receivedRequests'],
    queryFn: fetchReceivedRequests,
  });

  const pending = requests?.filter((r) => r.status === 'PENDING');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">Action Required</h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-4">
          {pending && pending.length > 0 ? (
            <div className="space-y-4">
              <p className="text-lg">
                You have{' '}
                <span className="font-bold text-indigo-600">
                  {pending.length}
                </span>{' '}
                new mentorship request(s) waiting for your review.
              </p>
              <Link
                to="/mentor/requests"
                className="inline-block px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Review Requests
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No pending action items. Great job!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MentorActionItems;
