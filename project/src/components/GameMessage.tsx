import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface GameMessageProps {
  message: string;
  status: 'playing' | 'won' | 'lost';
}

export const GameMessage = ({ message, status }: GameMessageProps) => {
  if (!message) return null;

  const getStyles = () => {
    switch (status) {
      case 'won':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'lost':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'lost':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 mb-6 flex items-center space-x-3 ${getStyles()}`}>
      {getIcon()}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};
