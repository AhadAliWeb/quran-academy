import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Mail, Shield, ArrowRight } from 'lucide-react';

const Confirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Mail, text: "Account Created", completed: true },
    { icon: Clock, text: "Pending Verification", completed: false },
    { icon: Shield, text: "Admin Review", completed: false },
    { icon: CheckCircle, text: "Account Active", completed: false }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#007970' }}
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
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-teal-400 to-primary rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <CheckCircle className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            
            {/* Animated Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
              Account Created Successfully!
            </h1>
            
            <div className="space-y-3 text-gray-600">
              <p className="text-lg font-medium">
                🎉 Welcome aboard!
              </p>
              <p className="text-base">
                Please verify your account from Admin to continue
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-br from-teal-400 to-primary text-white scale-110 shadow-lg' 
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'animate-pulse' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs text-center font-medium transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-teal-400 to-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Clock className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-teal-800 mb-1">
                  Verification in Progress
                </h3>
                <p className="text-sm text-teal-700">
                  Our admin team is reviewing your account. This usually takes 1-2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Check Your Email</p>
                  <p className="text-xs text-gray-600">We'll notify you once verification is complete</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Secure Process</p>
                  <p className="text-xs text-gray-600">Your data is protected during verification</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg">
              <span className="flex items-center justify-center space-x-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
              Contact Support
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{' '}
              <span className="text-primary font-medium">support@company.com</span>
            </p>
          </div>
        </div>

        {/* Floating Action */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-full px-4 py-2 text-white text-sm animate-bounce">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span>Verification request sent</span>
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

export default Confirmation;