// client/src/pages/DashboardPage.tsx

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../services/dashboardService';

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, link }: { title: string, value: string | number, link?: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {link && <Link to={link} className="text-sm font-semibold text-brand-accent hover:underline mt-2 inline-block">View Details</Link>}
    </div>
);

// --- MENTEE-SPECIFIC DASHBOARD ---
const MenteeDashboard = ({ data, userName }: { data: any, userName: string }) => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold font-display text-brand-primary">Welcome, {userName}!</h1>

    {/* Section 1: Next Session */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Next Session</h2>
      {data.upcomingSession ? (
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-bold">With {data.upcomingSession.mentor.name}</p>
            <p className="text-sm text-gray-600">{format(new Date(data.upcomingSession.scheduledTime), 'eeee, MMM d @ h:mm a')}</p>
          </div>
          <Link to="/my-sessions" className="px-4 py-2 text-sm font-semibold text-white bg-brand-accent rounded-md hover:opacity-90">View Sessions</Link>
        </div>
      ) : (
        <p className="text-gray-500">No upcoming sessions scheduled. <Link to="/my-requests" className="text-brand-accent font-semibold">Book one now?</Link></p>
      )}
    </div>

    {/* Section 2: Suggested Mentors */}
    <div>
        <h2 className="text-xl font-semibold mb-4">Suggested Mentors For You</h2>
        {data.suggestedMentors && data.suggestedMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.suggestedMentors.map((mentor: any) => (
            <div key={mentor.id} className="bg-white p-4 rounded-lg shadow-md">
               <img src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${mentor.name}`} alt={mentor.name} className="w-16 h-16 rounded-full mx-auto mb-2"/>
               <h3 className="text-lg font-bold text-center">{mentor.name}</h3>
               <p className="text-sm text-gray-500 text-center truncate">{mentor.bio}</p>
               <div className="text-center mt-4">
                <Link to={`/mentors`} className="px-3 py-1 text-sm font-semibold text-white bg-brand-accent rounded-md">View Profile</Link>
               </div>
            </div>
          ))}
        </div>
      ) : <p className="text-gray-500">Explore our <Link to="/mentors" className="font-semibold text-brand-accent">community of mentors</Link>!</p>
    }
    </div>
  </div>
);

// --- MENTOR-SPECIFIC DASHBOARD ---
const MentorDashboard = ({ data, userName }: { data: any, userName: string }) => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold font-display text-brand-primary">Welcome Back, {userName}!</h1>

    {/* Section 1: Key Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending Requests" value={data.pendingRequestsCount} link="/mentor/requests" />
        <StatCard title="Total Completed Sessions" value={data.completedSessionsCount} />
        <StatCard title="Upcoming Sessions" value={data.upcomingSessions?.length || 0} link="/mentor/sessions" />
    </div>

    {/* Section 2: Quick Links / Next Actions */}
    <div>
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
            {data.newestRequest ? (
                <div className="flex justify-between items-center">
                    <p>You have a new request from <span className="font-bold">{data.newestRequest.mentee.name}</span>.</p>
                    <Link to="/mentor/requests" className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-md hover:opacity-90">Review Requests</Link>
                </div>
            ) : (
                <p>You're all caught up! No pending requests right now.</p>
            )}
        </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD PAGE COMPONENT ---
const DashboardPage = () => {
  const { user, role } = useAuth(); // Get user's role from AuthContext
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="text-center text-red-500">Could not load dashboard data.</div>;
  }

  // Conditionally render the correct dashboard based on the user's role
  if (role === 'MENTEE') {
    return <MenteeDashboard data={data} userName={user!.name} />;
  }

  if (role === 'MENTOR') {
    return <MentorDashboard data={data} userName={user!.name} />;
  }
  
  // Fallback for Admin or other roles
  return (
    <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">{data?.message || 'Overview of platform activity.'}</p>
    </div>
  );
};

export default DashboardPage;