import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '../utils/constants';
import type { Mesh } from 'three';

interface CoinProps {
  position: [number, number, number];
}

const COIN_RADIUS = 0.3;
const COIN_HEIGHT = 0.08;

export function Coin({ position }: CoinProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Spin animation
    meshRef.current.rotation.y += delta * 3;
    // Bob up and down
    const time = Date.now() * 0.002;
    meshRef.current.position.y = position[1] + Math.sin(time) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[position[0], position[1], position[2]]}>
      <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, COIN_HEIGHT, 16]} />
      <meshStandardMaterial
        color={COLORS.coin}
        emissive={COLORS.coin}
        emissiveIntensity={0.6}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export interface CoinData {
  id: string;
  lane: number;
  z: number;
  y: number;
}
