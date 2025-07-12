// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {/* The Outlet will render the specific page component for the current route */}
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;