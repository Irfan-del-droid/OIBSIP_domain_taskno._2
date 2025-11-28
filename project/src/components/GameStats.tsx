import { Trophy, Target, Hash } from 'lucide-react';

interface GameStatsProps {
  round: number;
  totalScore: number;
  attemptsLeft: number;
  maxAttempts: number;
}

export const GameStats = ({ round, totalScore, attemptsLeft, maxAttempts }: GameStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Hash className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Round</p>
          <p className="text-2xl font-bold text-gray-800">{round}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
        <div className="bg-green-100 p-3 rounded-lg">
          <Trophy className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-2xl font-bold text-gray-800">{totalScore}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
        <div className="bg-orange-100 p-3 rounded-lg">
          <Target className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Attempts</p>
          <p className="text-2xl font-bold text-gray-800">
            {attemptsLeft}/{maxAttempts}
          </p>
        </div>
      </div>
    </div>
  );
};
