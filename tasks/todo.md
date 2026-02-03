# Subway Runners - Development Progress

## Phase 0: Project Scaffolding ✅

- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies (Three.js, R3F, Supabase, Zustand, Tailwind)
- [x] Configure Tailwind with neon color palette
- [x] Set up folder structure and environment files
- [x] Create Supabase client, auth, and leaderboard modules
- [x] Create local persistence layer (localStorage)
- [x] Create Zustand stores (game, auth, UI)
- [x] Build UI scaffold (MainMenu, GameScreen, LeaderboardScreen)
- [x] Set up basic R3F canvas with placeholder player
- [x] Create README with Supabase/OAuth setup instructions
- [x] Create SQL migration file for database schema

## Phase 1: Core Gameplay ✅

- [x] Create Obstacle component with spawn system
- [x] Create Coin component with spawn system
- [x] Implement collision detection system
- [x] Wire up scoring and coin collection
- [x] Implement speed progression over time
- [x] Test gameplay loop end-to-end

## Review

### Phase 1 Summary

**New Game Components:**
- `Obstacle.tsx` - Three obstacle types (jump, slide, block) with neon pulsing effect
- `Coin.tsx` - Spinning, bobbing collectible coins
- `useSpawner.ts` - Procedural spawning system for obstacles and coins
- `useCollision.ts` - Collision detection for obstacles and coin collection

**Gameplay Features:**
- 3 obstacle types: jump over (low), slide under (high), lane block (full)
- Coin groups spawn in safe lanes opposite to obstacles
- Collision ends game, coins add to score
- Speed increases over time from 10 to max 30

### Next Steps

Phase 2 could include:
- Sound effects and music
- Particle effects on coin collection
- Power-ups (magnet, shield, multiplier)
- Different track themes/environments
- High score persistence improvements
