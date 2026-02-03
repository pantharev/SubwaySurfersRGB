import { useEffect, useState } from 'react';
import { useUIStore } from '../../state/uiStore';
import { useAuthStore } from '../../state/authStore';
import { fetchTopLeaderboard } from '../../supabase/leaderboard';
import type { LeaderboardEntry } from '../../utils/types';

export function LeaderboardScreen() {
  const setScreen = useUIStore((s) => s.setScreen);
  const { user, guestId } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchTopLeaderboard(50);
      setEntries(data);
      setLoading(false);
    }
    load();
  }, []);

  const isCurrentPlayer = (entry: LeaderboardEntry) => {
    if (user && entry.user_id === user.id) return true;
    if (!user && entry.guest_id === guestId) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 pt-4">
        <button
          onClick={() => setScreen('menu')}
          className="px-4 py-2 rounded-lg bg-dark-700 border border-neon-pink/50 
                     text-neon-pink hover:bg-dark-600 transition-all"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-neon-cyan text-glow-cyan">
          LEADERBOARD
        </h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-2xl bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-dark-700 text-gray-400 text-sm font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-3 text-right">Score</div>
          <div className="col-span-3 text-right">Coins</div>
        </div>

        {/* Entries */}
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : entries.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No scores yet. Be the first!
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-dark-700
                           ${isCurrentPlayer(entry) 
                             ? 'bg-neon-cyan/10 border-l-4 border-l-neon-cyan' 
                             : 'hover:bg-dark-700/50'}
                           transition-colors`}
              >
                <div className={`col-span-1 font-bold ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-300' :
                  index === 2 ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div className="col-span-5 text-white truncate">
                  {entry.username || 'Anonymous'}
                  {isCurrentPlayer(entry) && (
                    <span className="ml-2 text-xs text-neon-cyan">(You)</span>
                  )}
                </div>
                <div className="col-span-3 text-right text-neon-green font-mono">
                  {entry.best_score.toLocaleString()}
                </div>
                <div className="col-span-3 text-right text-neon-yellow font-mono">
                  {entry.best_coins.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
