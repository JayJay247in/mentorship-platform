// src/pages/ForgotPasswordPage.tsx
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../services/api';

const forgotPasswordMutationFn = async (email: string) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: forgotPasswordMutationFn,
    onSuccess: (data) => {
      toast.info(data.message); // Show the success message from the API
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'An error occurred.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center font-display">Forgot Password</h2>
        <p className="text-center text-sm text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-sm text-center">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
