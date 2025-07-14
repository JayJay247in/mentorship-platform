// src/pages/admin/SessionManagementPage.tsx
import React, { useEffect,useState } from 'react';

import api from '../../services/api';
import { AdminSession } from '../../types';

const SessionManagementPage = () => {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  useEffect(() => {
    api.get('/admin/sessions').then((res) => setSessions(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">
        All Scheduled Sessions
      </h1>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(sessions, null, 2)}
      </pre>
    </div>
  );
};

export default SessionManagementPage;
