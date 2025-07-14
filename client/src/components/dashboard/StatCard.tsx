// src/components/dashboard/StatCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../Spinner';

interface StatCardProps {
  title: string;
  value: number | string;
  isLoading: boolean;
  linkTo?: string; // Optional link to a management page
  linkText?: string;
}

const StatCard = ({
  title,
  value,
  isLoading,
  linkTo,
  linkText,
}: StatCardProps) => {
  const content = (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-gray-500 font-medium">{title}</h4>
      <div className="mt-2">
        {isLoading ? (
          <div className="h-10">
            {' '}
            {/* Placeholder height */}
            <Spinner />
          </div>
        ) : (
          <p className="text-4xl font-bold text-gray-800">{value}</p>
        )}
      </div>
      {linkTo && (
        <div className="mt-4">
          <Link
            to={linkTo}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {linkText || 'View details →'}
          </Link>
        </div>
      )}
    </div>
  );

  return content;
};

export default StatCard;
