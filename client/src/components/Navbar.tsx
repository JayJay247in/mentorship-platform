// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-xl font-bold text-gray-800">
              Mentorship Platform
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Role-Specific Links */}
                {role === 'MENTEE' && (
                  <>
                    <Link to="/mentors" className="text-gray-600 hover:text-indigo-500">Find a Mentor</Link>
                    <Link to="/my-requests" className="text-gray-600 hover:text-indigo-500">My Requests</Link>
                  </>
                )}

                {/* Add links for MENTOR and ADMIN later here */}
                {role === 'MENTOR' && (
                  <>
                    <Link to="/mentor/requests" className="text-gray-600 hover:text-indigo-500">Incoming Requests</Link>
                    <Link to="/mentor/sessions" className="text-gray-600 hover:text-indigo-500">My Sessions</Link>
                  </>
                )}

                {/* NEW ADMIN LINKS */}
                {role === 'ADMIN' && (
                  <>
                    <Link to="/admin/users" className="text-gray-600 hover:text-indigo-500">User Mgmt</Link>
                    <Link to="/admin/requests" className="text-gray-600 hover:text-indigo-500">All Requests</Link>
                    <Link to="/admin/sessions" className="text-gray-600 hover:text-indigo-500">All Sessions</Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm">Welcome, {user?.name}</span>
                  <button onClick={handleLogout} className="...">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-800 text-sm mr-4 hover:text-indigo-500">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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