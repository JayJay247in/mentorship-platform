// src/pages/AvailabilityPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect,useState } from 'react';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import {
  AvailabilitySlot,
  fetchMyAvailability,
  updateMyAvailability,
} from '../services/availabilityService';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const AvailabilityPage = () => {
  const queryClient = useQueryClient();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  const { data: initialAvailability, isLoading } = useQuery({
    queryKey: ['myAvailability'],
    queryFn: fetchMyAvailability,
  });

  useEffect(() => {
    if (initialAvailability) {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability]);

  const mutation = useMutation({
    mutationFn: updateMyAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAvailability'] });
      toast.success('Availability updated!');
    },
    onError: () => toast.error('Failed to update availability.'),
  });

  const handleAddTimeSlot = (day: number) => {
    setAvailability([
      ...availability,
      { dayOfWeek: day, startTime: '09:00', endTime: '10:00' },
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleTimeChange = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = () => {
    mutation.mutate(availability);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">
        Manage Your Availability
      </h1>
      <div className="space-y-6">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">{day}</h3>
            <div className="mt-2 space-y-2">
              {availability
                .filter((slot) => slot.dayOfWeek === dayIndex)
                .map((slot) => {
                  const originalIndex = availability.findIndex(
                    (s) => s === slot
                  );
                  return (
                    <div
                      key={originalIndex}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleTimeChange(
                            originalIndex,
                            'startTime',
                            e.target.value
                          )
                        }
                        className="p-1 border rounded-md"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleTimeChange(
                            originalIndex,
                            'endTime',
                            e.target.value
                          )
                        }
                        className="p-1 border rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveTimeSlot(originalIndex)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => handleAddTimeSlot(dayIndex)}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + Add Time Slot
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={mutation.isPending}
        className="mt-6 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {mutation.isPending ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
};

export default AvailabilityPage;
