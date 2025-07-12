// src/pages/MentorListPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mentor } from '../types';
import MentorCard from '../components/MentorCard';
import { toast } from 'react-toastify';

const MentorListPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get('/users/mentors');
        setMentors(response.data);
      } catch (err) {
        setError('Failed to fetch mentors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleRequest = async (mentorId: string) => {
    try {
        await api.post('/requests', { mentorId });
        // OLD: alert('Mentorship request sent successfully!');
        toast.success('Mentorship request sent successfully!'); // NEW
    } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to send request.';
        // OLD: alert(`Error: ${message}`);
        toast.error(`Error: ${message}`); // NEW
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading mentors...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Mentor</h1>
      {mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onRequest={handleRequest} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No mentors are available at this time.</p>
      )}
    </div>
  );
};

export default MentorListPage;