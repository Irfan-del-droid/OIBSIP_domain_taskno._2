import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { getTopScores, GameScore } from '../lib/supabase';

interface LeaderboardProps {
  onPlayGame: () => void;
}

export function Leaderboard({ onPlayGame }: LeaderboardProps) {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const topScores = await getTopScores(10);
      setScores(topScores);
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (position: number): string => {
    switch (position) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-gray-400';
      case 2:
        return 'text-orange-600';
      default:
        return 'text-gray-400';
    }
  };

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onPlayGame}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Game
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Leaderboard</h1>
            </div>
            <p className="text-indigo-100">Top 10 Players</p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchScores}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">No scores yet. Be the first to play!</p>
                <button
                  onClick={onPlayGame}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Play Now
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {scores.map((score, index) => (
                  <div
                    key={score.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50'
                        : index === 1
                          ? 'bg-gradient-to-r from-gray-100 to-gray-50'
                          : index === 2
                            ? 'bg-gradient-to-r from-orange-100 to-orange-50'
                            : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-20">
                      <span className={`text-2xl ${getMedalColor(index)}`}>
                        {getMedalEmoji(index) || `#${index + 1}`}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{score.player_name}</p>
                      <p className="text-sm text-gray-600">
                        {score.rounds_played} round{score.rounds_played !== 1 ? 's' : ''} •
                        Avg {score.average_attempts.toFixed(1)} attempts
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {score.total_score}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
