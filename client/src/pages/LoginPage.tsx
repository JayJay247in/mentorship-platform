// src/pages/LoginPage.tsx
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const loginMutationFn = async (payload: any) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: async (data) => {
      await login(data.token);
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Login failed. Please check your credentials.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-light">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-brand-primary font-display">
          Login to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-light">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-brand-text-light">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-brand-secondary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full px-4 py-3 font-semibold text-white bg-brand-accent rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-brand-text-light">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-secondary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;