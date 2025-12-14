import { useState } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { useGameLogic } from '../hooks/useGameLogic';
import { supabase } from '../lib/supabase';

interface GameBoardProps {
  onGameComplete: () => void;
}

export const GameBoard = ({ onGameComplete }: GameBoardProps) => {
  const { gameState, makeGuess, startNewRound, resetGame, updateGuess } = useGameLogic(10);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.currentGuess.trim()) {
      makeGuess();
    }
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('game_scores').insert({
        player_name: playerName.trim(),
        total_score: gameState.totalScore,
        rounds_completed: gameState.roundsWon,
        total_attempts: gameState.round * 10,
      });

      if (error) throw error;

      onGameComplete();
      resetGame();
      setPlayerName('');
      setShowNameInput(false);
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndGame = () => {
    if (gameState.totalScore > 0) {
      setShowNameInput(true);
    } else {
      resetGame();
    }
  };

  const attemptsLeft = gameState.maxAttempts - gameState.attempts;
  const progressPercentage = (gameState.attempts / gameState.maxAttempts) * 100;

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold">Guess the Number</h2>
              <p className="text-blue-100 mt-1">Between 1 and 100</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Round</div>
              <div className="text-3xl font-bold">{gameState.round}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs text-blue-100 mb-1">Score</div>
              <div className="text-2xl font-bold">{gameState.totalScore}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs text-blue-100 mb-1">Rounds Won</div>
              <div className="text-2xl font-bold">{gameState.roundsWon}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs text-blue-100 mb-1">Attempts</div>
              <div className="text-2xl font-bold">
                {gameState.attempts}/{gameState.maxAttempts}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {gameState.gameStatus === 'playing' ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-600">Attempts remaining</span>
                  <span className={`font-bold ${attemptsLeft <= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                    {attemptsLeft}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progressPercentage > 70 ? 'bg-red-500' : progressPercentage > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleGuess} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={gameState.currentGuess}
                    onChange={(e) => updateGuess(e.target.value)}
                    placeholder="Enter your guess..."
                    className="flex-1 px-6 py-4 text-2xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    min="1"
                    max="100"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Guess
                  </button>
                </div>
              </form>

              {gameState.feedback && (
                <div className={`p-4 rounded-xl mb-6 text-center font-medium ${
                  gameState.feedback.includes('close') || gameState.feedback.includes('Close')
                    ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                    : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                }`}>
                  {gameState.feedback}
                </div>
              )}

              {gameState.history.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Guesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {gameState.history.map((item, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {item.guess}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className={`inline-block p-4 rounded-full mb-4 ${
                gameState.gameStatus === 'won' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Trophy className={`w-16 h-16 ${
                  gameState.gameStatus === 'won' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>

              <h3 className={`text-3xl font-bold mb-2 ${
                gameState.gameStatus === 'won' ? 'text-green-600' : 'text-red-600'
              }`}>
                {gameState.feedback}
              </h3>

              {!showNameInput ? (
                <div className="flex gap-3 justify-center mt-6">
                  {gameState.gameStatus === 'won' && (
                    <button
                      onClick={startNewRound}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Play className="w-5 h-5" />
                      Next Round
                    </button>
                  )}
                  <button
                    onClick={handleEndGame}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {gameState.totalScore > 0 ? 'Submit & Restart' : 'Play Again'}
                  </button>
                </div>
              ) : (
                <div className="mt-6 max-w-md mx-auto">
                  <p className="text-gray-600 mb-4">Enter your name to save your score!</p>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitScore}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Score'}
                    </button>
                    <button
                      onClick={() => {
                        setShowNameInput(false);
                        resetGame();
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
