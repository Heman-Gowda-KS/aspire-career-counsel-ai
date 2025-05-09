
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex mr-auto bg-muted max-w-[80%] rounded-lg p-4">
      <div className="flex space-x-2">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
