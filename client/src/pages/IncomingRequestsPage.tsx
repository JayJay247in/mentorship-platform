// src/pages/IncomingRequestsPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import {
  fetchReceivedRequests,
  updateRequestStatus,
} from '../services/requestService';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

const IncomingRequestsPage = () => {
  const queryClient = useQueryClient();

  const { data: allRequests, isLoading } = useQuery({
    queryKey: ['receivedRequests'],
    queryFn: fetchReceivedRequests,
  });

  const updateRequestMutation = useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedRequests'] });
      toast.success('Request status updated!');
    },
    onError: () => {
      toast.error('Failed to update request. Please try again.');
    },
  });

  const handleUpdateRequest = (
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    updateRequestMutation.mutate({ requestId, status });
  };

  if (isLoading) return <Spinner />;

  const pendingRequests = allRequests?.filter(
    (req) => req.status === 'PENDING'
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">
        Incoming Mentorship Requests
      </h1>
      <div className="bg-white shadow-md rounded-lg">
        {pendingRequests && pendingRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Request from: {request.mentee.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Received on: {formatDate(request.createdAt)}
                  </p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleUpdateRequest(request.id, 'ACCEPTED')}
                    disabled={updateRequestMutation.isPending}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(request.id, 'REJECTED')}
                    disabled={updateRequestMutation.isPending}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-600">You have no pending requests.</p>
        )}
      </div>
    </div>
  );
};

export default IncomingRequestsPage;
