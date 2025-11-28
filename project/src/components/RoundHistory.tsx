import { RoundResult } from '../types/game';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';

interface RoundHistoryProps {
  history: RoundResult[];
}

export const RoundHistory = ({ history }: RoundHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Award className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Round History</h2>
      </div>

      <div className="space-y-3">
        {history.map((result) => (
          <div
            key={result.round}
            className={`flex items-center justify-between p-4 rounded-lg border-2 ${
              result.won
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {result.won ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-gray-500" />
                )}
                <span className="font-semibold text-gray-700">
                  Round {result.round}
                </span>
              </div>
              <span className="text-gray-600">
                {result.attempts} {result.attempts === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">
                {result.pointsEarned}
              </span>
              <span className="text-sm text-gray-500">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
