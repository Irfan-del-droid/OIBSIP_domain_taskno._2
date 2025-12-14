import React, { useState, useEffect } from 'react';
import { RotateCcw, Send, Trophy } from 'lucide-react';
import { saveGameScore } from '../lib/supabase';

interface Round {
  secretNumber: number;
  attemptsLeft: number;
  guessed: boolean;
  feedback: string;
}

interface GameStats {
  currentRound: number;
  totalScore: number;
  totalAttempts: number;
  playerName: string;
}

const MAX_ATTEMPTS = 7;
const MAX_ROUNDS = 5;

export function NumberGame() {
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [round, setRound] = useState<Round>({
    secretNumber: generateRandomNumber(),
    attemptsLeft: MAX_ATTEMPTS,
    guessed: false,
    feedback: '',
  });
  const [stats, setStats] = useState<GameStats>({
    currentRound: 1,
    totalScore: 0,
    totalAttempts: 0,
    playerName: '',
  });
  const [guesses, setGuesses] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  const handleStartGame = () => {
    if (playerName.trim()) {
      setGameStarted(true);
      setStats({
        currentRound: 1,
        totalScore: 0,
        totalAttempts: 0,
        playerName: playerName.trim(),
      });
    }
  };

  const calculatePoints = (attemptsUsed: number): number => {
    const basePoints = 100;
    const penalty = (MAX_ATTEMPTS - attemptsUsed) * 10;
    return basePoints + Math.max(penalty, 0);
  };

  const handleGuess = () => {
    if (!currentGuess.trim()) return;

    const guess = parseInt(currentGuess);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      setRound((prev) => ({
        ...prev,
        feedback: 'Please enter a number between 1 and 100',
      }));
      setCurrentGuess('');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    const attemptsUsed = MAX_ATTEMPTS - round.attemptsLeft + 1;
    const newTotalAttempts = stats.totalAttempts + attemptsUsed;

    if (guess === round.secretNumber) {
      const points = calculatePoints(attemptsUsed);
      const newTotalScore = stats.totalScore + points;

      if (stats.currentRound === MAX_ROUNDS) {
        setRound((prev) => ({
          ...prev,
          guessed: true,
          feedback: `Correct! You guessed the number ${round.secretNumber} in ${attemptsUsed} attempt(s)!`,
        }));
        setStats({
          ...stats,
          totalScore: newTotalScore,
          totalAttempts: newTotalAttempts,
        });
        setGameOver(true);
      } else {
        setRound((prev) => ({
          ...prev,
          guessed: true,
          feedback: `Correct! You guessed the number ${round.secretNumber} in ${attemptsUsed} attempt(s)! Earned ${points} points.`,
        }));
        setStats({
          currentRound: stats.currentRound + 1,
          totalScore: newTotalScore,
          totalAttempts: newTotalAttempts,
          playerName: stats.playerName,
        });
        setTimeout(() => {
          setRound({
            secretNumber: generateRandomNumber(),
            attemptsLeft: MAX_ATTEMPTS,
            guessed: false,
            feedback: '',
          });
          setGuesses([]);
          setCurrentGuess('');
        }, 2000);
      }
    } else if (round.attemptsLeft > 1) {
      const isHigher = guess < round.secretNumber;
      setRound((prev) => ({
        ...prev,
        attemptsLeft: prev.attemptsLeft - 1,
        feedback: `Too ${isHigher ? 'low' : 'high'}! Try again.`,
      }));
      setCurrentGuess('');
    } else {
      setRound((prev) => ({
        ...prev,
        attemptsLeft: 0,
        feedback: `Game Over! The number was ${round.secretNumber}.`,
      }));
      setStats({
        ...stats,
        totalAttempts: newTotalAttempts,
      });
      setTimeout(() => {
        if (stats.currentRound === MAX_ROUNDS) {
          setGameOver(true);
        } else {
          setStats({
            currentRound: stats.currentRound + 1,
            totalScore: stats.totalScore,
            totalAttempts: newTotalAttempts,
            playerName: stats.playerName,
          });
          setRound({
            secretNumber: generateRandomNumber(),
            attemptsLeft: MAX_ATTEMPTS,
            guessed: false,
            feedback: '',
          });
          setGuesses([]);
          setCurrentGuess('');
        }
      }, 2000);
    }
  };

  const handleSaveScore = async () => {
    setSaving(true);
    try {
      await saveGameScore(
        stats.playerName,
        stats.totalScore,
        stats.totalAttempts,
        stats.currentRound - 1
      );
    } catch (error) {
      console.error('Failed to save score:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlayerName('');
    setCurrentGuess('');
    setGuesses([]);
    setRound({
      secretNumber: generateRandomNumber(),
      attemptsLeft: MAX_ATTEMPTS,
      guessed: false,
      feedback: '',
    });
    setStats({
      currentRound: 1,
      totalScore: 0,
      totalAttempts: 0,
      playerName: '',
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <Trophy className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            Number Guessing Game
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Guess the secret number between 1 and 100!
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Rounds:</span> {MAX_ROUNDS}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Attempts per round:</span>{' '}
                {MAX_ATTEMPTS}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Scoring:</span> Up to 100 points
                per round
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button
            onClick={handleStartGame}
            disabled={!playerName.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Over!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations, {stats.playerName}!
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Final Score</p>
              <p className="text-5xl font-bold text-indigo-600">
                {stats.totalScore}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Rounds Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.currentRound - 1}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAttempts}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveScore}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg mb-3 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Score to Leaderboard'}
          </button>
          <button
            onClick={handlePlayAgain}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Number Guessing Game</h1>
              <button
                onClick={handlePlayAgain}
                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Quit
              </button>
            </div>
            <p className="text-lg font-semibold">
              Round {stats.currentRound} of {MAX_ROUNDS}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm font-semibold">Score</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.totalScore}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm font-semibold">Attempts Left</p>
                <p className="text-3xl font-bold text-blue-600">
                  {round.attemptsLeft}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm font-semibold">Guesses</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {guesses.length}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 text-center text-lg font-semibold mb-4">
                Guess a number between 1 and 100
              </p>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Enter your guess"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  disabled={round.guessed || round.attemptsLeft === 0}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-lg disabled:bg-gray-100"
                />
                <button
                  onClick={handleGuess}
                  disabled={
                    round.guessed || round.attemptsLeft === 0 || !currentGuess.trim()
                  }
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {round.feedback && (
              <div
                className={`p-4 rounded-lg mb-6 text-center font-semibold ${
                  round.guessed
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : round.attemptsLeft === 0
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                }`}
              >
                {round.feedback}
              </div>
            )}

            {guesses.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 font-semibold mb-3">Your guesses:</p>
                <div className="flex flex-wrap gap-2">
                  {guesses.map((guess, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {guess}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
