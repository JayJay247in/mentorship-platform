// src/components/dashboard/PendingRequestsCard.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { fetchSentRequests } from '../../services/requestService';
import Spinner from '../Spinner';

const PendingRequestsCard = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['sentRequests'],
    queryFn: fetchSentRequests,
  });

  const pending = requests?.filter((r) => r.status === 'PENDING');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">Pending Requests</h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-4">
          {pending && pending.length > 0 ? (
            <p>You have {pending.length} request(s) waiting for a response.</p>
          ) : (
            <p className="text-gray-500">You have no pending requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PendingRequestsCard;
