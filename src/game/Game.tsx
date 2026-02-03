import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';
import { useUIStore } from '../state/uiStore';
import { Player, PlayerHandle } from './Player';
import { Track } from './Track';
import { Obstacle, ObstacleData } from './Obstacle';
import { Coin, CoinData } from './Coin';
import { useInput } from './useInput';
import { useSpawner } from './useSpawner';
import { useCollision } from './useCollision';
import { SPEED_INCREMENT, MAX_SPEED } from '../utils/constants';

export function Game() {
  const gameState = useGameStore((s) => s.gameState);
  const addDistance = useGameStore((s) => s.addDistance);
  const addCoin = useGameStore((s) => s.addCoin);
  const speed = useGameStore((s) => s.speed);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const endGame = useGameStore((s) => s.endGame);
  const openGameOverModal = useUIStore((s) => s.openGameOverModal);
  
  const playerRef = useRef<PlayerHandle>(null);
  const distanceRef = useRef(0);
  
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [coins, setCoins] = useState<CoinData[]>([]);
  
  const { spawn, removeCoin, reset: resetSpawner } = useSpawner();
  const { checkObstacleCollision, checkCoinCollision } = useCollision();

  // Reset spawner when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      resetSpawner();
      distanceRef.current = 0;
    }
  }, [gameState, resetSpawner]);

  // Handle input
  useInput(playerRef);

  // Game loop
  useFrame((_, delta) => {
    if (gameState !== 'playing' || !playerRef.current) return;

    // Update distance
    const distanceDelta = speed * delta;
    distanceRef.current += distanceDelta;
    addDistance(distanceDelta);

    // Increase speed over time
    if (speed < MAX_SPEED) {
      setSpeed(Math.min(speed + SPEED_INCREMENT * delta, MAX_SPEED));
    }

    // Spawn obstacles and coins
    const spawnedItems = spawn(-distanceRef.current);
    setObstacles(spawnedItems.obstacles);
    setCoins(spawnedItems.coins);

    // Get player state
    const playerState = {
      lane: playerRef.current.lane,
      isJumping: playerRef.current.isJumping,
      isSliding: playerRef.current.isSliding,
      y: playerRef.current.position?.y ?? 0,
    };

    // Check obstacle collision
    const hitObstacle = checkObstacleCollision(
      spawnedItems.obstacles,
      playerState,
      -distanceRef.current
    );

    if (hitObstacle) {
      handleCollision();
      return;
    }

    // Check coin collection
    const collectedCoins = checkCoinCollision(
      spawnedItems.coins,
      playerState,
      -distanceRef.current
    );

    if (collectedCoins.length > 0) {
      collectedCoins.forEach(coin => {
        addCoin();
        removeCoin(coin.id);
      });
    }
  });

  const handleCollision = () => {
    endGame();
    openGameOverModal();
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00ffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ff00ff" />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 10, 80]} />

      {/* Track */}
      <Track />

      {/* Obstacles */}
      {obstacles.map((obstacle) => (
        <Obstacle
          key={obstacle.id}
          position={[obstacle.lane, 0, obstacle.z + distanceRef.current]}
          type={obstacle.type}
        />
      ))}

      {/* Coins */}
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          position={[coin.lane, coin.y, coin.z + distanceRef.current]}
        />
      ))}

      {/* Player */}
      <Player ref={playerRef} onCollision={handleCollision} />
    </>
  );
}
