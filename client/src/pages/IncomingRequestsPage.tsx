// src/pages/IncomingRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ReceivedRequest } from '../types';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const IncomingRequestsPage = () => {
  const [requests, setRequests] = useState<ReceivedRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests/received');
      // We only want to show pending requests on this page
      setRequests(response.data.filter((req: ReceivedRequest) => req.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.put(`/requests/${requestId}`, { status });
      // Remove the request from the list for immediate UI feedback
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
      alert(`Request has been ${status.toLowerCase()}.`);
    } catch (err) {
      alert('Failed to update the request. Please try again.');
    }
  };

  if (isLoading) return <div>Loading incoming requests...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Incoming Mentorship Requests</h1>
      <div className="bg-white shadow-md rounded-lg">
        {requests.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(request.id, 'REJECTED')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
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