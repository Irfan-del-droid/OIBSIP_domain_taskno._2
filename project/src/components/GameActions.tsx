import { RotateCw, Play } from 'lucide-react';

interface GameActionsProps {
  gameStatus: 'playing' | 'won' | 'lost';
  onNewRound: () => void;
  onRestart: () => void;
}

export const GameActions = ({ gameStatus, onNewRound, onRestart }: GameActionsProps) => {
  if (gameStatus === 'playing') return null;

  return (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={onNewRound}
        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
      >
        <Play className="w-5 h-5" />
        <span>Next Round</span>
      </button>
      <button
        onClick={onRestart}
        className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 font-medium"
      >
        <RotateCw className="w-5 h-5" />
        <span>Restart Game</span>
      </button>
    </div>
  );
};
