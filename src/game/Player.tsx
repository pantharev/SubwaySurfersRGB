import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../state/gameStore';
import { 
  LANES, 
  LANE_SWITCH_DURATION, 
  JUMP_DURATION, 
  JUMP_HEIGHT,
  SLIDE_DURATION,
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_SLIDE_HEIGHT,
  COLORS,
} from '../utils/constants';
import type { Mesh } from 'three';

interface PlayerProps {
  onCollision: () => void;
}

export interface PlayerHandle {
  lane: number;
  isJumping: boolean;
  isSliding: boolean;
  position: { y: number };
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
  checkCollision: (obstacles: unknown[]) => boolean;
}

export const Player = forwardRef<PlayerHandle, PlayerProps>(({ onCollision: _onCollision }, ref) => {
  const meshRef = useRef<Mesh>(null);
  const gameState = useGameStore((s) => s.gameState);
  
  // Lane state
  const [currentLane, setCurrentLane] = useState(1); // 0, 1, 2 (middle = 1)
  const [targetLane, setTargetLane] = useState(1);
  const [laneProgress, setLaneProgress] = useState(1);
  
  // Jump state
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);
  
  // Slide state
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Input buffer
  const inputBuffer = useRef<'jump' | 'slide' | null>(null);

  const moveLeft = () => {
    if (targetLane > 0) {
      setCurrentLane(targetLane);
      setTargetLane(targetLane - 1);
      setLaneProgress(0);
    }
  };

  const moveRight = () => {
    if (targetLane < 2) {
      setCurrentLane(targetLane);
      setTargetLane(targetLane + 1);
      setLaneProgress(0);
    }
  };

  const jump = () => {
    if (isSliding) {
      inputBuffer.current = 'jump';
      return;
    }
    if (!isJumping) {
      setIsJumping(true);
      setJumpProgress(0);
    }
  };

  const slide = () => {
    if (isJumping) {
      inputBuffer.current = 'slide';
      return;
    }
    if (!isSliding) {
      setIsSliding(true);
      setSlideProgress(0);
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    lane: targetLane,
    isJumping,
    isSliding,
    position: { y: meshRef.current?.position.y ?? 0 },
    moveLeft,
    moveRight,
    jump,
    slide,
    checkCollision: () => false, // Placeholder
  }));

  // Animation frame
  useFrame((_, delta) => {
    if (gameState !== 'playing' || !meshRef.current) return;

    // Lane switching animation
    if (laneProgress < 1) {
      const newProgress = Math.min(laneProgress + delta / LANE_SWITCH_DURATION, 1);
      setLaneProgress(newProgress);
      
      const startX = LANES[currentLane];
      const endX = LANES[targetLane];
      meshRef.current.position.x = startX + (endX - startX) * easeOutQuad(newProgress);
    }

    // Jump animation
    if (isJumping) {
      const newProgress = jumpProgress + delta / JUMP_DURATION;
      if (newProgress >= 1) {
        setIsJumping(false);
        setJumpProgress(0);
        meshRef.current.position.y = PLAYER_HEIGHT / 2;
        
        // Check input buffer
        if (inputBuffer.current === 'slide') {
          slide();
          inputBuffer.current = null;
        }
      } else {
        setJumpProgress(newProgress);
        // Parabolic arc
        const jumpY = Math.sin(newProgress * Math.PI) * JUMP_HEIGHT;
        meshRef.current.position.y = PLAYER_HEIGHT / 2 + jumpY;
      }
    }

    // Slide animation
    if (isSliding) {
      const newProgress = slideProgress + delta / SLIDE_DURATION;
      if (newProgress >= 1) {
        setIsSliding(false);
        setSlideProgress(0);
        meshRef.current.scale.y = 1;
        meshRef.current.position.y = PLAYER_HEIGHT / 2;
        
        // Check input buffer
        if (inputBuffer.current === 'jump') {
          jump();
          inputBuffer.current = null;
        }
      } else {
        setSlideProgress(newProgress);
        // Squash during slide
        const slideScale = PLAYER_SLIDE_HEIGHT / PLAYER_HEIGHT;
        meshRef.current.scale.y = slideScale;
        meshRef.current.position.y = (PLAYER_HEIGHT * slideScale) / 2;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[LANES[1], PLAYER_HEIGHT / 2, 0]}>
      {/* Capsule approximation using cylinder + spheres */}
      <group>
        {/* Body */}
        <mesh>
          <cylinderGeometry args={[PLAYER_RADIUS, PLAYER_RADIUS, PLAYER_HEIGHT - PLAYER_RADIUS * 2, 16]} />
          <meshStandardMaterial 
            color={COLORS.player} 
            emissive={COLORS.playerEmissive}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Top sphere */}
        <mesh position={[0, (PLAYER_HEIGHT - PLAYER_RADIUS * 2) / 2, 0]}>
          <sphereGeometry args={[PLAYER_RADIUS, 16, 16]} />
          <meshStandardMaterial 
            color={COLORS.player} 
            emissive={COLORS.playerEmissive}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Bottom sphere */}
        <mesh position={[0, -(PLAYER_HEIGHT - PLAYER_RADIUS * 2) / 2, 0]}>
          <sphereGeometry args={[PLAYER_RADIUS, 16, 16]} />
          <meshStandardMaterial 
            color={COLORS.player} 
            emissive={COLORS.playerEmissive}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </mesh>
  );
});

Player.displayName = 'Player';

// Easing function
function easeOutQuad(t: number): number {
  return t * (2 - t);
}
