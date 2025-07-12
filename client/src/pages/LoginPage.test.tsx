// src/pages/LoginPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

// Mock the AuthProvider to avoid actual API calls during tests
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

test('renders login page with email and password fields', () => {
  // Arrange: Render the component within necessary providers
  render(
    <BrowserRouter>
      <MockAuthProvider>
        <LoginPage />
      </MockAuthProvider>
    </BrowserRouter>
  );

  // Act & Assert: Check if the key elements are on the screen
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});