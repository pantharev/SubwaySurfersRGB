// Lane positions
export const LANE_WIDTH = 2;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
export const LANE_COUNT = 3;

// Player movement
export const LANE_SWITCH_DURATION = 0.15; // seconds
export const JUMP_DURATION = 0.6; // seconds
export const JUMP_HEIGHT = 1.5;
export const SLIDE_DURATION = 0.6; // seconds

// Speed settings
export const INITIAL_SPEED = 10;
export const MAX_SPEED = 30;
export const SPEED_INCREMENT = 0.1; // per second

// Track settings
export const CHUNK_LENGTH = 50;
export const VISIBLE_CHUNKS = 5;
export const SPAWN_DISTANCE = 100;
export const DESPAWN_DISTANCE = -20;

// Scoring
export const DISTANCE_SCORE_MULTIPLIER = 1;
export const COIN_VALUE = 10;

// Player dimensions
export const PLAYER_HEIGHT = 1.8;
export const PLAYER_RADIUS = 0.4;
export const PLAYER_SLIDE_HEIGHT = 0.6;

// Colors (neon theme)
export const COLORS = {
  player: '#00ffff',
  playerEmissive: '#00ffff',
  track: '#1a1a25',
  trackLines: '#ff00ff',
  coin: '#ffff00',
  obstacleJump: '#ff0066',
  obstacleSlide: '#00ff00',
  obstacleBlock: '#ff00ff',
} as const;
