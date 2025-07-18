// client/src/pages/MentorListPage.tsx

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import EmptyState from '../components/EmptyState';
import MentorCard from '../components/MentorCard';
import SkeletonCard from '../components/SkeletonCard';
import { fetchMentors } from '../services/mentorService';
import { createRequest, fetchSentRequests } from '../services/requestService';
import { fetchAllSkills } from '../services/skillService';
import { Mentor, PaginatedResponse, Skill } from '../types';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}};
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MentorListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<{ value: string; label: string; }[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: allSkills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ['allSkills'], queryFn: fetchAllSkills,
  });

  const { data: sentRequests } = useQuery({ queryKey: ['sentRequests'], queryFn: fetchSentRequests });

  const {
    data: paginatedMentors, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingMentors, isError: isErrorMentors,
  } = useInfiniteQuery<PaginatedResponse<Mentor>>({
    queryKey: ['mentors', searchTerm, selectedSkills, selectedDay],
    queryFn: ({ pageParam }) => {
      const skillIds = selectedSkills.map((s) => s.value).join(',');
      return fetchMentors({
        search: searchTerm,
        skills: skillIds,
        day: selectedDay,
        // --- THIS IS THE FIX ---
        // We explicitly cast pageParam from 'unknown' to 'number'.
        pageParam: pageParam as number,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
  });

  // ... (the rest of the component remains exactly the same)
  const createRequestMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => toast.success('Mentorship request sent successfully!'),
    onError: (err: any) => toast.error(`Error: ${err.response?.data?.message || 'Failed to send request.'}`),
  });

  const mentors = paginatedMentors?.pages.flatMap((page) => page.data) ?? [];
  const skillOptions = useMemo(() => allSkills?.map((skill) => ({ value: skill.id, label: skill.name })) || [], [allSkills]);
  const requestedMentorIds = useMemo(() => new Set(sentRequests?.filter((req) => req.status !== 'REJECTED').map((req) => req.mentor.id)), [sentRequests]);

  const handleDaySelect = (dayIndex: number) => {
    setSelectedDay(prev => prev === dayIndex ? null : dayIndex);
  };
  const handleRequest = (mentorId: string) => {
    createRequestMutation.mutate({ mentorId });
  };

  return (
    <div>
      {/* ... filter UI remains the same ... */}
      <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Find Your Mentor</h1>
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search-mentor" className="block text-sm font-medium text-gray-700">Search Name & Bio</label>
            <input type="text" id="search-mentor" placeholder="e.g. Product Management" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} className="w-full mt-1 p-2 border rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="skills-filter" className="block text-sm font-medium text-gray-700">Filter by Skills</label>
            <Select id="skills-filter" isMulti options={skillOptions} value={selectedSkills}
              onChange={(selected) => setSelectedSkills(selected as any)} className="mt-1" classNamePrefix="select" placeholder="Select skills..." isLoading={isLoadingSkills}/>
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Availability</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {daysOfWeek.map((day, index) => (
                  <button key={index} onClick={() => handleDaySelect(index)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                      selectedDay === index ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}>
                    {day}
                  </button>
              ))}
            </div>
        </div>
      </div>
      
      {/* Render logic is unchanged and correct */}
      {isLoadingMentors ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      ) : isErrorMentors ? (
        <EmptyState title="Could Not Load Mentors" message="There was an error." />
      ) : mentors.length > 0 ? (
        <>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants} initial="hidden" animate="visible"
          >
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} onRequest={handleRequest} hasRequested={requestedMentorIds.has(mentor.id)}
                isSubmitting={ createRequestMutation.isPending && createRequestMutation.variables?.mentorId === mentor.id }
              />
            ))}
          </motion.div>
          <div className="text-center mt-8">
            {hasNextPage && (
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}
                className="px-6 py-2 font-semibold bg-brand-accent text-white rounded-md hover:opacity-90 disabled:bg-opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        </>
      ) : (
        <EmptyState title="No Mentors Found" message="Try adjusting your filters." />
      )}
    </div>
  );
};

export default MentorListPage;