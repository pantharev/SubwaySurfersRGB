import { useUIStore } from '../../state/uiStore';
import { useGameStore } from '../../state/gameStore';
import { loadLocalData } from '../../utils/localStorage';
import { AuthButton } from '../components/AuthButton';

export function MainMenu() {
  const setScreen = useUIStore((s) => s.setScreen);
  const startGame = useGameStore((s) => s.startGame);
  const localData = loadLocalData();

  const handlePlay = () => {
    startGame();
    setScreen('game');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-bold mb-2 text-glow-cyan animate-pulse-glow">
        <span className="text-neon-cyan">SUBWAY</span>
      </h1>
      <h2 className="text-4xl md:text-6xl font-bold mb-12 text-glow-pink">
        <span className="text-neon-pink">RUNNERS</span>
      </h2>

      {/* Stats */}
      <div className="mb-8 text-center">
        <p className="text-gray-400 text-sm mb-1">HIGH SCORE</p>
        <p className="text-3xl font-bold text-neon-green text-glow-green">
          {localData.highScore.toLocaleString()}
        </p>
      </div>

      {/* Play Button */}
      <button
        onClick={handlePlay}
        className="relative px-12 py-4 text-2xl font-bold rounded-xl mb-6
                   bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan
                   text-white shadow-lg hover:scale-105 transition-transform duration-200
                   animate-rgb-cycle"
      >
        <span className="relative z-10">PLAY</span>
      </button>

      {/* Leaderboard Button */}
      <button
        onClick={() => setScreen('leaderboard')}
        className="px-8 py-3 text-lg font-semibold rounded-lg mb-8
                   bg-dark-700 border-2 border-neon-cyan/50 text-neon-cyan
                   hover:bg-dark-600 hover:border-neon-cyan hover:shadow-neon-cyan
                   transition-all duration-200"
      >
        LEADERBOARD
      </button>

      {/* Auth */}
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-600 text-sm">
        <p>Swipe or use Arrow Keys to play</p>
      </div>
    </div>
  );
}
