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
  Swords,
  Crown,
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

  const bladeStyles: { id: BladeStyle; name: string; icon: string }[] = [
    { id: 'electric', name: 'Electric', icon: '⚡' },
    { id: 'fire', name: 'Fire Saber', icon: '🔥' },
    { id: 'emerald', name: 'Emerald', icon: '🌿' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
    { id: 'ice', name: 'Frost', icon: '❄️' },
    { id: 'shadow', name: 'Shadow', icon: '🔮' },
  ];

  const modeCards: { id: GameMode; icon: React.ReactNode; label: string; desc: string; tag: string; accent: string; accentBg: string }[] = [
    { id: 'arcade', icon: <Zap className="w-6 h-6" />, label: t.arcade, desc: t.arcadeDesc, tag: '🔥 FRENZY', accent: 'text-amber-400', accentBg: 'bg-amber-500/15 border-amber-500/25' },
    { id: 'math', icon: <Calculator className="w-6 h-6" />, label: t.mathNinja, desc: t.mathDesc, tag: '🧠 BRAIN', accent: 'text-emerald-400', accentBg: 'bg-emerald-500/15 border-emerald-500/25' },
    { id: 'nutrition', icon: <Award className="w-6 h-6" />, label: t.nutritionExplorer, desc: t.nutritionDesc, tag: '🥗 HEALTH', accent: 'text-rose-400', accentBg: 'bg-rose-500/15 border-rose-500/25' },
    { id: 'boss', icon: <Shield className="w-6 h-6" />, label: t.bossBattle, desc: t.bossDesc, tag: '👑 TITAN', accent: 'text-purple-400', accentBg: 'bg-purple-500/15 border-purple-500/25' },
    { id: 'teacher_quiz', icon: <BookOpen className="w-6 h-6" />, label: t.teacherQuiz, desc: t.teacherQuizDesc, tag: '✨ CUSTOM', accent: 'text-sky-400', accentBg: 'bg-sky-500/15 border-sky-500/25' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none game-scene-bg">
      {/* Animated scan line */}
      <div className="scan-line" />

      {/* Floating fruit silhouette decorations */}
      <div className="fixed top-16 left-8 text-6xl opacity-[0.06] pointer-events-none fruit-float-1">🍉</div>
      <div className="fixed top-32 right-12 text-5xl opacity-[0.05] pointer-events-none fruit-float-2">🍊</div>
      <div className="fixed bottom-24 left-16 text-5xl opacity-[0.04] pointer-events-none fruit-float-3">🍓</div>
      <div className="fixed bottom-12 right-20 text-4xl opacity-[0.05] pointer-events-none fruit-float-1" style={{ animationDelay: '3s' }}>🥝</div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-5xl">

          {/* ═══ HERO BRANDING SECTION ═══ */}
          <div className="text-center mb-10">
            {/* Top Ornamental Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/20 bg-amber-500/8 mb-5">
              <Swords className="w-4 h-4 text-amber-400 energy-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300/90">
                AI Vision Combat Engine • Season 1
              </span>
              <Crown className="w-4 h-4 text-amber-400 energy-pulse" />
            </div>

            {/* Giant Game Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 font-display leading-[0.95] title-shimmer drop-shadow-2xl">
              {t.title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400/80 text-sm md:text-base mt-4 max-w-lg mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            {/* Ornament Divider */}
            <div className="ornament-divider w-48 mx-auto mt-6" />
          </div>

          {/* ═══ MISSION SELECT (Game Modes) ═══ */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-200">
                Select Battle Mission
              </span>
              <div className="flex-1 ornament-divider" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {modeCards.map((mode) => {
                const isActive = gameMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setGameMode(mode.id);
                      if (mode.id === 'teacher_quiz') onOpenTeacherQuiz();
                    }}
                    className={`game-card p-4 text-left flex flex-col justify-between min-h-[140px] ${
                      isActive ? 'game-card-active' : ''
                    }`}
                  >
                    <div>
                      <div className={`w-11 h-11 rounded-xl ${mode.accentBg} border flex items-center justify-center ${mode.accent} mb-3`}>
                        {mode.icon}
                      </div>
                      <div className="font-black text-sm text-white leading-snug">{mode.label}</div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1 line-clamp-2">{mode.desc}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${mode.accent} mt-3`}>{mode.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══ MATH DIFFICULTY (conditional) ═══ */}
          {gameMode === 'math' && (
            <div className="mb-6 game-panel rounded-2xl p-5 corner-brackets">
              <label className="block text-xs font-black uppercase tracking-[0.15em] text-emerald-400 mb-3">
                Calculation Difficulty
              </label>
              <div className="flex items-center gap-2.5">
                {(['easy', 'medium', 'hard', 'adaptive'] as MathDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setMathDifficulty(diff)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      mathDifficulty === diff
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ TWO-COLUMN: HAND SKINS + BLADE TRAILS ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Hand Skins */}
            <div className="game-panel rounded-2xl p-5">
              <HandSkinSelector progress={progress} onSelectSkin={onSelectSkin} />
            </div>

            {/* Blade Trail Selector */}
            <div className="game-panel rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-300 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Blade Trail Effects</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {bladeStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setBladeStyle(style.id)}
                    className={`game-card flex flex-col items-center justify-center p-3 !rounded-xl ${
                      bladeStyle === style.id ? 'game-card-active' : ''
                    }`}
                  >
                    <span className="text-xl mb-1">{style.icon}</span>
                    <span className="text-[10px] font-black leading-tight text-center text-slate-300">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ INPUT MODE + UTILITY TOOLBAR ═══ */}
          <div className="game-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mb-8 corner-brackets">
            <div className="flex items-center gap-3.5">
              <div className={`p-3 rounded-xl border ${
                isCameraActive
                  ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                {isCameraActive ? <Camera className="w-5 h-5" /> : <MousePointer className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider">
                  {isCameraActive ? '✋ AI Hand Tracking Active' : '🖱️ Mouse / Touch Mode'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {isCameraActive ? t.raiseHand : 'Click & swipe cursor across screen'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onOpenTutorial} className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-400 border border-slate-800 hover:border-sky-500/30 transition-all" title="Tutorial">
                <HelpCircle className="w-4 h-4" />
              </button>
              <button onClick={onOpenEncyclopedia} className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/30 transition-all" title="Encyclopedia">
                <BookOpen className="w-4 h-4" />
              </button>
              <button onClick={onOpenAnalytics} className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/30 transition-all" title="Analytics">
                <TrendingUp className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-800 mx-1" />

              <button
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${
                  isCameraActive
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600'
                }`}
              >
                {isCameraActive ? 'CAMERA ON' : 'ENABLE CAM'}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* ═══ MASTER CTA — LAUNCH MISSION ═══ */}
          <div className="flex items-center justify-center">
            <button
              onClick={onStartGame}
              className="group relative overflow-hidden flex items-center justify-center gap-4 px-14 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-xl md:text-2xl shadow-[0_0_60px_-10px_rgba(251,191,36,0.5)] hover:shadow-[0_0_80px_-10px_rgba(251,191,36,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 glow-ring"
            >
              {/* Animated shine sweep */}
              <div className="absolute inset-0 w-1/3 h-full bg-white/30 animate-sweep pointer-events-none" />
              <Play className="w-7 h-7 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span className="tracking-wide relative z-10">{t.startSlicing}</span>
            </button>
          </div>

          {/* Bottom Level Badge */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-xs">
              <span className="font-black text-amber-400">LVL {progress.level}</span>
              <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (progress.xp / progress.nextLevelXp) * 100)}%` }}
                />
              </div>
              <span className="text-slate-500 font-bold">{progress.xp}/{progress.nextLevelXp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
