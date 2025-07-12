// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while the auth state is still loading
    if (isLoading) {
      return;
    }

    // Once loading is false, redirect based on role
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'MENTOR':
        navigate('/mentor/dashboard', { replace: true });
        break;
      case 'MENTEE':
        navigate('/mentee/dashboard', { replace: true });
        break;
      default:
        // If there's no role for some reason, send back to login
        navigate('/login', { replace: true });
        break;
    }
  }, [role, isLoading, navigate]);

  // Render a loading state while the redirect is happening
  return <div>Loading your dashboard...</div>;
};

export default DashboardPage;