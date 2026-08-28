import React from 'react';
import { Volume2, VolumeX, Pause, Play, Heart, Trophy, Zap, Calculator, Award, BookOpen, Globe, TrendingUp, Activity, Eye, Shield, Home, RotateCcw } from 'lucide-react';
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
  onGoHome: () => void;
  onResetRound: () => void;
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
  onGoHome,
  onResetRound,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const languages: Language[] = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja'];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-5 select-none">
      {/* ─── Top Bar ─── */}
      <div className="flex items-start justify-between w-full gap-3">
        {/* Left: Score + Mode Badge + Home & Reset Buttons */}
        <div className="flex items-center gap-2">
          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl game-panel hover:!border-amber-400 text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            title="Return to Main Menu"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">Menu</span>
          </button>

          {/* Reset / Restart Button */}
          <button
            onClick={onResetRound}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl game-panel hover:!border-amber-400 text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            title="Restart Mission"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">Restart</span>
          </button>

          {/* Level & Score Capsule */}
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-2xl game-panel">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4 energy-pulse" />
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                {t.level} {progress.level} • {t.score}
              </div>
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white leading-none mt-0.5">
                {score.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl game-panel text-[10px] font-black uppercase tracking-[0.12em]">
            {gameMode === 'arcade' && <><Zap className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-300">{t.arcade}</span></>}
            {gameMode === 'math' && <><Calculator className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-300">{t.mathNinja}</span></>}
            {gameMode === 'nutrition' && <><Award className="w-3.5 h-3.5 text-rose-400" /><span className="text-rose-300">{t.nutritionExplorer}</span></>}
            {gameMode === 'boss' && <><Shield className="w-3.5 h-3.5 text-purple-400" /><span className="text-purple-300">{t.bossBattle}</span></>}
          </div>
        </div>

        {/* Center: Math Equation Banner */}
        {gameMode === 'math' && currentMathQuestion && (
          <div className="flex flex-col items-center px-6 py-2.5 rounded-2xl game-panel border-2 !border-emerald-500/60 shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]">
            <div className="text-[9px] font-black text-emerald-400 tracking-[0.2em] uppercase">SOLVE</div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-wider">
              {currentMathQuestion.equation} = <span className="text-emerald-400 energy-pulse">?</span>
            </div>
          </div>
        )}

        {/* Right: Hearts + Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl game-panel">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                    : 'text-slate-800 fill-slate-800 scale-75'
                }`}
              />
            ))}
          </div>

          {/* Language */}
          <div className="pointer-events-auto flex items-center game-panel rounded-xl p-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1 mr-0.5" />
            <select
              value={currentLang}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent text-[10px] font-black text-white focus:outline-none uppercase pr-1 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-950">{lang.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Quick Action Buttons */}
          <button onClick={onOpenAnalytics} className="pointer-events-auto p-2 rounded-xl game-panel hover:!border-amber-500/30 text-amber-400 transition-all shadow-md hover:scale-105" title="Analytics">
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={onToggleColorblind} className={`pointer-events-auto p-2 rounded-xl game-panel transition-all shadow-md hover:scale-105 ${colorblindMode !== 'none' ? '!border-amber-400 text-amber-300' : 'text-slate-600 hover:text-white'}`} title="Colorblind">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onToggleFps} className={`pointer-events-auto p-2 rounded-xl game-panel transition-all shadow-md hover:scale-105 ${showFps ? '!border-emerald-400 text-emerald-300' : 'text-slate-600 hover:text-white'}`} title="FPS">
            <Activity className="w-4 h-4" />
          </button>
          <button onClick={onOpenEncyclopedia} className="pointer-events-auto p-2 rounded-xl game-panel hover:!border-amber-500/30 text-amber-400 transition-all shadow-md hover:scale-105" title="Encyclopedia">
            <BookOpen className="w-4 h-4" />
          </button>
          <button onClick={onToggleMute} className="pointer-events-auto p-2 rounded-xl game-panel hover:!border-amber-500/30 transition-all shadow-md hover:scale-105" title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
          <button onClick={onTogglePause} className="pointer-events-auto p-2 rounded-xl game-panel hover:!border-amber-500/30 transition-all shadow-md hover:scale-105" title={isPaused ? 'Resume' : 'Pause'}>
            {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* ─── Bottom Weapon Dock ─── */}
      <div className="flex justify-center w-full mb-2">
        <WeaponSelector currentWeapon={currentWeapon} onSelectWeapon={onSelectWeapon} />
      </div>

      {/* ─── Combo Burst ─── */}
      {combo >= 2 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-bounce">
          <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black text-4xl md:text-6xl shadow-[0_0_50px_rgba(251,191,36,0.5)] tracking-wider transform -rotate-2">
            {combo}x {t.combo}
          </div>
          <span className="text-amber-300 font-black text-sm md:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1 tracking-wide">
            {combo >= 4 ? '🔥 ULTRA SLASH!' : '⚡ GREAT STREAK!'}
          </span>
        </div>
      )}
    </div>
  );
};
