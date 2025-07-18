// src/App.tsx

// --- MODIFICATION 1: Import `lazy` and `Suspense` from React ---
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner'; // We'll use this for our fallback UI
// Providers
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// --- MODIFICATION 2: CONVERT ALL PAGE IMPORTS TO USE React.lazy() ---
// Instead of importing the component directly, we call `lazy()` with a dynamic `import()` statement.
// This tells React to fetch the code for these components only when they are first rendered.

// Public Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Shared Protected Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

// Mentee Pages
const MentorListPage = lazy(() => import('./pages/MentorListPage'));
const MyRequestsPage = lazy(() => import('./pages/MyRequestsPage'));
const MySessionsPage = lazy(() => import('./pages/MySessionsPage'));

// Mentor Pages
const IncomingRequestsPage = lazy(() => import('./pages/IncomingRequestsPage'));
const MentorSessionsPage = lazy(() => import('./pages/MentorSessionsPage'));
const AvailabilityPage = lazy(() => import('./pages/AvailabilityPage'));

// Admin Pages
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const RequestManagementPage = lazy(() => import('./pages/admin/RequestManagementPage'));
const SessionManagementPage = lazy(() => import('./pages/admin/SessionManagementPage'));


const queryClient = new QueryClient();

// A simple component to use as the Suspense fallback. It renders a spinner in the center of the screen.
const FullscreenSpinner = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <Spinner />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
            />
            {/* --- MODIFICATION 3: WRAP THE <Routes> WITH <Suspense> --- */}
            {/* The `fallback` prop defines what React will render while it's fetching a lazy-loaded component's code. */}
            <Suspense fallback={<FullscreenSpinner />}>
              <Routes>
                {/* All your Route definitions remain exactly the same! */}

                {/* =================================== */}
                {/*         PUBLIC ROUTES               */}
                {/* =================================== */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                <Route path="/" element={<Navigate to="/login" />} />

                {/* =================================== */}
                {/*         PROTECTED ROUTES            */}
                {/* =================================== */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    {/* Shared */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/chat/:requestId" element={<ChatPage />} />

                    {/* Mentee */}
                    <Route path="/mentors" element={<MentorListPage />} />
                    <Route path="/my-requests" element={<MyRequestsPage />} />
                    <Route path="/my-sessions" element={<MySessionsPage />} />

                    {/* Mentor */}
                    <Route path="/mentor/requests" element={<IncomingRequestsPage />} />
                    <Route path="/mentor/sessions" element={<MentorSessionsPage />} />
                    <Route path="/mentor/availability" element={<AvailabilityPage />} />

                    {/* Admin */}
                    <Route path="/admin/users" element={<UserManagementPage />} />
                    <Route path="/admin/requests" element={<RequestManagementPage />} />
                    <Route path="/admin/sessions" element={<SessionManagementPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<h1>404: Page Not Found</h1>} />
              </Routes>
            </Suspense>
          </Router>
        </SocketProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;