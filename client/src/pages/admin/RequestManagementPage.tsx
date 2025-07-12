// src/pages/admin/RequestManagementPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AdminRequest } from '../../types';

const RequestManagementPage = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  useEffect(() => {
    api.get('/admin/requests').then(res => setRequests(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Mentorship Requests</h1>
      {/* You can build a table here similar to the User Management page */}
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        {JSON.stringify(requests, null, 2)}
      </pre>
    </div>
  );
};

export default RequestManagementPage;