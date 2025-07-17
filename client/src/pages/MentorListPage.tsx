// src/pages/MentorListPage.tsx
import { useMutation,useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React, { useMemo,useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

import EmptyState from '../components/EmptyState';
import MentorCard from '../components/MentorCard';
import SkeletonCard from '../components/SkeletonCard';
import Spinner from '../components/Spinner';
import { fetchMentors } from '../services/mentorService';
import { createRequest, fetchSentRequests } from '../services/requestService';
import { fetchAllSkills } from '../services/skillService';
import { Mentor, Skill } from '../types';

// Define animation variants for the container and the items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This will make each child animate 0.1s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MentorListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<{ value: string; label: string }[]>([]);

  // --- QUERIES ---
  const { 
    data: allSkills, 
    isLoading: isLoadingSkills,
    isError: isErrorSkills 
  } = useQuery<Skill[]>({
    queryKey: ['allSkills'],
    queryFn: fetchAllSkills,
  });
  
  const { 
    data: mentors, 
    isLoading: isLoadingMentors,
    isError: isErrorMentors
  } = useQuery<Mentor[]>({
    queryKey: ['mentors', searchTerm, selectedSkills],
    queryFn: () => {
      const skillIds = selectedSkills.map(s => s.value).join(',');
      return fetchMentors({ search: searchTerm, skills: skillIds });
    },
  });

  const { data: sentRequests } = useQuery({
    queryKey: ['sentRequests'],
    queryFn: fetchSentRequests,
  });

  const createRequestMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => toast.success('Mentorship request sent successfully!'),
    onError: (err: any) => toast.error(`Error: ${err.response?.data?.message || 'Failed to send request.'}`),
  });

  // --- MEMOIZED VALUES ---
  const skillOptions = useMemo(() => {
    return allSkills?.map(skill => ({ value: skill.id, label: skill.name })) || [];
  }, [allSkills]);

  const requestedMentorIds = useMemo(() => {
    if (!sentRequests) return new Set();
    return new Set(
      sentRequests
        .filter(req => req.status === 'PENDING' || req.status === 'ACCEPTED')
        .map(req => req.mentor.id)
    );
  }, [sentRequests]);

  const handleRequest = (mentorId: string) => {
    createRequestMutation.mutate({ mentorId });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Find Your Mentor</h1>
      
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="search-mentor" className="block text-sm font-medium text-gray-700">Search by Name</label>
          <input
            type="text"
            id="search-mentor"
            placeholder="e.g. Jane Doe"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="skills-filter" className="block text-sm font-medium text-gray-700">Filter by Skills</label>
          <Select
            id="skills-filter"
            isMulti
            options={skillOptions}
            value={selectedSkills}
            onChange={(selected) => setSelectedSkills(selected as any)}
            className="mt-1"
            classNamePrefix="select"
            placeholder="Select skills..."
            isLoading={isLoadingSkills}
            isDisabled={isLoadingSkills || isErrorSkills} // Disable if skills fail to load
          />
        </div>
      </div>

      {/* --- RENDER LOGIC --- */}
      {isLoadingMentors ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isErrorMentors ? (
        <EmptyState
          title="Could Not Load Mentors"
          message="There was an error fetching the list of mentors. Please try again later."
        />
      ) : mentors && mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => {
            const hasRequested = requestedMentorIds.has(mentor.id);
            return (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onRequest={handleRequest}
                hasRequested={hasRequested}
                isSubmitting={createRequestMutation.isPending && createRequestMutation.variables?.mentorId === mentor.id}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Mentors Found"
          message="No mentors matched your search criteria. Try removing some filters."
        />
      )}
    </div>
  );
};

export default MentorListPage;