import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameScore {
  id: string;
  player_name: string;
  total_score: number;
  rounds_played: number;
  average_attempts: number;
  created_at: string;
}

export async function saveGameScore(
  playerName: string,
  score: number,
  attemptsUsed: number,
  roundsPlayed: number
) {
  const averageAttempts = attemptsUsed / roundsPlayed;

  const { data, error } = await supabase
    .from('game_scores')
    .insert([
      {
        player_name: playerName,
        total_score: score,
        rounds_played: roundsPlayed,
        average_attempts: averageAttempts,
      },
    ])
    .select();

  if (error) {
    console.error('Error saving game score:', error);
    throw error;
  }

  return data;
}

export async function getTopScores(limit: number = 10) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*')
    .order('total_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top scores:', error);
    throw error;
  }

  return data as GameScore[];
}

export async function getPlayerStats(playerName: string) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*')
    .eq('player_name', playerName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }

  return data as GameScore[];
}
