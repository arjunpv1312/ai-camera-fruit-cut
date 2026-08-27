import React from 'react';
import {
  Play,
  Zap,
  Calculator,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Camera,
  MousePointer,
  BookOpen,
} from 'lucide-react';
import type { BladeStyle, GameMode, MathDifficulty } from '../types/game';

interface GameControlsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  mathDifficulty: MathDifficulty;
  setMathDifficulty: (diff: MathDifficulty) => void;
  bladeStyle: BladeStyle;
  setBladeStyle: (style: BladeStyle) => void;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onStartGame: () => void;
  onOpenEncyclopedia: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  setGameMode,
  mathDifficulty,
  setMathDifficulty,
  bladeStyle,
  setBladeStyle,
  isCameraActive,
  setIsCameraActive,
  isMuted,
  setIsMuted,
  onStartGame,
  onOpenEncyclopedia,
}) => {
  const bladeStyles: { id: BladeStyle; name: string; icon: string; color: string }[] = [
    { id: 'electric', name: 'Electric Cyan', icon: '⚡', color: 'from-cyan-400 to-blue-600' },
    { id: 'fire', name: 'Fire Saber', icon: '🔥', color: 'from-amber-400 to-rose-600' },
    { id: 'emerald', name: 'Emerald Blade', icon: '🌿', color: 'from-emerald-400 to-teal-600' },
    { id: 'rainbow', name: 'Rainbow Spark', icon: '🌈', color: 'from-purple-400 via-pink-500 to-amber-400' },
    { id: 'ice', name: 'Frost Blade', icon: '❄️', color: 'from-sky-300 to-indigo-500' },
    { id: 'shadow', name: 'Shadow Void', icon: '🔮', color: 'from-fuchsia-500 to-purple-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-3xl my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-sky-500/10">
        {/* Title Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Camera Interactive Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 font-outfit tracking-tight">
            FRUIT NINJA AI 🍉
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2 max-w-lg">
            Slice flying fruits using your webcam AI hand gestures or mouse, master math equations, and explore health nutrition!
          </p>
        </div>

        {/* 1. Game Mode Selection */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Select Game Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Arcade Mode */}
            <button
              onClick={() => setGameMode('arcade')}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                gameMode === 'arcade'
                  ? 'bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base font-outfit text-white">Classic Arcade</span>
              <span className="text-xs text-slate-400 mt-1">Speed slicing, frenzy waves, & dodging bombs.</span>
            </button>

            {/* Math Ninja */}
            <button
              onClick={() => setGameMode('math')}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                gameMode === 'math'
                  ? 'bg-emerald-500/15 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base font-outfit text-white">Math Ninja</span>
              <span className="text-xs text-slate-400 mt-1">Solve equations by slicing correct answer numbers.</span>
            </button>

            {/* Nutrition Explorer */}
            <button
              onClick={() => setGameMode('nutrition')}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                gameMode === 'nutrition'
                  ? 'bg-rose-500/15 border-rose-500/80 ring-2 ring-rose-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 mb-2">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base font-outfit text-white">Nutrition Explorer</span>
              <span className="text-xs text-slate-400 mt-1">Slice healthy superfoods & dodge junk food.</span>
            </button>
          </div>
        </div>

        {/* 2. Math Difficulty Selector (if Math mode active) */}
        {gameMode === 'math' && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">
              Math Difficulty Level
            </label>
            <div className="flex items-center gap-3">
              {(['easy', 'medium', 'hard'] as MathDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setMathDifficulty(diff)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                    mathDifficulty === diff
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff === 'easy' && 'Easy (Addition)'}
                  {diff === 'medium' && 'Medium (Multiplication)'}
                  {diff === 'hard' && 'Hard (Mixed Operations)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Blade Trail Customizer */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            Choose Blade Trail
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {bladeStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setBladeStyle(style.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  bladeStyle === style.id
                    ? 'bg-slate-800 border-sky-400 ring-2 ring-sky-400/30 text-white'
                    : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xl mb-1">{style.icon}</span>
                <span className="text-[11px] font-bold text-center leading-tight">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Controls Mode & Audio row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              {isCameraActive ? <Camera className="w-5 h-5" /> : <MousePointer className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Input Mode: {isCameraActive ? 'AI Camera Gesture' : 'Mouse / Touch Screen'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isCameraActive
                  ? 'Raise index finger in front of camera to slice!'
                  : 'Click and drag mouse/finger across screen.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isCameraActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isCameraActive ? 'Camera Enabled' : 'Enable Camera'}
            </button>

            <button
              onClick={onOpenEncyclopedia}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-amber-400 transition-colors"
              title="Fruit Encyclopedia"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* Start Game Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onStartGame}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 text-slate-950 font-black text-xl font-outfit shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>START SLICING NOW!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
