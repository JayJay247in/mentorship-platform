// src/App.tsx
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
// Providers and Components
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import RequestManagementPage from './pages/admin/RequestManagementPage';
import SessionManagementPage from './pages/admin/SessionManagementPage';
// Admin Pages
import UserManagementPage from './pages/admin/UserManagementPage';
import AvailabilityPage from './pages/AvailabilityPage';
import ChatPage from './pages/ChatPage'
// Shared Protected Pages
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// Mentor Pages
import IncomingRequestsPage from './pages/IncomingRequestsPage';
// --- Page Imports ---
// Public Pages
import LoginPage from './pages/LoginPage';
// Mentee Pages
import MentorListPage from './pages/MentorListPage';
import MentorSessionsPage from './pages/MentorSessionsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import MySessionsPage from './pages/MySessionsPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const queryClient = new QueryClient();

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
          <Routes>
            {/* =================================== */}
            {/*         PUBLIC ROUTES               */}
            {/* These are accessible to everyone    */}
            {/* =================================== */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

            {/* Redirect root path to the login page */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* =================================== */}
            {/*         PROTECTED ROUTES            */}
            {/* Require login and have the Layout   */}
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
                <Route
                  path="/mentor/requests"
                  element={<IncomingRequestsPage />}
                />
                <Route
                  path="/mentor/sessions"
                  element={<MentorSessionsPage />}
                />
                <Route
                  path="/mentor/availability"
                  element={<AvailabilityPage />}
                />

                {/* Admin */}
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route
                  path="/admin/requests"
                  element={<RequestManagementPage />}
                />
                <Route
                  path="/admin/sessions"
                  element={<SessionManagementPage />}
                />
              </Route>
            </Route>

            {/* Optional: Add a 404 Not Found page */}
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
        </Router>
        </SocketProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
