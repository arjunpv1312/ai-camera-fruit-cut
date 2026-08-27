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
  HelpCircle,
  TrendingUp,
  Flame,
  Shield,
} from 'lucide-react';
import type { BladeStyle, GameMode, HandSkin, Language, MathDifficulty, UserProgress } from '../types/game';
import { HandSkinSelector } from './HandSkinSelector';
import { TRANSLATIONS } from '../utils/i18n';

interface GameControlsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  mathDifficulty: MathDifficulty;
  setMathDifficulty: (diff: MathDifficulty) => void;
  bladeStyle: BladeStyle;
  setBladeStyle: (style: BladeStyle) => void;
  currentLang: Language;
  progress: UserProgress;
  onSelectSkin: (skin: HandSkin) => void;
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onStartGame: () => void;
  onOpenEncyclopedia: () => void;
  onOpenAnalytics: () => void;
  onOpenTeacherQuiz: () => void;
  onOpenTutorial: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  setGameMode,
  mathDifficulty,
  setMathDifficulty,
  bladeStyle,
  setBladeStyle,
  currentLang,
  progress,
  onSelectSkin,
  isCameraActive,
  setIsCameraActive,
  isMuted,
  setIsMuted,
  onStartGame,
  onOpenEncyclopedia,
  onOpenAnalytics,
  onOpenTeacherQuiz,
  onOpenTutorial,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const bladeStyles: { id: BladeStyle; name: string; icon: string; glow: string }[] = [
    { id: 'electric', name: 'Electric Cyan', icon: '⚡', glow: 'from-cyan-400 to-blue-600' },
    { id: 'fire', name: 'Fire Saber', icon: '🔥', glow: 'from-amber-400 to-rose-600' },
    { id: 'emerald', name: 'Emerald Blade', icon: '🌿', glow: 'from-emerald-400 to-teal-600' },
    { id: 'rainbow', name: 'Rainbow Spark', icon: '🌈', glow: 'from-purple-400 via-pink-500 to-amber-400' },
    { id: 'ice', name: 'Frost Blade', icon: '❄️', glow: 'from-sky-300 to-indigo-500' },
    { id: 'shadow', name: 'Shadow Void', icon: '🔮', glow: 'from-fuchsia-500 to-purple-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto select-none ambient-spotlight">
      <div className="relative w-full max-w-4xl my-auto glass-panel-luxury rounded-[2.5rem] p-6 md:p-10 border border-slate-700/60 shadow-[0_0_80px_-15px_rgba(56,189,248,0.25)] overflow-hidden">
        {/* Subtle Ambient Top Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* Hero Title Header */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-400/40 text-sky-300 text-xs font-black uppercase tracking-widest mb-3 shadow-lg shadow-sky-500/10">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>AI Computer Vision Engine • Pro Edition</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-amber-300 font-outfit tracking-tight drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2.5 max-w-xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 1. Game Mode Selection Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Select Battle Mission</span>
            </label>
            <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              5 Modes Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Arcade Mode */}
            <button
              onClick={() => setGameMode('arcade')}
              className={`group relative flex flex-col justify-between p-4 rounded-3xl border transition-all text-left glass-card-hover ${
                gameMode === 'arcade'
                  ? 'bg-gradient-to-b from-amber-500/20 to-slate-900/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="font-black text-sm md:text-base font-outfit text-white leading-snug">{t.arcade}</div>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{t.arcadeDesc}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider mt-3">🔥 Frenzy</span>
            </button>

            {/* Math Ninja */}
            <button
              onClick={() => setGameMode('math')}
              className={`group relative flex flex-col justify-between p-4 rounded-3xl border transition-all text-left glass-card-hover ${
                gameMode === 'math'
                  ? 'bg-gradient-to-b from-emerald-500/20 to-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl shadow-emerald-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="font-black text-sm md:text-base font-outfit text-white leading-snug">{t.mathNinja}</div>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{t.mathDesc}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider mt-3">🧠 Brain Boost</span>
            </button>

            {/* Nutrition Explorer */}
            <button
              onClick={() => setGameMode('nutrition')}
              className={`group relative flex flex-col justify-between p-4 rounded-3xl border transition-all text-left glass-card-hover ${
                gameMode === 'nutrition'
                  ? 'bg-gradient-to-b from-rose-500/20 to-slate-900/90 border-rose-400 ring-2 ring-rose-400/40 shadow-xl shadow-rose-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="font-black text-sm md:text-base font-outfit text-white leading-snug">{t.nutritionExplorer}</div>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{t.nutritionDesc}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider mt-3">🥗 Health Lab</span>
            </button>

            {/* Boss Battle */}
            <button
              onClick={() => setGameMode('boss')}
              className={`group relative flex flex-col justify-between p-4 rounded-3xl border transition-all text-left glass-card-hover ${
                gameMode === 'boss'
                  ? 'bg-gradient-to-b from-purple-500/20 to-slate-900/90 border-purple-400 ring-2 ring-purple-400/40 shadow-xl shadow-purple-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="font-black text-sm md:text-base font-outfit text-white leading-snug">{t.bossBattle}</div>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{t.bossDesc}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-wider mt-3">👑 Titan Raid</span>
            </button>

            {/* Teacher Quiz */}
            <button
              onClick={() => {
                setGameMode('teacher_quiz');
                onOpenTeacherQuiz();
              }}
              className={`group relative flex flex-col justify-between p-4 rounded-3xl border transition-all text-left glass-card-hover ${
                gameMode === 'teacher_quiz'
                  ? 'bg-gradient-to-b from-sky-500/20 to-slate-900/90 border-sky-400 ring-2 ring-sky-400/40 shadow-xl shadow-sky-500/20'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="font-black text-sm md:text-base font-outfit text-white leading-snug">{t.teacherQuiz}</div>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{t.teacherQuizDesc}</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase text-sky-400 tracking-wider mt-3">✨ Custom Quiz</span>
            </button>
          </div>
        </div>

        {/* Math Difficulty Selector */}
        {gameMode === 'math' && (
          <div className="mb-6 p-4 rounded-3xl bg-emerald-950/40 border border-emerald-800/50 backdrop-blur-md">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-400 mb-2.5">
              Math Calculation Difficulty
            </label>
            <div className="flex items-center gap-2.5">
              {(['easy', 'medium', 'hard', 'adaptive'] as MathDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setMathDifficulty(diff)}
                  className={`flex-1 py-2 px-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                    mathDifficulty === diff
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                      : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hand Skins Selector Component */}
        <div className="mb-6">
          <HandSkinSelector progress={progress} onSelectSkin={onSelectSkin} />
        </div>

        {/* Blade Trail Selector */}
        <div className="mb-8">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-300 mb-2.5">
            Blade Trail Effects
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {bladeStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setBladeStyle(style.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all glass-card-hover ${
                  bladeStyle === style.id
                    ? 'bg-slate-800 border-sky-400 text-white ring-2 ring-sky-400/40 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-xl mb-1">{style.icon}</span>
                <span className="text-[11px] font-extrabold font-outfit leading-tight">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode Bar & Utility Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 shadow-inner">
              {isCameraActive ? <Camera className="w-5 h-5" /> : <MousePointer className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-black text-white font-outfit uppercase tracking-wider">
                Input Mode: {isCameraActive ? t.handActive : 'Mouse / Touch Screen'}
              </div>
              <div className="text-[11px] text-slate-400">{isCameraActive ? t.raiseHand : 'Click & swipe cursor across screen'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTutorial}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors shadow-md"
              title="How to Play Tutorial"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenEncyclopedia}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors shadow-md"
              title="Fruit Encyclopedia"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAnalytics}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors shadow-md"
              title="Learning Analytics"
            >
              <TrendingUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`px-4 py-2 rounded-2xl text-xs font-black font-outfit tracking-wide transition-all shadow-md ${
                isCameraActive
                  ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30 ring-2 ring-sky-300/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {isCameraActive ? 'AI Camera ON' : 'Enable Camera'}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-md"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* Master CTA Start Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onStartGame}
            className="group relative overflow-hidden flex items-center justify-center gap-3.5 px-12 py-5 rounded-3xl bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xl md:text-2xl font-outfit shadow-[0_0_50px_-5px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Animated light sweep shine */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 animate-sweep pointer-events-none" />
            <Play className="w-7 h-7 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">{t.startSlicing}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
