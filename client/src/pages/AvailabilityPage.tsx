// src/pages/AvailabilityPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import {
  AvailabilitySlot,
  fetchMyAvailability,
  updateMyAvailability,
} from '../services/availabilityService';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Define a type that includes a temporary client-side ID for list keys
type EditableSlot = AvailabilitySlot & { tempId: number };

const AvailabilityPage = () => {
  const queryClient = useQueryClient();
  
  // All hooks are now at the top level.
  // This state will hold all slots, both saved and newly added ones.
  const [editableSlots, setEditableSlots] = useState<EditableSlot[]>([]);

  const { data: initialAvailability, isLoading } = useQuery({
    queryKey: ['myAvailability'],
    queryFn: fetchMyAvailability,
  });

  const mutation = useMutation({
    mutationFn: updateMyAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAvailability'] });
      toast.success("Availability updated!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to update availability."),
  });

  // This useEffect will run ONCE when the initial data loads from the server.
  // It populates our editable state with the saved data.
  useEffect(() => {
    if (initialAvailability) {
      setEditableSlots(initialAvailability.map((slot, index) => ({ ...slot, tempId: index })));
    }
  }, [initialAvailability]);

  const handleAddTimeSlot = (dayIndex: number) => {
    const newSlot: EditableSlot = {
      dayOfWeek: dayIndex,
      startTime: '09:00',
      endTime: '10:00',
      tempId: Math.random(), // A random ID for the React key
    };
    setEditableSlots(prev => [...prev, newSlot]);
  };

  const handleRemoveSlot = (tempId: number) => {
    setEditableSlots(prev => prev.filter(slot => slot.tempId !== tempId));
  };

  const handleTimeChange = (tempId: number, field: 'startTime' | 'endTime', value: string) => {
    setEditableSlots(prev =>
      prev.map(slot =>
        slot.tempId === tempId ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSave = () => {
    // Before sending to the API, we remove the temporary client-side 'tempId'
    const slotsToSave = editableSlots.map(({ tempId, ...rest }) => rest);
    mutation.mutate(slotsToSave);
  };
  
  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Manage Your Availability</h1>
      <div className="space-y-6">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">{day}</h3>
            <div className="space-y-2">
              {editableSlots.filter(slot => slot.dayOfWeek === dayIndex).map((slot) => (
                <div key={slot.tempId} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={e => handleTimeChange(slot.tempId, 'startTime', e.target.value)}
                    className="p-1 border rounded-md"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={e => handleTimeChange(slot.tempId, 'endTime', e.target.value)}
                    className="p-1 border rounded-md"
                  />
                  <button onClick={() => handleRemoveSlot(slot.tempId)} className="text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleAddTimeSlot(dayIndex)}
              className="mt-4 text-sm font-semibold text-brand-accent hover:underline"
            >
              + Add Time Slot
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={mutation.isPending}
        className="mt-6 px-6 py-2 font-semibold text-white bg-brand-accent rounded-md hover:opacity-90 disabled:bg-opacity-50"
      >
        {mutation.isPending ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AvailabilityPage;