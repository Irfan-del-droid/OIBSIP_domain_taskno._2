import { useState } from 'react';
import { NumberGame } from './components/NumberGame';
import { Leaderboard } from './components/Leaderboard';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'leaderboard'>('game');

  return (
    <>
      {currentView === 'game' ? (
        <NumberGame />
      ) : (
        <Leaderboard onPlayGame={() => setCurrentView('game')} />
      )}

      {currentView === 'game' && (
        <button
          onClick={() => setCurrentView('leaderboard')}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors z-50"
        >
          Leaderboard
        </button>
      )}
    </>
  );
}

export default App;
