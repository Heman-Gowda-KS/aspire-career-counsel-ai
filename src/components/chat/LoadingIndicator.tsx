
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex mr-auto bg-muted max-w-[80%] rounded-lg p-4">
      <div className="flex space-x-2">
        <div 
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce" 
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-secondary to-primary animate-bounce" 
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-secondary animate-bounce" 
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
