// src/components/LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="text-white text-lg">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;