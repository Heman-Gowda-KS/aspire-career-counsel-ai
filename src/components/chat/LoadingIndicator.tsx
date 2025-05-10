
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex mr-auto bg-muted max-w-[80%] rounded-lg p-4 shadow-lg animate-pulse">
      <div className="flex space-x-3">
        <div 
          className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-bounce" 
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 animate-bounce" 
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 animate-bounce" 
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
