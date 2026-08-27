# 🍉 AI Hands Fruit Destroyer V2 🖐️⚡⚔️

> An interactive, 60 FPS computer vision web game for students. Slice and smash flying fruits in mid-air using your real hands detected via dual-hand MediaPipe AI, equipped with 5 futuristic weapons!

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands_AI-emerald.svg)](https://developers.google.com/mediapipe)

---

## 🌟 Key Features

- **🖐️ 100% Air Hands Control**: Real-time dual-hand AI tracking (`maxNumHands: 2`) via webcam with zero latency.
- **⚔️ 5 Selectable Weapon Systems**:
  - ⚔️ **Dual Katanas**: Precision edge slicing with glowing energy trails.
  - 🔨 **Thunder Hammer**: Hand slam triggers electrical shockwave rings that shatter nearby fruits in an AoE blast!
  - 🔫 **Plasma Cannon**: Open palm gesture fires energy laser rays down screen.
  - ❄️ **Frost Gauntlet**: Freezes flying fruits into ice blocks, then shatters them into ice crystals!
  - 🌌 **Gravity Vortex**: Clench hand into a fist to pull all fruits into a cosmic black hole.
- **🧠 3 Student Game Modes**:
  - 🍉 **Classic Arcade**: Fast-paced speed slicing, frenzy waves, combo multipliers, & dodging bombs.
  - 🔢 **Math Ninja Challenge**: Solve arithmetic equations (Addition, Subtraction, Multiplication, Division across Easy/Medium/Hard) by slicing the fruit carrying the correct answer number!
  - 🥗 **Nutrition Explorer**: Slice healthy superfoods with vitamin tags while dodging junk food bombs (Burgers/Soda). Includes an interactive **Fruit Nutrition Encyclopedia**!
- **🔊 Web Audio FX Synthesizer**: Procedural, zero-dependency sound FX for metal slashes, thunder shockwaves, laser pulses, ice crackles, and combo fanfares.
- **🖱️ Mouse / Touch Fallback**: Play seamlessly on any laptop, tablet, or mobile device without camera permissions.

---

## 💻 Quick Start & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/arjunpv1312/ai-camera-fruit-cut.git

# 2. Navigate to project directory
cd ai-camera-fruit-cut

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/` or `http://localhost:5174/` to play!

---

## 🏗️ Project Architecture

```
camera-fruit-cut/
├── src/
│   ├── components/
│   │   ├── CameraTracker.tsx      # Dual AI hand vision & skeleton overlay
│   │   ├── GameCanvas.tsx         # 60 FPS HTML5 canvas physics & weapon engine
│   │   ├── GameControls.tsx       # Main menu & mode switcher modal
│   │   ├── GameOverModal.tsx       # Summary screen with stats & confetti
│   │   ├── HUDOverlay.tsx          # Live heads-up display
│   │   ├── NutritionModal.tsx      # Fruit trivia & nutrition encyclopedia
│   │   └── WeaponSelector.tsx      # Weapon arsenal toolbar
│   ├── types/
│   │   └── game.ts                # TypeScript interfaces & state definitions
│   ├── utils/
│   │   ├── audioEngine.ts         # Procedural Web Audio API sound synthesizer
│   │   ├── fruitData.ts           # Vector 2D fruit renderer & sliced geometries
│   │   ├── mathGenerator.ts       # Educational math question generator
│   │   └── triviaData.ts          # Fruit nutrition trivia catalog
│   ├── App.tsx                    # Root state router & component layout
│   ├── index.css                  # Tailwind CSS design system & glows
│   └── main.tsx                   # React root entrypoint
├── index.html                     # HTML5 container & MediaPipe CDN scripts
├── package.json                   # Dependencies & build scripts
└── vite.config.ts                 # Vite & Tailwind plugins setup
```

---

## 📜 License

MIT License © 2026 Arjun PV & Google Antigravity Team
