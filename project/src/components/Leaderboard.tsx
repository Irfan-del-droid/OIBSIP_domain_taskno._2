import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { supabase, GameScore } from '../lib/supabase';

export const Leaderboard = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('total_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  const getRankClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300';
      case 2:
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Leaderboard</h2>
          </div>
          <p className="text-purple-100">Top 10 Players</p>
        </div>

        <div className="p-6">
          {scores.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No scores yet!</p>
              <p className="text-sm mt-2">Be the first to make the leaderboard</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className={`${getRankClass(index)} rounded-xl p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {score.player_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {score.rounds_completed} round{score.rounds_completed !== 1 ? 's' : ''} completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {score.total_score}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
