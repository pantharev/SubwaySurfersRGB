import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS, PLAYER_HEIGHT } from '../utils/constants';
import type { Mesh, MeshStandardMaterial } from 'three';

export type ObstacleType = 'jump' | 'slide' | 'block';

interface ObstacleProps {
  position: [number, number, number];
  type: ObstacleType;
  onCollision?: () => void;
}

const OBSTACLE_CONFIGS = {
  jump: {
    // Low barrier - must jump over
    width: 1.8,
    height: 0.6,
    depth: 0.4,
    yOffset: 0.3,
    color: COLORS.obstacleJump,
  },
  slide: {
    // High barrier - must slide under
    width: 1.8,
    height: 0.8,
    depth: 0.4,
    yOffset: PLAYER_HEIGHT - 0.2,
    color: COLORS.obstacleSlide,
  },
  block: {
    // Full block - must switch lanes
    width: 1.8,
    height: PLAYER_HEIGHT,
    depth: 0.8,
    yOffset: PLAYER_HEIGHT / 2,
    color: COLORS.obstacleBlock,
  },
};

export function Obstacle({ position, type }: ObstacleProps) {
  const meshRef = useRef<Mesh>(null);
  const config = OBSTACLE_CONFIGS[type];

  useFrame(() => {
    if (!meshRef.current) return;
    // Pulse effect
    const time = Date.now() * 0.003;
    const material = meshRef.current.material as MeshStandardMaterial;
    material.emissiveIntensity = 0.3 + Math.sin(time) * 0.2;
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], config.yOffset, position[2]]}
    >
      <boxGeometry args={[config.width, config.height, config.depth]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export interface ObstacleData {
  id: string;
  lane: number;
  type: ObstacleType;
  z: number;
}
