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
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            <span>AI Dual-Hand Computer Vision</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 font-outfit tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-lg">{t.subtitle}</p>
        </div>

        {/* 1. Game Mode Selection */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
            {t.selectMode}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {/* Arcade Mode */}
            <button
              onClick={() => setGameMode('arcade')}
              className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left ${
                gameMode === 'arcade'
                  ? 'bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mb-1.5">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-outfit text-white">{t.arcade}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.arcadeDesc}</span>
            </button>

            {/* Math Ninja */}
            <button
              onClick={() => setGameMode('math')}
              className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left ${
                gameMode === 'math'
                  ? 'bg-emerald-500/15 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mb-1.5">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-outfit text-white">{t.mathNinja}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.mathDesc}</span>
            </button>

            {/* Nutrition Explorer */}
            <button
              onClick={() => setGameMode('nutrition')}
              className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left ${
                gameMode === 'nutrition'
                  ? 'bg-rose-500/15 border-rose-500/80 ring-2 ring-rose-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mb-1.5">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-outfit text-white">{t.nutritionExplorer}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.nutritionDesc}</span>
            </button>

            {/* Boss Battle */}
            <button
              onClick={() => setGameMode('boss')}
              className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left ${
                gameMode === 'boss'
                  ? 'bg-purple-500/15 border-purple-500/80 ring-2 ring-purple-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 mb-1.5">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-outfit text-white">{t.bossBattle}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.bossDesc}</span>
            </button>

            {/* Teacher Quiz */}
            <button
              onClick={() => {
                setGameMode('teacher_quiz');
                onOpenTeacherQuiz();
              }}
              className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left ${
                gameMode === 'teacher_quiz'
                  ? 'bg-sky-500/15 border-sky-500/80 ring-2 ring-sky-500/30 text-white'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 mb-1.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-outfit text-white">{t.teacherQuiz}</span>
              <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.teacherQuizDesc}</span>
            </button>
          </div>
        </div>

        {/* Math Difficulty Selector */}
        {gameMode === 'math' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">
              Math Difficulty Level
            </label>
            <div className="flex items-center gap-2">
              {(['easy', 'medium', 'hard', 'adaptive'] as MathDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setMathDifficulty(diff)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    mathDifficulty === diff
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hand Skins Selector */}
        <div className="mb-6">
          <HandSkinSelector progress={progress} onSelectSkin={onSelectSkin} />
        </div>

        {/* Blade Trail Selector */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Choose Blade Trail
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {bladeStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setBladeStyle(style.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  bladeStyle === style.id
                    ? 'bg-slate-800 border-sky-400 text-white ring-2 ring-sky-400/30'
                    : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-base mb-0.5">{style.icon}</span>
                <span className="text-[10px] font-bold leading-tight">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode & Quick Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              {isCameraActive ? <Camera className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Input: {isCameraActive ? t.handActive : 'Mouse / Touch Screen'}
              </div>
              <div className="text-[10px] text-slate-400">{isCameraActive ? t.raiseHand : 'Drag mouse across screen'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTutorial}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-sky-400 transition-colors"
              title="How to Play Tutorial"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenEncyclopedia}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-amber-400 transition-colors"
              title="Fruit Encyclopedia"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAnalytics}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-emerald-400 transition-colors"
              title="Learning Analytics"
            >
              <TrendingUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isCameraActive ? 'bg-sky-500 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isCameraActive ? 'Camera ON' : 'Enable Camera'}
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

        {/* Start Game Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onStartGame}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 text-slate-950 font-black text-xl font-outfit shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>{t.startSlicing}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
