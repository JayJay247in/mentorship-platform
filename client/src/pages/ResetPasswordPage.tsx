// src/pages/ResetPasswordPage.tsx
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../services/api';

const resetPasswordMutationFn = async (payload: {
  token: string;
  password: string;
}) => {
  const { token, password } = payload;
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: resetPasswordMutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (!token) {
      return toast.error('Invalid or missing reset token.');
    }
    mutation.mutate({ token, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center font-display">Set a New Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {mutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
