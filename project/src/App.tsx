import { useState } from 'react';
import { Dices } from 'lucide-react';
import { GameState } from './types/game';
import { createInitialGameState, processGuess, startNewRound } from './utils/gameLogic';
import { GameStats } from './components/GameStats';
import { GameInput } from './components/GameInput';
import { GameMessage } from './components/GameMessage';
import { GameActions } from './components/GameActions';
import { RoundHistory } from './components/RoundHistory';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleGuess = () => {
    const guess = parseInt(gameState.currentGuess);

    if (isNaN(guess)) {
      return;
    }

    if (guess < gameState.minRange || guess > gameState.maxRange) {
      setGameState({
        ...gameState,
        message: `Please enter a number between ${gameState.minRange} and ${gameState.maxRange}`,
      });
      return;
    }

    const newState = processGuess(gameState, guess);
    setGameState(newState);
  };

  const handleNewRound = () => {
    setGameState(startNewRound(gameState));
  };

  const handleRestart = () => {
    setGameState(createInitialGameState());
  };

  const handleInputChange = (value: string) => {
    setGameState({ ...gameState, currentGuess: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Dices className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">Guess the Number</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Can you guess the secret number? Test your luck and skills!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <GameStats
            round={gameState.round}
            totalScore={gameState.totalScore}
            attemptsLeft={gameState.attemptsLeft}
            maxAttempts={gameState.maxAttempts}
          />

          <GameMessage message={gameState.message} status={gameState.gameStatus} />

          <GameInput
            value={gameState.currentGuess}
            onChange={handleInputChange}
            onSubmit={handleGuess}
            disabled={gameState.gameStatus !== 'playing'}
            minRange={gameState.minRange}
            maxRange={gameState.maxRange}
          />

          <GameActions
            gameStatus={gameState.gameStatus}
            onNewRound={handleNewRound}
            onRestart={handleRestart}
          />
        </div>

        <RoundHistory history={gameState.roundHistory} />
      </div>
    </div>
  );
}

export default App;
