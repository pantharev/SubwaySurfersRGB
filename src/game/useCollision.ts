import { useCallback } from 'react';
import { LANES, PLAYER_RADIUS, PLAYER_HEIGHT, PLAYER_SLIDE_HEIGHT } from '../utils/constants';
import type { ObstacleData } from './Obstacle';
import type { CoinData } from './Coin';

interface PlayerState {
  lane: number;
  isJumping: boolean;
  isSliding: boolean;
  y: number;
}

const COLLISION_THRESHOLD_Z = 1.5; // How close player needs to be to collide
const COIN_COLLECT_RADIUS = 1.0;

export function useCollision() {
  const checkObstacleCollision = useCallback((
    obstacles: ObstacleData[],
    playerState: PlayerState,
    playerZ: number
  ): ObstacleData | null => {
    const playerLane = LANES[playerState.lane];
    
    for (const obstacle of obstacles) {
      // Check if obstacle is in range
      const zDist = Math.abs(obstacle.z - playerZ);
      if (zDist > COLLISION_THRESHOLD_Z) continue;
      
      // Check if same lane
      if (Math.abs(obstacle.lane - playerLane) > 0.1) continue;
      
      // Check collision based on obstacle type and player state
      switch (obstacle.type) {
        case 'jump':
          // Can avoid by jumping
          if (!playerState.isJumping) {
            return obstacle;
          }
          break;
        case 'slide':
          // Can avoid by sliding
          if (!playerState.isSliding) {
            return obstacle;
          }
          break;
        case 'block':
          // Must be in different lane - already checked above
          return obstacle;
      }
    }
    
    return null;
  }, []);

  const checkCoinCollision = useCallback((
    coins: CoinData[],
    playerState: PlayerState,
    playerZ: number
  ): CoinData[] => {
    const playerLane = LANES[playerState.lane];
    const collectedCoins: CoinData[] = [];
    
    for (const coin of coins) {
      // Check if coin is in range
      const zDist = Math.abs(coin.z - playerZ);
      if (zDist > COIN_COLLECT_RADIUS) continue;
      
      // Check if same lane
      if (Math.abs(coin.lane - playerLane) > PLAYER_RADIUS + 0.3) continue;
      
      // Check vertical overlap
      const playerTop = playerState.isSliding ? PLAYER_SLIDE_HEIGHT : PLAYER_HEIGHT;
      const playerBottom = playerState.y;
      const coinY = coin.y;
      
      if (coinY >= playerBottom && coinY <= playerTop + playerState.y) {
        collectedCoins.push(coin);
      }
    }
    
    return collectedCoins;
  }, []);

  return { checkObstacleCollision, checkCoinCollision };
}
