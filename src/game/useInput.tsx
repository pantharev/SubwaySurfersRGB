import { useEffect, useRef } from 'react';
import { useGameStore } from '../state/gameStore';
import type { PlayerHandle } from './Player';

export function useInput(playerRef: React.RefObject<PlayerHandle | null>) {
  const gameState = useGameStore((s) => s.gameState);
  
  // Touch state
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          playerRef.current.moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          playerRef.current.moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          playerRef.current.jump();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          playerRef.current.slide();
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current || !playerRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > SWIPE_THRESHOLD || absDeltaY > SWIPE_THRESHOLD) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            playerRef.current.moveRight();
          } else {
            playerRef.current.moveLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY < 0) {
            playerRef.current.jump();
          } else {
            playerRef.current.slide();
          }
        }
      }

      touchStart.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, playerRef]);
}
