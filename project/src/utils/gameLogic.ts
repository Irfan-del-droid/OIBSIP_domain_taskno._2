import { GameState, RoundResult } from '../types/game';

export const INITIAL_MIN_RANGE = 1;
export const INITIAL_MAX_RANGE = 100;
export const INITIAL_MAX_ATTEMPTS = 10;

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const calculatePoints = (attemptsUsed: number, maxAttempts: number): number => {
  const basePoints = 100;
  const penaltyPerAttempt = 10;
  const attemptsCount = maxAttempts - attemptsUsed + 1;
  return Math.max(basePoints - (penaltyPerAttempt * (attemptsCount - 1)), 10);
};

export const createInitialGameState = (): GameState => ({
  targetNumber: generateRandomNumber(INITIAL_MIN_RANGE, INITIAL_MAX_RANGE),
  minRange: INITIAL_MIN_RANGE,
  maxRange: INITIAL_MAX_RANGE,
  attemptsLeft: INITIAL_MAX_ATTEMPTS,
  maxAttempts: INITIAL_MAX_ATTEMPTS,
  currentGuess: '',
  message: '',
  gameStatus: 'playing',
  round: 1,
  totalScore: 0,
  roundHistory: [],
});

export const startNewRound = (currentState: GameState): GameState => ({
  ...currentState,
  targetNumber: generateRandomNumber(currentState.minRange, currentState.maxRange),
  attemptsLeft: currentState.maxAttempts,
  currentGuess: '',
  message: '',
  gameStatus: 'playing',
  round: currentState.round + 1,
});

export const processGuess = (state: GameState, guess: number): GameState => {
  const newAttemptsLeft = state.attemptsLeft - 1;

  if (guess === state.targetNumber) {
    const attemptsUsed = state.maxAttempts - newAttemptsLeft;
    const points = calculatePoints(attemptsUsed, state.maxAttempts);

    const roundResult: RoundResult = {
      round: state.round,
      attempts: attemptsUsed,
      won: true,
      pointsEarned: points,
    };

    return {
      ...state,
      attemptsLeft: newAttemptsLeft,
      message: `🎉 Correct! You won ${points} points!`,
      gameStatus: 'won',
      totalScore: state.totalScore + points,
      roundHistory: [...state.roundHistory, roundResult],
    };
  }

  if (newAttemptsLeft === 0) {
    const roundResult: RoundResult = {
      round: state.round,
      attempts: state.maxAttempts,
      won: false,
      pointsEarned: 0,
    };

    return {
      ...state,
      attemptsLeft: 0,
      message: `Game Over! The number was ${state.targetNumber}`,
      gameStatus: 'lost',
      roundHistory: [...state.roundHistory, roundResult],
    };
  }

  const hint = guess < state.targetNumber ? 'higher' : 'lower';

  return {
    ...state,
    attemptsLeft: newAttemptsLeft,
    message: `Try ${hint}! ${newAttemptsLeft} attempts left`,
    currentGuess: '',
  };
};
