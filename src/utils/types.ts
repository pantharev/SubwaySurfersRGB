export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export type Screen = 'menu' | 'game' | 'leaderboard';

export interface LeaderboardEntry {
  id: string;
  username: string | null;
  best_score: number;
  best_distance: number;
  best_coins: number;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  guest_id: string | null;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ScoreSubmission {
  user_id?: string;
  guest_id?: string;
  username?: string;
  score: number;
  distance: number;
  coins: number;
  run_version: string;
  platform: string;
}

export interface LocalData {
  highScore: number;
  totalCoins: number;
  guestId: string;
  guestUsername: string | null;
  settings: GameSettings;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  sensitivity: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  sensitivity: 1.0,
};

export const RUN_VERSION = '1.0.0';
export const PLATFORM = 'web';
