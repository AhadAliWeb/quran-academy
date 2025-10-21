import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, Home, ArrowLeft, AlertTriangle, Mail } from 'lucide-react';

const Unauthorized = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setPulseAnimation((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#dc2626' }}
    >
      {/* Animated Background Patterns */}
      <div className="absolute inset-0">
        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white bg-opacity-8 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.2s' }}></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
            {[...Array(144)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-sm animate-ping" 
                style={{ 
                  animationDelay: `${(i * 0.1) % 3}s`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white to-transparent opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white to-transparent opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="animate-pulse"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-lg transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg border border-white border-opacity-20">
          {/* Error Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <ShieldAlert className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Animated Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
              Access Denied
            </h1>
            
            <div className="space-y-3 text-gray-600">
              <p className="text-lg font-medium">
                🚫 Unauthorized Access
              </p>
              <p className="text-base">
                You don't have permission to access this page
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 mb-6">
              {[Lock, AlertTriangle, ShieldAlert].map((Icon, index) => {
                const isActive = index === pulseAnimation;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 text-white scale-110 shadow-lg animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Access Restricted
                </h3>
                <p className="text-sm text-red-700">
                  This page requires special permissions. If you believe this is an error, please contact your administrator.
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Insufficient Permissions</p>
                  <p className="text-xs text-gray-600">Your current role doesn't allow access to this resource</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Need Access?</p>
                  <p className="text-xs text-gray-600">Contact your administrator to request permissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-medium hover:from-red-700 hover:to-red-800 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg">
              <span className="flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </span>
            </button>
            
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
              <span className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </span>
            </button>
            
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
              Request Access
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{' '}
              <span className="text-red-600 font-medium">support@company.com</span>
            </p>
          </div>
        </div>

        {/* Floating Action */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-full px-4 py-2 text-white text-sm animate-bounce">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            <span>Error Code: 403 - Forbidden</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Unauthorized;