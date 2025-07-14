// src/pages/dashboards/MentorDashboard.tsx
import React from 'react';

import MentorActionItems from '../../components/dashboard/MentorActionItems';
import MentorUpcomingSessions from '../../components/dashboard/MentorUpcomingSessions';
import { useAuth } from '../../context/AuthContext';

const MentorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 font-display">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-gray-600">
        Here's a summary of your mentorship activities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MentorActionItems />
        <MentorUpcomingSessions />
      </div>
    </div>
  );
};

export default MentorDashboard;
