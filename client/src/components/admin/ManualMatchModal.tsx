// client/src/components/admin/ManualMatchModal.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { createManualMatch, fetchAllUsers } from '../../services/adminService';
import { AdminUser } from '../../types';

interface ManualMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualMatchModal = ({ isOpen, onClose }: ManualMatchModalProps) => {
  const queryClient = useQueryClient();
  const [selectedMentor, setSelectedMentor] = useState<{ value: string; label: string } | null>(null);
  const [selectedMentee, setSelectedMentee] = useState<{ value: string; label: string } | null>(null);

  // We can reuse the user query to populate our dropdowns
  const { data: users, isLoading: isLoadingUsers } = useQuery<AdminUser[]>({
    queryKey: ['adminUsers'], // Use the same key to leverage caching
    queryFn: fetchAllUsers,
    enabled: isOpen, // Only fetch the data when the modal is open
  });

  const { mentorOptions, menteeOptions } = useMemo(() => {
    const mentors = users?.filter(u => u.role === 'MENTOR' || u.role === 'ADMIN') || [];
    const mentees = users?.filter(u => u.role === 'MENTEE') || [];
    return {
      mentorOptions: mentors.map(u => ({ value: u.id, label: u.name })),
      menteeOptions: mentees.map(u => ({ value: u.id, label: u.name })),
    };
  }, [users]);

  const mutation = useMutation({
    mutationFn: createManualMatch,
    onSuccess: () => {
      toast.success('Match created successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'requests'] }); // Refresh the requests list
      onClose(); // Close the modal
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create match.');
    },
  });

  const handleSubmit = () => {
    if (selectedMentor && selectedMentee) {
      mutation.mutate({ mentorId: selectedMentor.value, menteeId: selectedMentee.value });
    } else {
      toast.warn('Please select both a mentor and a mentee.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Manual Match</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Mentor</label>
            <Select
              options={mentorOptions}
              value={selectedMentor}
              onChange={setSelectedMentor}
              isLoading={isLoadingUsers}
              placeholder="Search for a mentor..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Mentee</label>
            <Select
              options={menteeOptions}
              value={selectedMentee}
              onChange={setSelectedMentee}
              isLoading={isLoadingUsers}
              placeholder="Search for a mentee..."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-md text-white bg-brand-accent hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating Match...' : 'Confirm Match'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualMatchModal;