import { useRef, useCallback } from 'react';
import { LANES, CHUNK_LENGTH } from '../utils/constants';
import type { ObstacleType, ObstacleData } from './Obstacle';
import type { CoinData } from './Coin';

interface SpawnerState {
  obstacles: ObstacleData[];
  coins: CoinData[];
  lastSpawnZ: number;
}

const SPAWN_INTERVAL = 15; // Distance between spawn points
const OBSTACLE_CHANCE = 0.6; // 60% chance for obstacle at spawn point
const COIN_CHANCE = 0.4; // 40% chance for coins at spawn point
const COIN_GROUP_SIZE = 3; // Coins in a row

let idCounter = 0;
const generateId = () => `item_${++idCounter}`;

const OBSTACLE_TYPES: ObstacleType[] = ['jump', 'slide', 'block'];

function randomLane(): number {
  return LANES[Math.floor(Math.random() * LANES.length)];
}

function randomObstacleType(): ObstacleType {
  return OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
}

export function useSpawner() {
  const stateRef = useRef<SpawnerState>({
    obstacles: [],
    coins: [],
    lastSpawnZ: -50,
  });

  const spawn = useCallback((currentZ: number) => {
    const state = stateRef.current;
    const spawnAheadDistance = CHUNK_LENGTH * 3;
    const despawnBehindDistance = 10;

    // Spawn new items ahead
    while (state.lastSpawnZ > currentZ - spawnAheadDistance) {
      state.lastSpawnZ -= SPAWN_INTERVAL;
      
      // Decide what to spawn
      const roll = Math.random();
      
      if (roll < OBSTACLE_CHANCE) {
        // Spawn obstacle
        const lane = randomLane();
        const type = randomObstacleType();
        
        state.obstacles.push({
          id: generateId(),
          lane,
          type,
          z: state.lastSpawnZ,
        });
        
        // Maybe spawn coins in other lanes
        if (Math.random() < 0.5) {
          const otherLanes = LANES.filter(l => l !== lane);
          const coinLane = otherLanes[Math.floor(Math.random() * otherLanes.length)];
          for (let i = 0; i < COIN_GROUP_SIZE; i++) {
            state.coins.push({
              id: generateId(),
              lane: coinLane,
              z: state.lastSpawnZ - i * 2,
              y: 1,
            });
          }
        }
      } else if (roll < OBSTACLE_CHANCE + COIN_CHANCE) {
        // Spawn coin group
        const lane = randomLane();
        for (let i = 0; i < COIN_GROUP_SIZE; i++) {
          state.coins.push({
            id: generateId(),
            lane,
            z: state.lastSpawnZ - i * 2,
            y: 1,
          });
        }
      }
    }

    // Despawn items behind player
    state.obstacles = state.obstacles.filter(o => o.z < currentZ + despawnBehindDistance);
    state.coins = state.coins.filter(c => c.z < currentZ + despawnBehindDistance);

    return {
      obstacles: state.obstacles,
      coins: state.coins,
    };
  }, []);

  const removeObstacle = useCallback((id: string) => {
    stateRef.current.obstacles = stateRef.current.obstacles.filter(o => o.id !== id);
  }, []);

  const removeCoin = useCallback((id: string) => {
    stateRef.current.coins = stateRef.current.coins.filter(c => c.id !== id);
  }, []);

  const reset = useCallback(() => {
    stateRef.current = {
      obstacles: [],
      coins: [],
      lastSpawnZ: -50,
    };
    idCounter = 0;
  }, []);

  return { spawn, removeObstacle, removeCoin, reset };
}
