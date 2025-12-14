import { useState, useCallback } from 'react';

export interface GameState {
  targetNumber: number;
  currentGuess: string;
  attempts: number;
  maxAttempts: number;
  gameStatus: 'playing' | 'won' | 'lost';
  feedback: string;
  round: number;
  totalScore: number;
  roundsWon: number;
  history: Array<{ guess: number; feedback: string }>;
}

const POINTS_PER_ROUND = 1000;
const MIN_RANGE = 1;
const MAX_RANGE = 100;

export const useGameLogic = (maxAttempts: number = 10) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    targetNumber: Math.floor(Math.random() * MAX_RANGE) + MIN_RANGE,
    currentGuess: '',
    attempts: 0,
    maxAttempts,
    gameStatus: 'playing',
    feedback: '',
    round: 1,
    totalScore: 0,
    roundsWon: 0,
    history: [],
  }));

  const makeGuess = useCallback(() => {
    const guess = parseInt(gameState.currentGuess);

    if (isNaN(guess) || guess < MIN_RANGE || guess > MAX_RANGE) {
      setGameState(prev => ({
        ...prev,
        feedback: `Please enter a number between ${MIN_RANGE} and ${MAX_RANGE}`,
      }));
      return;
    }

    const newAttempts = gameState.attempts + 1;
    let feedback = '';
    let newStatus = gameState.gameStatus;
    let newScore = gameState.totalScore;
    let newRoundsWon = gameState.roundsWon;

    if (guess === gameState.targetNumber) {
      const points = Math.floor(
        POINTS_PER_ROUND * (1 - newAttempts / (gameState.maxAttempts + 5))
      );
      newScore += points;
      newRoundsWon += 1;
      feedback = `🎉 Correct! You got it in ${newAttempts} attempt${newAttempts > 1 ? 's' : ''}! +${points} points`;
      newStatus = 'won';
    } else if (newAttempts >= gameState.maxAttempts) {
      feedback = `Game Over! The number was ${gameState.targetNumber}`;
      newStatus = 'lost';
    } else {
      const difference = Math.abs(guess - gameState.targetNumber);
      if (difference <= 5) {
        feedback = guess < gameState.targetNumber ? '🔥 Very close! Go higher!' : '🔥 Very close! Go lower!';
      } else if (difference <= 15) {
        feedback = guess < gameState.targetNumber ? '🌡️ Close! Try higher' : '🌡️ Close! Try lower';
      } else {
        feedback = guess < gameState.targetNumber ? '❄️ Too low! Try higher' : '❄️ Too high! Try lower';
      }
    }

    setGameState(prev => ({
      ...prev,
      attempts: newAttempts,
      feedback,
      gameStatus: newStatus,
      currentGuess: '',
      totalScore: newScore,
      roundsWon: newRoundsWon,
      history: [...prev.history, { guess, feedback }],
    }));
  }, [gameState]);

  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      targetNumber: Math.floor(Math.random() * MAX_RANGE) + MIN_RANGE,
      currentGuess: '',
      attempts: 0,
      maxAttempts: prev.maxAttempts,
      gameStatus: 'playing',
      feedback: '',
      round: prev.round + 1,
      totalScore: prev.totalScore,
      roundsWon: prev.roundsWon,
      history: [],
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      targetNumber: Math.floor(Math.random() * MAX_RANGE) + MIN_RANGE,
      currentGuess: '',
      attempts: 0,
      maxAttempts,
      gameStatus: 'playing',
      feedback: '',
      round: 1,
      totalScore: 0,
      roundsWon: 0,
      history: [],
    });
  }, [maxAttempts]);

  const updateGuess = useCallback((value: string) => {
    setGameState(prev => ({ ...prev, currentGuess: value }));
  }, []);

  return {
    gameState,
    makeGuess,
    startNewRound,
    resetGame,
    updateGuess,
  };
};
