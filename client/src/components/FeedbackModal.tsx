// src/components/FeedbackModal.tsx
import { Dialog } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';

import { submitFeedback } from '../services/sessionService';

// Star rating component
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => setRating(star)}>
        <svg
          className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.454a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.04 9.399c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      </button>
    ))}
  </div>
);

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onSuccess: () => void;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  sessionId,
  onSuccess,
}: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      onSuccess(); // Call the parent's success handler
      onClose(); // Close the modal
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    mutation.mutate({ sessionId, rating, comment });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as="form"
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded bg-white p-6"
        >
          <Dialog.Title className="text-xl font-bold">
            Leave Feedback
          </Dialog.Title>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium">
                Comment (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-white bg-indigo-600 rounded disabled:bg-indigo-300"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FeedbackModal;
