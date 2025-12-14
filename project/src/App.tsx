import { useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { Gamepad2, Trophy } from 'lucide-react';

function App() {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard'>('game');

  const handleGameComplete = () => {
    setRefreshLeaderboard(prev => prev + 1);
    setActiveTab('leaderboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Number Guessing Game
          </h1>
          <p className="text-gray-600 text-lg">
            Test your intuition and climb the leaderboard!
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white rounded-xl shadow-lg p-1">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              Play Game
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Trophy className="w-5 h-5" />
              Leaderboard
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {activeTab === 'game' ? (
            <GameBoard onGameComplete={handleGameComplete} />
          ) : (
            <Leaderboard key={refreshLeaderboard} />
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-3">How to Play</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="space-y-1">
                <div className="font-semibold text-blue-600">1. Guess the Number</div>
                <div className="text-sm text-gray-600">Think of a number between 1-100</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-cyan-600">2. Get Feedback</div>
                <div className="text-sm text-gray-600">Higher, lower, or spot on!</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-purple-600">3. Win Rounds</div>
                <div className="text-sm text-gray-600">Fewer attempts = more points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
