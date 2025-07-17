// src/pages/MyRequestsPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- FIX 1: Import Link
import { toast } from 'react-toastify';

import BookingModal from '../components/BookingModal';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { fetchSentRequests } from '../services/requestService';
import { scheduleSession } from '../services/sessionService';
import { SentRequest } from '../types';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
  const queryClient = useQueryClient();
  const {
    data: requests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sentRequests'],
    queryFn: fetchSentRequests,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    mentorId: string;
  } | null>(null);

  const scheduleSessionMutation = useMutation({
    mutationFn: scheduleSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'mentee'] });
      toast.success('Session booked successfully!');
      setIsModalOpen(false);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || 'Failed to book session.'),
  });

  const handleOpenModal = (requestId: string, mentorId: string) => {
    setSelectedRequest({ id: requestId, mentorId });
    setIsModalOpen(true);
  };

  const handleBookSession = (slot: Date) => {
    if (selectedRequest) {
      scheduleSessionMutation.mutate({
        requestId: selectedRequest.id,
        scheduledTime: slot.toISOString(),
      });
    }
  };

  if (isLoading) return <Spinner />;
  if (isError)
    return <div className="text-red-500">Failed to load your requests.</div>;

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">
        My Mentorship Requests
      </h1>

      {/* --- FIX 3: Conditional Rendering Logic --- */}
      {/* Show the list only if there are requests, otherwise show the empty state. */}
      {requests && requests.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              // The entire content for one request is now inside this single <li>
              <li
                key={request.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-brand-text">
                    Request to: {request.mentor.name}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    Sent on: {formatDate(request.createdAt)}
                  </p>
                </div>

                {/* --- FIX 2: Group all action buttons together --- */}
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                  {request.status === 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => handleOpenModal(request.id, request.mentor.id)}
                        className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Book Session
                      </button>
                      <Link
                        to={`/chat/${request.id}`}
                        className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
                      >
                        Chat
                      </Link>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          title="No requests sent yet"
          message="You haven't requested mentorship from anyone. Start by finding a mentor!"
          actionText="Find a Mentor"
          actionLink="/mentors"
        />
      )}

      {selectedRequest && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mentorId={selectedRequest.mentorId}
          onBook={handleBookSession}
          isBooking={scheduleSessionMutation.isPending}
        />
      )}
    </>
  );
};

export default MyRequestsPage;