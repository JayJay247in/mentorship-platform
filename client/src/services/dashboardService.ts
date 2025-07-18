// client/src/services/dashboardService.ts

import api from './api';

// The return type can be `any` here because the structure will be
// vastly different based on the user's role. The component will handle typing.
export const fetchDashboardData = async (): Promise<any> => {
  const { data } = await api.get('/dashboard');
  return data;
};