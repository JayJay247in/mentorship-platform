// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import ChatBubble from './ChatBubble';
import Navbar from './Navbar';
import AnimatedPage from './ui/AnimatedPage';

const Layout = () => {
  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />
      <main>
        <div className="container mx-auto px-6 py-8">
          <AnimatedPage>
            <Outlet />
          </AnimatedPage>
        </div>
      </main>
      <ChatBubble />
    </div>
  );
};

export default Layout;