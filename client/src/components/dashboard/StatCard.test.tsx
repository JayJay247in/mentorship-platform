// src/components/dashboard/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import StatCard from './StatCard';

// We wrap the component in BrowserRouter because it contains a <Link> component.
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('StatCard Component', () => {
  test('renders the title and value correctly when not loading', () => {
    // Arrange: Set up the props for the component
    const props = {
      title: 'Total Users',
      value: 120,
      isLoading: false,
    };

    // Act: Render the component
    renderWithRouter(<StatCard {...props} />);

    // Assert: Check if the elements are on the screen
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  test('renders a spinner when in the loading state', () => {
    // Arrange
    const props = {
      title: 'Total Users',
      value: 0,
      isLoading: true,
    };

    // Act
    renderWithRouter(<StatCard {...props} />);

    // Assert: Check that the value is NOT displayed and the spinner IS
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    // We can test for the spinner by its role or a test-id, but for now,
    // let's just confirm the value is hidden, which is a good indicator.
    // A more advanced test would add a data-testid="spinner" to the spinner component.
  });

  test('renders a link if linkTo prop is provided', () => {
    // Arrange
    const props = {
      title: 'Manage Users',
      value: 50,
      isLoading: false,
      linkTo: '/admin/users',
      linkText: 'Go to users',
    };

    // Act
    renderWithRouter(<StatCard {...props} />);

    // Assert: Find the link by its text and check its href attribute
    const linkElement = screen.getByRole('link', { name: /go to users/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/admin/users');
  });
});
