export interface GameState {
  targetNumber: number;
  minRange: number;
  maxRange: number;
  attemptsLeft: number;
  maxAttempts: number;
  currentGuess: string;
  message: string;
  gameStatus: 'playing' | 'won' | 'lost';
  round: number;
  totalScore: number;
  roundHistory: RoundResult[];
}

export interface RoundResult {
  round: number;
  attempts: number;
  won: boolean;
  pointsEarned: number;
}
