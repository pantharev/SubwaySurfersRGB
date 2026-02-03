# 🏃‍♂️ Endless Runner 3D (Subway Surfers–Style)

A **3D endless runner game** inspired by *Subway Surfers*, built for the web using **Three.js**.  
The player runs endlessly, switches lanes, jumps, slides, avoids obstacles, collects coins, and competes on global leaderboards.

The project is designed to be:
- **Mobile-first**
- **Fast to iterate**
- **Offline-first with optional cloud features**

---

## 🎮 Core Gameplay

- Auto-running character in a **3-lane track**
- Lane switching (left / center / right)
- Jump & slide mechanics
- Obstacles with instant fail on collision
- Coin collection
- Increasing speed and difficulty over time
- Instant restart loop (<1 second)

---

## 🌐 Features

### ✅ Implemented / MVP Scope
- 3D endless runner gameplay
- Coins & obstacles
- Distance-based scoring
- Local persistence (high score, coins)
- Guest play (no login required)
- Global leaderboard (Supabase)
- Optional login with Google
- Username submission for guest leaderboard entries
- Mobile + desktop input support
- Offline-friendly fallback behavior

### 🚧 Planned / Future Features
- Character models & animations
- Multiple playable characters
- Power-ups (magnets, shields, boosts)
- Cosmetic skins
- In-game shop
- Daily challenges
- Multiple environments/themes
- Sound effects & music polish
- Mobile app packaging (iOS / Android)

---

## 🧠 Tech Stack

### Frontend
- **React + Vite + TypeScript**
- **Three.js**
- **@react-three/fiber** (React renderer for Three.js)
- **@react-three/drei** (helpers)

### Backend
- **Supabase**
  - Google OAuth
  - PostgreSQL leaderboards
  - Row Level Security (RLS)

### Persistence
- `localStorage` (offline-first)
- Supabase (optional cloud sync)

---

## 🗂 Project Structure

