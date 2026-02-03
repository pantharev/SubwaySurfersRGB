# 3D Endless Runner Implementation Plan

Build a Subway Surfers-style 3D endless runner with React + Vite + Three.js (R3F) + Supabase, featuring guest play, Google OAuth, and cloud leaderboards.

---

## Design Direction

- **Visual Style**: Neon/RGB aesthetic - glowing edges, color cycling, cyberpunk vibes
- **3D Assets**: Primitive shapes (capsules, boxes) for MVP - custom models later
- **UI Framework**: Tailwind CSS for styling

---

## Phase 0: Project Scaffold + Supabase Plumbing

### 0.1 Initialize Project
- [ ] Create Vite + React + TypeScript project
- [ ] Install dependencies:
  - `three`, `@react-three/fiber`, `@react-three/drei`
  - `@supabase/supabase-js`
  - `zustand` (state management)
  - `tailwindcss`, `autoprefixer`, `postcss`
- [ ] Configure TypeScript strict mode
- [ ] Configure Tailwind with custom neon color palette
- [ ] Set up folder structure:
  ```
  src/
    game/        # Three/R3F game loop, player, obstacles
    ui/          # React menus, overlays, modals
    supabase/    # Client, auth, API calls
    state/       # Zustand stores
    utils/       # Helpers, constants
  ```

### 0.2 Environment & Config
- [ ] Create `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Create `.env.example` (no secrets)
- [ ] Add `.env` to `.gitignore`

### 0.3 Supabase Client Module
- [ ] `src/supabase/client.ts` - createClient singleton
- [ ] `src/supabase/auth.ts` - signInWithGoogle, signOut, getSession, onAuthStateChange
- [ ] `src/supabase/leaderboard.ts` - fetchTopLeaderboard, submitBestScore

### 0.4 Supabase Database Schema (SQL migrations)
- [ ] Document/create `profiles` table
- [ ] Document/create `leaderboard_best` table
- [ ] Set up RLS policies
- [ ] Create `submit_best_score` RPC function

### 0.5 Local Persistence Layer
- [ ] `src/utils/localStorage.ts` - get/set helpers for:
  - `localHighScore`, `localTotalCoins`
  - `guestId` (auto-generated UUID)
  - `guestUsername`
  - `settings` (mute, etc.)

### 0.6 State Management
- [ ] `src/state/gameStore.ts` - Zustand store for game state (score, coins, speed, gameState)
- [ ] `src/state/authStore.ts` - Zustand store for auth (user, session, guestId)
- [ ] `src/state/uiStore.ts` - Zustand store for UI (currentScreen, modals)

### 0.7 UI Scaffold
- [ ] `App.tsx` - Router/screen manager
- [ ] `src/ui/screens/MainMenu.tsx` - Play, Leaderboard, Sign In/Out buttons
- [ ] `src/ui/screens/LeaderboardScreen.tsx` - Top 50 list (dummy data initially)
- [ ] `src/ui/screens/GameScreen.tsx` - Canvas + HUD overlay
- [ ] `src/ui/components/AuthButton.tsx` - Sign in/out state
- [ ] `src/ui/overlays/GameOverModal.tsx` - Score, save options, restart

### 0.8 Basic Canvas Setup
- [ ] R3F Canvas rendering in GameScreen
- [ ] Basic lighting and camera
- [ ] Placeholder player mesh (capsule)

---

## Phase 1: Core Runner Feel

### 1.1 Player Controller
- [ ] `src/game/Player.tsx` - 3D capsule/character
- [ ] 3-lane positions: x = [-2, 0, +2]
- [ ] Lane change with lerp (120-180ms)
- [ ] Input handling (keyboard: arrows/WASD, touch: swipes)

### 1.2 Jump Mechanics
- [ ] Jump arc (~600ms, peak ~1.5 units)
- [ ] Gravity simulation
- [ ] Input buffering (queue next action during animation)

### 1.3 Slide Mechanics
- [ ] Slide animation (~600ms)
- [ ] Collider height reduction (~45%)
- [ ] Return to standing after slide

### 1.4 Camera System
- [ ] `src/game/Camera.tsx` - Third-person follow camera
- [ ] Smooth follow with offset
- [ ] Slight look-ahead

---

## Phase 2: Endless Track + Pooling

### 2.1 Track Chunk System
- [ ] `src/game/TrackChunk.tsx` - Single track segment
- [ ] `src/game/TrackManager.tsx` - Chunk pooling/recycling
- [ ] Spawn chunks ahead, recycle behind player

### 2.2 Performance Optimization
- [ ] Object pooling for chunks
- [ ] No allocations per frame
- [ ] Instanced rendering where applicable

---

## Phase 3: Obstacles + Collision + Game Over

### 3.1 Obstacle Types
- [ ] `src/game/obstacles/LowBarrier.tsx` - Jump over
- [ ] `src/game/obstacles/HighBarrier.tsx` - Slide under
- [ ] `src/game/obstacles/Blocker.tsx` - Lane change required

### 3.2 Spawn System
- [ ] `src/game/ObstacleSpawner.tsx` - Pattern-based spawning
- [ ] Ensure at least one survivable lane path
- [ ] Pooling for obstacles

### 3.3 Collision Detection
- [ ] `src/game/CollisionSystem.ts` - AABB or sphere collision
- [ ] Player hitbox adjusts for jump/slide states
- [ ] Collision → game over trigger

### 3.4 Game Over Flow
- [ ] Stop game loop
- [ ] Show GameOverModal
- [ ] Update local high score if beaten

---

## Phase 4: Coins + Scoring + Speed Ramp

### 4.1 Coin System
- [ ] `src/game/Coin.tsx` - Collectable coin mesh
- [ ] `src/game/CoinSpawner.tsx` - Lines and arcs of coins
- [ ] Coin pooling

### 4.2 Scoring
- [ ] Distance-based score (increases with time)
- [ ] Coin pickup adds to coin count
- [ ] Display in HUD

### 4.3 Difficulty Progression
- [ ] Speed increases over time/distance
- [ ] Spawn density increases gradually
- [ ] Cap at maximum difficulty

---

## Phase 5: Saving Scores + Full Integration

### 5.1 Score Submission Flow
- [ ] On game over:
  - Update local best if beaten
  - If signed in: auto-submit to Supabase
  - If guest: show username input → submit with guestId

### 5.2 Leaderboard Integration
- [ ] Fetch and display real data
- [ ] Highlight current player's rank
- [ ] Show personal best

### 5.3 Polish
- [ ] Restart < 1 second
- [ ] Touch controls for mobile
- [ ] Sound effects toggle
- [ ] Loading states

---

## File Structure (Final)

```
subway_runners/
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── game/
    │   ├── Player.tsx
    │   ├── Camera.tsx
    │   ├── TrackChunk.tsx
    │   ├── TrackManager.tsx
    │   ├── Coin.tsx
    │   ├── CoinSpawner.tsx
    │   ├── ObstacleSpawner.tsx
    │   ├── CollisionSystem.ts
    │   └── obstacles/
    │       ├── LowBarrier.tsx
    │       ├── HighBarrier.tsx
    │       └── Blocker.tsx
    ├── ui/
    │   ├── screens/
    │   │   ├── MainMenu.tsx
    │   │   ├── GameScreen.tsx
    │   │   └── LeaderboardScreen.tsx
    │   ├── overlays/
    │   │   ├── HUD.tsx
    │   │   └── GameOverModal.tsx
    │   └── components/
    │       └── AuthButton.tsx
    ├── supabase/
    │   ├── client.ts
    │   ├── auth.ts
    │   └── leaderboard.ts
    ├── state/
    │   ├── gameStore.ts
    │   ├── authStore.ts
    │   └── uiStore.ts
    └── utils/
        ├── localStorage.ts
        ├── constants.ts
        └── types.ts
```

---

## Supabase Schema Summary

### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT,
  avatar_url TEXT
);
```

### `leaderboard_best` table
```sql
CREATE TABLE leaderboard_best (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  guest_id UUID,
  username TEXT,
  best_score BIGINT NOT NULL,
  best_distance BIGINT NOT NULL,
  best_coins INT NOT NULL,
  run_version TEXT NOT NULL,
  platform TEXT,
  CONSTRAINT user_or_guest CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);
```

---

## Acceptance Criteria Checklist

- [ ] Can play instantly as guest
- [ ] Movement/jump/slide responsive on mobile + desktop
- [ ] Endless track runs without memory leaks
- [ ] Score + coins track correctly
- [ ] Local high score persists across refresh
- [ ] Google sign-in works, identity reflected in UI
- [ ] Leaderboard shows top 50 from Supabase
- [ ] Best score submits correctly (only updates if better)
- [ ] Restart < 1 second

---

## Notes

- **Offline-first**: Game must work fully without Supabase
- **Security**: RLS policies + RPC for score submission
- **Performance**: Target 60 FPS on mid-tier phones
- **Anti-cheat MVP**: Rate limiting + basic sanity checks only

---

## README.md Contents (To Include)

### Supabase Project Setup Instructions

1. **Create Supabase Account & Project**
   - Go to https://supabase.com
   - Sign up / Sign in
   - Click "New Project"
   - Choose org, name project, set database password, select region
   - Wait for project to provision (~2 min)

2. **Get API Keys**
   - Go to Project Settings → API
   - Copy `Project URL` → `VITE_SUPABASE_URL`
   - Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

3. **Run Database Migrations**
   - Go to SQL Editor
   - Paste contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

### Google OAuth Setup Instructions

1. **Google Cloud Console**
   - Go to https://console.cloud.google.com
   - Create new project (or select existing)
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen if prompted (External, fill required fields)
   - Application type: Web application
   - Add Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

2. **Supabase Auth Provider**
   - In Supabase Dashboard → Authentication → Providers
   - Find Google, toggle enabled
   - Paste Client ID and Client Secret
   - Save

3. **Site URL Configuration**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Set Site URL to your app URL (e.g., `http://localhost:5173` for dev)
   - Add redirect URLs as needed

---

## Neon/RGB Styling Approach

### Tailwind Custom Colors
```js
// tailwind.config.js
colors: {
  neon: {
    pink: '#ff00ff',
    cyan: '#00ffff',
    green: '#00ff00',
    purple: '#bf00ff',
    blue: '#0066ff',
  },
  dark: {
    900: '#0a0a0f',
    800: '#12121a',
    700: '#1a1a25',
  }
}
```

### Visual Effects
- Glowing text with `text-shadow` and `drop-shadow`
- Gradient borders on buttons/cards
- RGB color cycling animations on key elements
- Dark background with neon accents
- Player capsule with emissive glow material
