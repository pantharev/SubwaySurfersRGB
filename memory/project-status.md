# Subway Runners - Project Status

## Current State: Phase 1 Complete ✅

Core gameplay loop is functional with obstacles, coins, and collision detection.

## What's Been Built

### Phase 0: Infrastructure
- **Vite + React + TypeScript** project with strict mode
- **Tailwind CSS** with custom neon color palette
- **Zustand** stores for game, auth, and UI state
- **Supabase** client, auth, and leaderboard modules
- **SQL migration** for database schema

### Phase 1: Core Gameplay
- **Obstacle spawning** - 3 types (jump, slide, block)
- **Coin spawning** - Groups in safe lanes
- **Collision detection** - Game over on hit, coin collection
- **Speed progression** - 10 → 30 over time
- **Scoring** - Distance + coins

## File Structure

```
e:\Projects\subway_runners\
├── src/
│   ├── game/
│   │   ├── Game.tsx         # Main game scene + loop
│   │   ├── Player.tsx       # 3-lane movement, jump, slide
│   │   ├── Track.tsx        # Endless track chunks
│   │   ├── Obstacle.tsx     # Jump/slide/block obstacles
│   │   ├── Coin.tsx         # Collectible coins
│   │   ├── useInput.tsx     # Keyboard + touch input
│   │   ├── useSpawner.ts    # Procedural spawning
│   │   └── useCollision.ts  # Collision detection
│   ├── ui/
│   │   ├── screens/         # MainMenu, GameScreen, Leaderboard
│   │   ├── overlays/        # HUD, GameOverModal
│   │   └── components/      # AuthButton
│   ├── supabase/            # client, auth, leaderboard
│   ├── state/               # gameStore, authStore, uiStore
│   └── utils/               # types, constants, localStorage
├── supabase/migrations/     # SQL schema
├── tasks/todo.md            # Progress tracking
└── README.md                # Setup instructions
```

## To Run

```bash
cd e:\Projects\subway_runners
npm run dev
```

Opens at: http://localhost:5173

## Controls

- **Arrow keys / WASD**: Move left/right, jump (up), slide (down)
- **Touch**: Swipe gestures

## Configuration Needed (for leaderboards)

1. Create Supabase project
2. Run `supabase/migrations/001_initial_schema.sql`
3. Configure Google OAuth
4. Add credentials to `.env`

See `README.md` for details.
