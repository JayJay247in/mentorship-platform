// src/pages/ProfilePage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef,useState } from 'react';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';
import ImageLightbox from '../components/ui/ImageLightbox';
import api from '../services/api';
import { fetchMyProfile, updateMyProfile } from '../services/userService';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || '');
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfileData) => {
      queryClient.setQueryData(['myProfile'], updatedProfileData);
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;

    if (!CLOUD_NAME || !API_KEY) {
      toast.error("Image upload is not configured correctly.");
      return;
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const { data: { timestamp, signature } } = await api.get('/upload/signature');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', API_KEY);
      
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await response.json();
      
      if (uploadData.error) {
        throw new Error(uploadData.error.message);
      }

      updateProfileMutation.mutate(
        { avatarUrl: uploadData.secure_url },
        { 
          onSuccess: (updatedProfileData) => {
            queryClient.setQueryData(['myProfile'], updatedProfileData);
            toast.update(toastId, { render: "Avatar updated!", type: "success", isLoading: false, autoClose: 3000 });
          }
        }
      );
    } catch (error: any) {
      toast.update(toastId, { render: `Image upload failed: ${error.message}`, type: "error", isLoading: false, autoClose: 5000 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { name, bio },
      { 
        onSuccess: (updatedProfileData) => {
          queryClient.setQueryData(['myProfile'], updatedProfileData);
          toast.success("Profile saved successfully!");
        }
      }
    );
  };

  if (isLoading) return <Spinner />;

  // --- THIS IS THE FIX ---
  // Declare the variable here, before the return statement.
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=random&color=fff&size=128`;
  const avatarToShow = profile?.avatarUrl || fallbackAvatar;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Edit Your Profile</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
          <div className="flex items-center space-x-6 mb-8">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="focus:outline-none focus:ring-4 focus:ring-brand-accent focus:ring-opacity-50 rounded-full"
            >
              <img 
                  src={avatarToShow} // Now this variable exists
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </button>
            <div>
              <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif" 
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
              />
              <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 font-semibold text-sm text-white bg-brand-accent rounded-md hover:opacity-90 transition-opacity"
              >
                  Change Photo
              </button>
              <p className="text-xs text-brand-text-light mt-2">JPG, PNG, or GIF. 5MB max.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-text-light">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-brand-text-light">Bio</label>
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
              className="px-6 py-2 font-semibold text-white bg-brand-secondary rounded-md hover:opacity-90 disabled:bg-opacity-50"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      
      <ImageLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={avatarToShow} // And this variable exists
      />
    </>
  );
};

export default ProfilePage;