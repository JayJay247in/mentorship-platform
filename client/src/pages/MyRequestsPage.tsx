// src/pages/MyRequestsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SentRequest } from '../types';

// A helper function to format the date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusClasses = (status: SentRequest['status']) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MyRequestsPage = () => {
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/sent');
        setRequests(response.data);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (isLoading) return <div>Loading your requests...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Mentorship Requests</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {requests.length > 0 ? (
            requests.map((request) => (
              <li key={request.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Request to: {request.mentor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sent on: {formatDate(request.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                  {request.status}
                </span>
              </li>
            ))
          ) : (
            <p className="p-4 text-gray-600">You have not sent any requests yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyRequestsPage;