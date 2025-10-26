import { AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const ConfirmationDialog = ({ type = 'confirm', message, onConfirm }) => {
  const handleYes = () => {
    onConfirm(true);
  };

  const handleNo = () => {
    onConfirm(false);
  };

  const getIcon = () => {
    switch(type) {
      case 'confirm':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'update':
        return <AlertCircle className="w-16 h-16 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-16 h-16 text-red-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-gray-500" />;
    }
  };

  const getButtonColor = () => {
    switch(type) {
      case 'delete':
        return 'bg-red-500 hover:bg-red-600';
      case 'update':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'confirm':
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="flex items-center justify-center">
            {getIcon()}
          </div>

          {/* Message */}
          <p className="text-lg text-gray-700 font-medium">
            {message || 'Are you sure you want to proceed?'}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <button
              onClick={handleNo}
              className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-colors"
            >
              No
            </button>
            <button
              onClick={handleYes}
              className={`flex-1 px-6 py-3 font-semibold rounded-md transition-colors text-white ${getButtonColor()}`}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;