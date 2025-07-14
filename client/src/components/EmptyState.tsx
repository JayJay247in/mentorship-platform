// src/components/EmptyState.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
}

const EmptyState = ({
  title,
  message,
  actionText,
  actionLink,
}: EmptyStateProps) => (
  <div className="text-center p-8 bg-white rounded-lg shadow-sm">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
    {actionLink && actionText && (
      <div className="mt-6">
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          {actionText}
        </Link>
      </div>
    )}
  </div>
);

export default EmptyState;
