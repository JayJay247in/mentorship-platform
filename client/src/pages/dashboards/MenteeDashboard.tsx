// src/pages/dashboards/MenteeDashboard.tsx
import React from 'react';

import PendingRequestsCard from '../../components/dashboard/PendingRequestsCard';
import UpcomingSessionsCard from '../../components/dashboard/UpcomingSessionsCard';
import { useAuth } from '../../context/AuthContext';

const MenteeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 font-display">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingSessionsCard />
        <PendingRequestsCard />
        {/* We can add more cards here later, like "Recommended Mentors" */}
      </div>
    </div>
  );
};

export default MenteeDashboard;
