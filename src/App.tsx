import { useEffect } from 'react';
import { useUIStore } from './state/uiStore';
import { useAuthStore } from './state/authStore';
import { getSession, onAuthStateChange } from './supabase/auth';
import { MainMenu } from './ui/screens/MainMenu';
import { GameScreen } from './ui/screens/GameScreen';
import { LeaderboardScreen } from './ui/screens/LeaderboardScreen';

function App() {
  const currentScreen = useUIStore((s) => s.currentScreen);
  const { setSession, setLoading } = useAuthStore();

  // Initialize auth state
  useEffect(() => {
    // Check existing session
    getSession().then((session) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const unsubscribe = onAuthStateChange((session) => {
      setSession(session);
    });

    return () => {
      unsubscribe?.();
    };
  }, [setSession, setLoading]);

  return (
    <div className="w-full h-full bg-dark-900">
      {currentScreen === 'menu' && <MainMenu />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'leaderboard' && <LeaderboardScreen />}
    </div>
  );
}

export default App;
