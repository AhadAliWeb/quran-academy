import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const Alert = ({ message, theme = 'info', onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const themeConfig = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      closeBtn: 'text-green-500 hover:text-green-700'
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      closeBtn: 'text-red-500 hover:text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      closeBtn: 'text-yellow-500 hover:text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      closeBtn: 'text-blue-500 hover:text-blue-700'
    }
  };

  const config = themeConfig[theme] || themeConfig.info;

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full z-50 transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`relative p-4 border rounded-md shadow-lg ${config.container}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-colors ${config.closeBtn}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {autoClose && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-md" 
               style={{
                 animation: `shrink ${duration}ms linear`,
                 width: '100%'
               }}
          />
        )}
      </div>
      <style jsx="true">{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Alert