// src/components/BookingModal.tsx
import { Dialog } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useMemo,useState } from 'react';

import { fetchMentorAvailability } from '../services/availabilityService';
import { fetchUserSessions } from '../services/sessionService'; // Corrected import
import { generateAvailableSlots } from '../utils/calendar';
import Spinner from './Spinner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  onBook: (slot: Date) => void;
  isBooking: boolean;
}

const BookingModal = ({
  isOpen,
  onClose,
  mentorId,
  onBook,
  isBooking,
}: BookingModalProps) => {
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  // Fetch both the mentor's availability and their existing sessions in parallel
  const { data, isLoading } = useQuery({
    queryKey: ['bookingData', mentorId],
    queryFn: async () => {
      // These two API calls will run in parallel
      const availability = await fetchMentorAvailability(mentorId);
      const bookedSessions = await fetchUserSessions(mentorId); // This is now a real API call
      return { availability, bookedSessions };
    },
    enabled: !!mentorId, // Only run the query if a mentorId is provided
  });

  // Use useMemo to prevent re-calculating slots on every render
  const availableSlots = useMemo(() => {
    if (!data) return [];
    return generateAvailableSlots(data.availability, data.bookedSessions);
  }, [data]);

  const handleBookClick = () => {
    if (selectedSlot) {
      onBook(selectedSlot);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6">
          <Dialog.Title className="text-xl font-bold">
            Book a Session
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Select an available time slot below. All times are in your local
            timezone.
          </Dialog.Description>

          <div className="mt-4 h-96 overflow-y-auto pr-2">
            {isLoading ? (
              <Spinner />
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded text-left transition-colors duration-200 ${
                      selectedSlot?.getTime() === slot.getTime()
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="font-semibold">
                      {format(slot, 'eeee, LLLL d')}
                    </p>
                    <p className="text-sm">{format(slot, 'h:mm a')}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-10">
                This mentor has no available slots in the next 30 days.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleBookClick}
              disabled={!selectedSlot || isBooking}
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
