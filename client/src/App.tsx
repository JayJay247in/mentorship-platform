// src/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorListPage from './pages/MentorListPage';
import MyRequestsPage from './pages/MyRequestsPage';
import IncomingRequestsPage from './pages/IncomingRequestsPage';
import MentorSessionsPage from './pages/MentorSessionsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import RequestManagementPage from './pages/admin/RequestManagementPage';
import SessionManagementPage from './pages/admin/SessionManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* == PUBLIC ROUTES == */}
          {/* These routes are accessible to everyone and do not have the main layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* == PROTECTED ROUTES == */}
          {/* These routes require authentication and are wrapped in our main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* This route now acts as a dispatcher */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Mentee Specific Routes */}
              <Route path="/mentors" element={<MentorListPage />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />

              {/* Mentor Specific Routes */}
              <Route path="/mentor/requests" element={<IncomingRequestsPage />} />
              <Route path="/mentor/sessions" element={<MentorSessionsPage />} />

              {/* Admin Specific Routes */}
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/requests" element={<RequestManagementPage />} />
              <Route path="/admin/sessions" element={<SessionManagementPage />} />
              
              {/* Role-Specific Dashboards */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/mentee/dashboard" element={<MenteeDashboard />} />
            </Route>
          </Route>
          
          {/* Redirect root path to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Optional: Add a 404 Not Found page */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;