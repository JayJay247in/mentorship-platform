// src/pages/admin/UserManagementPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AdminUser, UserRole } from '../../types';
import Spinner from '../../components/Spinner';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const UserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      // Update the user's role in the local state for immediate UI feedback
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      alert('User role updated successfully.');
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    aria-label={`Change role for ${user.name}`}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="MENTEE">Mentee</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;