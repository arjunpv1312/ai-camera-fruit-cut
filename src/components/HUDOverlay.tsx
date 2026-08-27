import React from 'react';
import { Volume2, VolumeX, Pause, Play, Heart, Trophy, Zap, Calculator, Award, BookOpen, Globe, TrendingUp, Activity, Eye } from 'lucide-react';
import type { ColorblindMode, GameMode, Language, MathQuestion, UserProgress, WeaponType } from '../types/game';
import { WeaponSelector } from './WeaponSelector';
import { TRANSLATIONS } from '../utils/i18n';

interface HUDOverlayProps {
  score: number;
  lives: number;
  gameMode: GameMode;
  currentWeapon: WeaponType;
  currentLang: Language;
  progress: UserProgress;
  colorblindMode: ColorblindMode;
  showFps: boolean;
  onSelectWeapon: (weapon: WeaponType) => void;
  onChangeLanguage: (lang: Language) => void;
  onToggleColorblind: () => void;
  onToggleFps: () => void;
  combo: number;
  isMuted: boolean;
  isPaused: boolean;
  currentMathQuestion: MathQuestion | null;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onOpenEncyclopedia: () => void;
  onOpenAnalytics: () => void;
  onOpenTeacherQuiz: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  score,
  lives,
  gameMode,
  currentWeapon,
  currentLang,
  progress,
  colorblindMode,
  showFps,
  onSelectWeapon,
  onChangeLanguage,
  onToggleColorblind,
  onToggleFps,
  combo,
  isMuted,
  isPaused,
  currentMathQuestion,
  onToggleMute,
  onTogglePause,
  onOpenEncyclopedia,
  onOpenAnalytics,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const languages: Language[] = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja'];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Header Row */}
      <div className="flex items-start justify-between w-full gap-4">
        {/* Left Side: Score & Level Badge */}
        <div className="flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl">
            <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {t.level} {progress.level} | {t.score}
              </div>
              <div className="text-2xl md:text-3xl font-black text-white font-outfit leading-none">{score}</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 backdrop-blur-md border border-slate-700/40 text-xs font-bold text-sky-400">
            {gameMode === 'arcade' && (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t.arcade}</span>
              </>
            )}
            {gameMode === 'math' && (
              <>
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{t.mathNinja}</span>
              </>
            )}
            {gameMode === 'nutrition' && (
              <>
                <Award className="w-4 h-4 text-rose-400" />
                <span>{t.nutritionExplorer}</span>
              </>
            )}
            {gameMode === 'boss' && (
              <>
                <Award className="w-4 h-4 text-purple-400" />
                <span>{t.bossBattle}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Math Problem Banner */}
        {gameMode === 'math' && currentMathQuestion && (
          <div className="flex flex-col items-center px-6 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-lg border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 transform hover:scale-105 transition-all">
            <div className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
              <span>Solve Equation</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-outfit tracking-wide drop-shadow-md">
              {currentMathQuestion.equation} = ?
            </div>
          </div>
        )}

        {/* Right Side: Control Buttons & Accessibility */}
        <div className="flex items-center gap-2">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${
                  i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 fill-slate-800 scale-75 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Language Selector */}
          <div className="pointer-events-auto relative flex items-center bg-slate-900/80 rounded-2xl border border-slate-700/60 p-1">
            <Globe className="w-4 h-4 text-sky-400 ml-2 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none uppercase pr-2 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Analytics Dashboard Trigger */}
          <button
            onClick={onOpenAnalytics}
            className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 text-sky-400 transition-all shadow-xl"
            title="Learning Analytics"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          {/* Colorblind Toggle */}
          <button
            onClick={onToggleColorblind}
            className={`pointer-events-auto p-2.5 rounded-2xl backdrop-blur-md border transition-all shadow-xl ${
              colorblindMode !== 'none'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400'
            }`}
            title="Toggle Colorblind Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* FPS Counter Toggle */}
          <button
            onClick={onToggleFps}
            className={`pointer-events-auto p-2.5 rounded-2xl backdrop-blur-md border transition-all shadow-xl ${
              showFps
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400'
            }`}
            title="Toggle FPS HUD"
          >
            <Activity className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenEncyclopedia}
            className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 text-amber-400 transition-all shadow-xl"
            title="Fruit Encyclopedia"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMute}
            className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 text-slate-200 transition-all shadow-xl"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-sky-400" />}
          </button>

          <button
            onClick={onTogglePause}
            className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/60 text-slate-200 transition-all shadow-xl"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bottom Center: Weapon Arsenal Selector */}
      <div className="flex justify-center w-full mb-2">
        <WeaponSelector currentWeapon={currentWeapon} onSelectWeapon={onSelectWeapon} />
      </div>

      {/* Combo Banner Center Popup */}
      {combo >= 2 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-bounce">
          <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-3xl md:text-5xl font-outfit shadow-2xl tracking-wider transform -rotate-3 ring-4 ring-amber-300/50">
            {combo}x {t.combo}
          </div>
          <span className="text-amber-300 font-extrabold text-sm md:text-base drop-shadow mt-1">
            {combo >= 4 ? '🔥 SUPER SLASH!' : '⚡ GREAT CUT!'}
          </span>
        </div>
      )}
    </div>
  );
};
