// src/components/SkeletonCard.tsx
import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
    <div className="flex flex-wrap gap-2">
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      <div className="h-5 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="h-10 bg-gray-300 rounded w-full mt-6"></div>
  </div>
);

export default SkeletonCard;
