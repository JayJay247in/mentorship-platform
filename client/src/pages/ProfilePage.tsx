// src/pages/ProfilePage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import { fetchMyProfile, updateMyProfile } from '../services/userService';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // 1. Fetch the user's current profile data to populate the form
  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  // 2. When the data loads, update our form state
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || '');
    }
  }, [profile]);

  // 3. Create the mutation for updating the profile
  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      // 4. Invalidate the query to refetch the profile data
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, bio });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">
        Edit Your Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
