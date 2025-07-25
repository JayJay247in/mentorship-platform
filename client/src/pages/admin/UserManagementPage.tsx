// src/pages/admin/UserManagementPage.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ManualMatchModal from '../../components/admin/ManualMatchModal';
import Spinner from '../../components/Spinner';
import Table from '../../components/ui/Table';
import { fetchAllUsers, updateUserRole } from '../../services/adminService';
import { UserRole } from '../../types';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User role updated!');
    },
    onError: () => toast.error('Failed to update role.'),
  });

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRoleMutation.mutate({ userId, role });
  };

  // Define the table headers in a simple array
  const tableHeaders = ['Name', 'Email', 'Role', 'Joined'];

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 font-display">User Management</h1>
            {/* --- ADD THIS BUTTON --- */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 font-semibold text-white bg-brand-accent rounded-md hover:opacity-90"
            >
                Create Manual Match
            </button>
        </div>

      {/* --- THIS IS THE REFACTORED PART --- */}
      <Table headers={tableHeaders}>
        {users?.map((user) => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                disabled={updateUserRoleMutation.isPending && updateUserRoleMutation.variables?.userId === user.id}
                className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="MENTEE">Mentee</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(user.createdAt)}
            </td>
          </tr>
        ))}
      </Table>
       <ManualMatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserManagementPage;