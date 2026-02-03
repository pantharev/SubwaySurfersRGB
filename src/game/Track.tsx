import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';
import { CHUNK_LENGTH, VISIBLE_CHUNKS, LANE_WIDTH, COLORS } from '../utils/constants';
import type { Group } from 'three';

interface ChunkProps {
  position: [number, number, number];
}

function TrackChunk({ position }: ChunkProps) {
  return (
    <group position={position}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[LANE_WIDTH * 3 + 2, CHUNK_LENGTH]} />
        <meshStandardMaterial color={COLORS.track} />
      </mesh>

      {/* Lane lines */}
      {[-LANE_WIDTH - 0.05, -0.05, LANE_WIDTH - 0.05, LANE_WIDTH * 2 - 0.05].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x - LANE_WIDTH + 0.05, 0.01, 0]}>
          <planeGeometry args={[0.1, CHUNK_LENGTH]} />
          <meshStandardMaterial 
            color={COLORS.trackLines} 
            emissive={COLORS.trackLines}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Side walls (neon) */}
      <mesh position={[-LANE_WIDTH * 1.5 - 1, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, CHUNK_LENGTH]} />
        <meshStandardMaterial 
          color={COLORS.trackLines}
          emissive={COLORS.trackLines}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[LANE_WIDTH * 1.5 + 1, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, CHUNK_LENGTH]} />
        <meshStandardMaterial 
          color={COLORS.trackLines}
          emissive={COLORS.trackLines}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export function Track() {
  const groupRef = useRef<Group>(null);
  const gameState = useGameStore((s) => s.gameState);
  const speed = useGameStore((s) => s.speed);
  const offsetRef = useRef(0);

  useFrame((_, delta) => {
    if (gameState !== 'playing' || !groupRef.current) return;

    // Move track towards camera
    offsetRef.current += speed * delta;

    // Wrap offset when it exceeds chunk length
    if (offsetRef.current >= CHUNK_LENGTH) {
      offsetRef.current -= CHUNK_LENGTH;
    }

    groupRef.current.position.z = offsetRef.current;
  });

  // Generate chunk positions
  const chunks = [];
  for (let i = 0; i < VISIBLE_CHUNKS; i++) {
    const z = -i * CHUNK_LENGTH - CHUNK_LENGTH / 2;
    chunks.push(<TrackChunk key={i} position={[0, 0, z]} />);
  }

  return (
    <group ref={groupRef}>
      {chunks}
    </group>
  );
}
