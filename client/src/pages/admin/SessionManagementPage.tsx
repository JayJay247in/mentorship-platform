// client/src/pages/admin/SessionManagementPage.tsx

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React from 'react';

import Spinner from '../../components/Spinner';
import Table from '../../components/ui/Table';
import { fetchAllSessions } from '../../services/adminService';
import { AdminSession } from '../../types';

const getStatusClasses = (status: AdminSession['status']) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

const SessionManagementPage = () => {
  const { data: sessions, isLoading } = useQuery<AdminSession[]>({
    queryKey: ['admin', 'sessions'],
    queryFn: fetchAllSessions,
  });

  const headers = ['Mentee', 'Mentor', 'Status', 'Scheduled Time'];
  
  if (isLoading) return <Spinner />;

  return (
    <div>
        <h1 className="text-3xl font-bold font-display text-brand-primary mb-6">Session Management</h1>
        <Table headers={headers}>
            {sessions?.map((session) => (
            <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap">{session.mentee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{session.mentor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(session.status)}`}>
                    {session.status}
                </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(session.scheduledTime), 'Pp')}</td>
            </tr>
            ))}
        </Table>
    </div>
  );
};

export default SessionManagementPage;