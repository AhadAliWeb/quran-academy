import React from 'react';
import logo from "/logo.png"


const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Logo with pulsing glow effect */}
        <div className="relative mb-8">
          {/* Spinning ring around logo */}
          <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-teal-300 border-t-transparent rounded-full animate-spin"></div>
          
          {/* Logo with pulse animation */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <img 
              src={logo} 
              alt="Loading" 
              className="w-20 h-20 object-contain animate-pulse rounded-lg"
            />
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-white text-2xl font-semibold mb-4">
          Loading
        </h2>

        {/* Bouncing dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>    
    </div>
  );
};

export default LoadingScreen;