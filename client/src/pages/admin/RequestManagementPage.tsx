// client/src/pages/admin/RequestManagementPage.tsx

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';

import Spinner from '../../components/Spinner';
import Table from '../../components/ui/Table'; // Your reusable Table component
import { fetchAllRequests } from '../../services/adminService';
import { AdminRequest } from '../../types'; // Assuming this type exists

const getStatusClasses = (status: AdminRequest['status']) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    case 'ACCEPTED': return 'bg-green-100 text-green-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RequestManagementPage = () => {
  const { data: requests, isLoading } = useQuery<AdminRequest[]>({
    queryKey: ['admin', 'requests'],
    queryFn: fetchAllRequests,
  });

  const headers = ['Mentee', 'Mentor', 'Status', 'Date Sent'];

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Request Management</h1>
      <Table headers={headers}>
        {requests?.map((req) => (
          <tr key={req.id}>
            <td className="px-6 py-4 whitespace-nowrap">{req.mentee.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{req.mentor.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(req.status)}`}>
                {req.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(req.createdAt), 'PP')}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default RequestManagementPage;