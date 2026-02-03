import { useGameStore } from '../../state/gameStore';
import { useUIStore } from '../../state/uiStore';

export function HUD() {
  const { score, coins } = useGameStore();
  const { setScreen } = useUIStore();
  const pauseGame = useGameStore((s) => s.pauseGame);

  const handlePause = () => {
    pauseGame();
    setScreen('menu');
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
      {/* Score */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-neon-cyan/30">
        <p className="text-xs text-gray-400 uppercase">Score</p>
        <p className="text-2xl font-bold text-neon-cyan font-mono">
          {Math.floor(score).toLocaleString()}
        </p>
      </div>

      {/* Coins */}
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-neon-yellow/30">
        <p className="text-xs text-gray-400 uppercase">Coins</p>
        <p className="text-2xl font-bold text-neon-yellow font-mono flex items-center gap-1">
          <span className="text-lg">🪙</span>
          {coins}
        </p>
      </div>

      {/* Pause Button */}
      <button
        onClick={handlePause}
        className="pointer-events-auto bg-dark-800/80 backdrop-blur-sm rounded-lg px-3 py-2 
                   border border-neon-pink/30 text-neon-pink hover:bg-dark-700 transition-colors"
      >
        ⏸️
      </button>
    </div>
  );
}
