import { supabase, isSupabaseConfigured } from './client';
import type { LeaderboardEntry, ScoreSubmission } from '../utils/types';

export async function fetchTopLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty leaderboard');
    return [];
  }

  const { data, error } = await supabase
    .from('leaderboard_best')
    .select('*')
    .order('best_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Fetch leaderboard error:', error.message);
    return [];
  }

  return data as LeaderboardEntry[];
}

export async function submitBestScore(submission: ScoreSubmission): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured - score not submitted to cloud');
    return false;
  }

  // Use RPC function for safe upsert with validation
  const { error } = await supabase.rpc('submit_best_score', {
    p_user_id: submission.user_id || null,
    p_guest_id: submission.guest_id || null,
    p_username: submission.username || null,
    p_score: submission.score,
    p_distance: submission.distance,
    p_coins: submission.coins,
    p_run_version: submission.run_version,
    p_platform: submission.platform,
  });

  if (error) {
    console.error('Submit score error:', error.message);
    return false;
  }

  return true;
}

export async function getPlayerBest(
  userId?: string,
  guestId?: string
): Promise<LeaderboardEntry | null> {
  if (!supabase) return null;

  let query = supabase.from('leaderboard_best').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (guestId) {
    query = query.eq('guest_id', guestId);
  } else {
    return null;
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code !== 'PGRST116') { // Not found is ok
      console.error('Get player best error:', error.message);
    }
    return null;
  }

  return data as LeaderboardEntry;
}

export { isSupabaseConfigured };
