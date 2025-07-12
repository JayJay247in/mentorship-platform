// src/components/Spinner.tsx
import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
  </div>
);

export default Spinner;