import { useState } from 'react';
import { useGameStore } from '../../state/gameStore';
import { useUIStore } from '../../state/uiStore';
import { useAuthStore } from '../../state/authStore';
import { updateHighScore, setGuestUsername as saveGuestUsername, loadLocalData } from '../../utils/localStorage';
import { submitBestScore } from '../../supabase/leaderboard';
import { signInWithGoogle, isSupabaseConfigured } from '../../supabase/auth';
import { RUN_VERSION, PLATFORM } from '../../utils/types';

export function GameOverModal() {
  const { score, distance, coins, resetGame, startGame } = useGameStore();
  const { closeGameOverModal, setScreen } = useUIStore();
  const { user, guestId, guestUsername, setGuestUsername } = useAuthStore();
  
  const [username, setUsername] = useState(guestUsername || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const localData = loadLocalData();
  const isNewHighScore = score > localData.highScore;

  // Update local high score
  if (isNewHighScore) {
    updateHighScore(score);
  }

  const handleRestart = () => {
    closeGameOverModal();
    startGame();
  };

  const handleMainMenu = () => {
    closeGameOverModal();
    resetGame();
    setScreen('menu');
  };

  const handleSubmitScore = async (asGuest: boolean) => {
    setIsSubmitting(true);
    
    try {
      if (asGuest && username.trim().length >= 3) {
        saveGuestUsername(username.trim());
        setGuestUsername(username.trim());
      }

      await submitBestScore({
        user_id: user?.id,
        guest_id: asGuest ? guestId : undefined,
        username: user?.email?.split('@')[0] || username.trim() || 'Anonymous',
        score,
        distance: Math.floor(distance),
        coins,
        run_version: RUN_VERSION,
        platform: PLATFORM,
      });
      
      setSubmitted(true);
    } catch (e) {
      console.error('Failed to submit score:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-2xl border border-dark-600 p-6 max-w-md w-full">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-2 text-neon-pink text-glow-pink">
          GAME OVER
        </h2>
        
        {isNewHighScore && (
          <p className="text-center text-neon-green text-glow-green mb-4 animate-pulse">
            🎉 NEW HIGH SCORE! 🎉
          </p>
        )}

        {/* Score Breakdown */}
        <div className="bg-dark-900 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Score</span>
            <span className="text-neon-cyan font-mono font-bold">
              {Math.floor(score).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Distance</span>
            <span className="text-white font-mono">
              {Math.floor(distance).toLocaleString()}m
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Coins</span>
            <span className="text-neon-yellow font-mono">
              🪙 {coins}
            </span>
          </div>
        </div>

        {/* Save to Leaderboard Section */}
        {isSupabaseConfigured && !submitted && (
          <div className="mb-6 space-y-3">
            <p className="text-sm text-gray-400 text-center">Save to Leaderboard</p>
            
            {user ? (
              <button
                onClick={() => handleSubmitScore(false)}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-neon-cyan/20 border border-neon-cyan 
                           text-neon-cyan font-semibold hover:bg-neon-cyan/30 
                           disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Saving...' : `Save as ${user.email?.split('@')[0]}`}
              </button>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter username (3-16 chars)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.slice(0, 16))}
                    className="flex-1 px-3 py-2 rounded-lg bg-dark-900 border border-dark-600 
                               text-white placeholder-gray-500 focus:border-neon-cyan 
                               focus:outline-none"
                  />
                  <button
                    onClick={() => handleSubmitScore(true)}
                    disabled={isSubmitting || username.trim().length < 3}
                    className="px-4 py-2 rounded-lg bg-neon-green/20 border border-neon-green 
                               text-neon-green font-semibold hover:bg-neon-green/30 
                               disabled:opacity-50 transition-colors"
                  >
                    Save
                  </button>
                </div>
                
                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2 rounded-lg bg-dark-700 border border-gray-600 
                             text-gray-300 hover:bg-dark-600 transition-colors text-sm"
                >
                  Or sign in with Google
                </button>
              </>
            )}
          </div>
        )}

        {submitted && (
          <div className="mb-6 text-center text-neon-green">
            ✓ Score saved to leaderboard!
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full py-4 rounded-xl text-xl font-bold
                       bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan
                       text-white hover:scale-[1.02] transition-transform"
          >
            PLAY AGAIN
          </button>
          
          <button
            onClick={handleMainMenu}
            className="w-full py-3 rounded-lg bg-dark-700 border border-dark-600 
                       text-gray-300 hover:bg-dark-600 transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
