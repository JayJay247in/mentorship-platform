// src/pages/LoginPage.test.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';

// Helper function to render components with all necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }, // Disable retries for tests
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  test('allows a user to log in successfully and redirects to dashboard', async () => {
    // Arrange
    const user = userEvent.setup();
    // Use MemoryRouter to simulate navigation and test redirects
    renderWithProviders(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Act: Simulate user typing and clicking
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert: Check for the redirect by waiting for a dashboard element to appear
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  test('shows an error message on failed login', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Act
    await user.type(
      screen.getByLabelText(/email address/i),
      'wrong@example.com'
    );
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert: Check that the error toast appears. For toasts, we often look for the text.
    // This assumes you have a ToastContainer in your App component.
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });
});
