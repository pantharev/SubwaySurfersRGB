import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../state/gameStore';
import { useUIStore } from '../../state/uiStore';
import { HUD } from '../overlays/HUD';
import { GameOverModal } from '../overlays/GameOverModal';
import { Game } from '../../game/Game';

export function GameScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const showGameOverModal = useUIStore((s) => s.showGameOverModal);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        className="touch-none"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Game />
      </Canvas>

      {/* HUD Overlay */}
      {gameState === 'playing' && <HUD />}

      {/* Game Over Modal */}
      {showGameOverModal && <GameOverModal />}
    </div>
  );
}
