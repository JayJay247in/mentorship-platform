// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="text-xl font-bold text-brand-primary hover:text-brand-accent transition-colors"
            >
              Mentorship Platform
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* --- Role-Specific Links --- */}
                {role === 'MENTEE' && (
                  <>
                    <Link to="/mentors" className="text-brand-text-light hover:text-brand-accent transition-colors">Find a Mentor</Link>
                    <Link to="/my-requests" className="text-brand-text-light hover:text-brand-accent transition-colors">My Requests</Link>
                    <Link to="/my-sessions" className="text-brand-text-light hover:text-brand-accent transition-colors">My Sessions</Link>
                  </>
                )}
                {role === 'MENTOR' && (
                  <>
                    <Link to="/mentor/requests" className="text-brand-text-light hover:text-brand-accent transition-colors">Incoming Requests</Link>
                    <Link to="/mentor/sessions" className="text-brand-text-light hover:text-brand-accent transition-colors">My Sessions</Link>
                    <Link to="/mentor/availability" className="text-brand-text-light hover:text-brand-accent transition-colors">My Availability</Link>
                  </>
                )}
                {role === 'ADMIN' && (
                  <>
                    <Link to="/admin/users" className="text-brand-text-light hover:text-brand-accent transition-colors">User Mgmt</Link>
                    <Link to="/admin/requests" className="text-brand-text-light hover:text-brand-accent transition-colors">All Requests</Link>
                    <Link to="/admin/sessions" className="text-brand-text-light hover:text-brand-accent transition-colors">All Sessions</Link>
                  </>
                )}
                
                {/* --- Shared Authenticated Links --- */}
                <Link to="/profile" className="text-brand-text-light hover:text-brand-accent transition-colors">My Profile</Link>
                <div className="flex items-center space-x-4 border-l pl-4">
                  <NotificationBell />
                  <div className="flex items-center space-x-2">
                    <span className="text-brand-text text-sm">Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="px-3 py-2 text-sm font-semibold text-white bg-status-error rounded-md hover:opacity-80 transition-opacity">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brand-text hover:text-brand-accent transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-accent rounded-md hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;