// src/pages/DashboardPage.tsx
import React from 'react';

import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard'; // We've created this now
// Import all specific dashboard components
import MenteeDashboard from './dashboards/MenteeDashboard';
import MentorDashboard from './dashboards/MentorDashboard';

const DashboardPage = () => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  // Render a different component based on the user's role
  switch (role) {
    case 'MENTEE':
      return <MenteeDashboard />;
    case 'MENTOR':
      return <MentorDashboard />;
    case 'ADMIN':
      return <AdminDashboard />; // It's no longer a placeholder!
    default:
      return <h1>Loading your dashboard...</h1>;
  }
};

export default DashboardPage;
