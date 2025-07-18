// client/src/pages/ProfilePage.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as z from 'zod';

import Spinner from '../components/Spinner';
import { GithubIcon, LinkedInIcon, WebsiteIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { fetchAllSkills } from '../services/skillService';
import { findUserProfileById, updateUserProfile } from '../services/userService';
import { Skill, User } from '../types';

// --- DEFINITIVE ZOD SCHEMA FIX ---
// This is the most robust and correct way to validate an optional URL field.
const optionalUrl = z.string().refine((val) => {
    // If the string is empty, it's valid.
    if (val === '') return true;
    // If it's not empty, it must be a valid URL.
    return z.string().url().safeParse(val).success;
}, { message: "Invalid URL format" });

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  socialLinks: z.object({
    linkedin: optionalUrl.optional(),
    github: optionalUrl.optional(),
    website: optionalUrl.optional(),
  }).optional(),
});
type ProfileFormData = z.infer<typeof profileFormSchema>;


// --- ALL OTHER COMPONENTS ARE NOW CORRECT ---
const ProfileView = ({ profile, onEdit, canEdit }: { profile: User; onEdit: () => void; canEdit: boolean }) => {
  const social = profile.socialLinks as any || {};
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      {canEdit && (<div className="flex justify-end"><button onClick={onEdit} className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-md">Edit Profile</button></div>)}
      <div className="text-center">
        <img src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.name}&size=128`} alt={profile.name} className="w-32 h-32 rounded-full mx-auto -mt-20 border-4 border-white shadow-md"/>
        <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
        <p className="text-lg text-gray-600">{profile.title}{profile.company && ` at ${profile.company}`}</p>
        <div className="mt-4 flex justify-center space-x-4">
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><LinkedInIcon className="w-6 h-6"/></a>}
            {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800"><GithubIcon className="w-6 h-6"/></a>}
            {social.website && <a href={social.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600"><WebsiteIcon className="w-6 h-6"/></a>}
        </div>
      </div>
      <div className="mt-8"><h2 className="text-xl font-semibold mb-2">About</h2><p className="text-gray-700">{profile.bio || 'No bio provided.'}</p></div>
      <div className="mt-8"><h2 className="text-xl font-semibold mb-4">Skills</h2><div className="flex flex-wrap gap-2">{(profile.skills || []).map((skillData: any) => (<span key={skillData.skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{skillData.skill.name}</span>))}</div></div>
    </div>
  );
};

const ProfileForm = ({ profile, onCancel, allSkills }: { profile: User; onCancel: () => void; allSkills: Skill[] }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProfileFormData>({ resolver: zodResolver(profileFormSchema), });
  useEffect(() => {
    reset({
        name: profile.name, title: profile.title || '', company: profile.company || '', bio: profile.bio || '',
        skills: (profile.skills as any)?.map(({skill}: any) => ({value: skill.id, label: skill.name})) || [],
        socialLinks: (profile.socialLinks as any) || { linkedin: '', github: '', website: '' }
    });
  }, [profile, reset]);
  const mutation = useMutation({
      mutationFn: updateUserProfile,
      onSuccess: () => {
        toast.success('Profile updated!');
        queryClient.invalidateQueries({queryKey: ['userProfile', profile.id]});
        onCancel();
      },
      onError: () => toast.error('Failed to update profile.')
  });
  const onSubmit = (data: ProfileFormData) => { mutation.mutate({ userId: profile.id, ...data, skills: data.skills?.map(s => s.value) }); };
  const skillOptions = allSkills.map(s => ({ value: s.id, label: s.name }));
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Edit Your Profile</h1>
                <div><label>Full Name</label><input {...register('name')} className="w-full mt-1 p-2 border rounded-md" /><p className="text-red-500 text-sm mt-1">{errors.name?.message}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label>Job Title</label><input {...register('title')} className="w-full mt-1 p-2 border rounded-md"/></div>
                  <div><label>Company</label><input {...register('company')} className="w-full mt-1 p-2 border rounded-md"/></div>
                </div>
                <div><label>About Me</label><textarea {...register('bio')} className="w-full mt-1 p-2 border rounded-md" rows={4}/></div>
                <div><label>Skills</label><Controller name="skills" control={control} render={({ field }) => ( <Select {...field} isMulti options={skillOptions} className="mt-1"/> )}/></div>
                <div>
                    <h2 className="font-semibold">Social Links</h2>
                    <div className="space-y-2 mt-2">
                        {/* --- DEFINITIVE ERROR MESSAGE FIX --- */}
                        <div><label className="text-sm">LinkedIn</label><input {...register('socialLinks.linkedin')} className="w-full mt-1 p-2 border rounded-md" placeholder="https://linkedin.com/in/..."/>{errors.socialLinks?.linkedin?.message && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.linkedin.message}</p>}</div>
                        <div><label className="text-sm">GitHub</label><input {...register('socialLinks.github')} className="w-full mt-1 p-2 border rounded-md" placeholder="https://github.com/..."/>{errors.socialLinks?.github?.message && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.github.message}</p>}</div>
                        <div><label className="text-sm">Website</label><input {...register('socialLinks.website')} className="w-full mt-1 p-2 border rounded-md" placeholder="https://..."/>{errors.socialLinks?.website?.message && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.website.message}</p>}</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-8">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
                <button type="submit" disabled={mutation.isPending} className="px-4 py-2 rounded-md text-white bg-brand-accent disabled:opacity-50">{mutation.isPending ? 'Saving...' : 'Save Changes'}</button>
            </div>
        </form>
    </div>
  )
};

const ProfilePage = () => {
  const { id: routeUserId } = useParams();
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const profileId = routeUserId || authUser!.id;
  const { data: profile, isLoading, isError } = useQuery<User>({ queryKey: ['userProfile', profileId], queryFn: () => findUserProfileById(profileId), enabled: !!profileId, });
  const { data: allSkills, isLoading: isLoadingSkills } = useQuery<Skill[]>({ queryKey: ['allSkills'], queryFn: fetchAllSkills, enabled: isEditing, });
  if (isLoading || (isEditing && isLoadingSkills)) return <Spinner />;
  if (isError || !profile) return <div>User not found.</div>;
  const canEdit = profile.id === authUser!.id;
  return (
      <div className="pt-10">
        {isEditing && canEdit ? (
          <ProfileForm profile={profile} onCancel={() => setIsEditing(false)} allSkills={allSkills || []} />
        ) : (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} canEdit={canEdit} />
        )}
      </div>
  );
};
export default ProfilePage;