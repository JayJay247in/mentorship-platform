// src/services/adminService.ts
import { AdminUser, UserRole } from '../types';
import { AdminRequest, AdminSession } from '../types';
import api from './api';

export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const updateUserRole = async (payload: {
  userId: string;
  role: UserRole;
}) => {
  const { data } = await api.put(`/admin/users/${payload.userId}/role`, {
    role: payload.role,
  });
  return data;
};

export const fetchAllRequests = async (): Promise<AdminRequest[]> => {
  const { data } = await api.get('/admin/requests');
  return data;
};

export const fetchAllSessions = async (): Promise<AdminSession[]> => {
  const { data } = await api.get('/admin/sessions');
  return data;
};
