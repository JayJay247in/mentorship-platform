// src/pages/dashboards/AdminDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../context/AuthContext';
// Import all necessary admin API functions
import {
  fetchAllRequests,
  fetchAllSessions,
  fetchAllUsers,
} from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();

  // We will run three queries in parallel to get all our stats
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'], // This reuses the cached data from the User Mgmt page!
    queryFn: fetchAllUsers,
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['adminRequests'],
    queryFn: fetchAllRequests,
  });

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['adminSessions'],
    queryFn: fetchAllSessions,
  });

  // Calculate stats from the data
  const totalUsers = users?.length || 0;
  const totalMentors = users?.filter((u) => u.role === 'MENTOR').length || 0;
  const pendingRequests =
    requests?.filter((r) => r.status === 'PENDING').length || 0;
  const upcomingSessions =
    sessions?.filter((s) => s.status === 'UPCOMING').length || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 font-display">Admin Dashboard</h1>
      <p className="text-gray-600">
        Welcome, {user?.name}. Here is the platform overview.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          isLoading={isLoadingUsers}
          linkTo="/admin/users"
          linkText="Manage Users"
        />
        <StatCard
          title="Total Mentors"
          value={totalMentors}
          isLoading={isLoadingUsers}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          isLoading={isLoadingRequests}
          linkTo="/admin/requests"
          linkText="Manage Requests"
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingSessions}
          isLoading={isLoadingSessions}
          linkTo="/admin/sessions"
          linkText="Manage Sessions"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
