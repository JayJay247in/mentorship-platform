// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import AnimatedPage from './ui/AnimatedPage'; // Import the wrapper

const Layout = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />
      <main>
        <div className="container mx-auto px-6 py-8">
          {/* --- THIS IS THE CHANGE --- */}
          {/* Wrap the Outlet in our new animation component */}
          <AnimatedPage>
            <Outlet />
          </AnimatedPage>
        </div>
      </main>
    </div>
  );
};

export default Layout;