import React from 'react';
import { Volume2, VolumeX, Pause, Play, Heart, Trophy, Zap, Calculator, Award, BookOpen, Globe, TrendingUp, Activity, Eye, Shield } from 'lucide-react';
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
      {/* Top Header Floating Glass Dock */}
      <div className="flex items-start justify-between w-full gap-4">
        {/* Left: Level Badge & High-Gloss Score */}
        <div className="flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-3.5 px-5 py-3 rounded-3xl glass-panel-luxury border border-slate-700/80 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.level} {progress.level} • {t.score}
              </div>
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white font-outfit leading-none mt-0.5">
                {score.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel-luxury border border-slate-700/60 text-xs font-black font-outfit uppercase tracking-wider text-sky-400">
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
                <Shield className="w-4 h-4 text-purple-400" />
                <span>{t.bossBattle}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Holographic Math Problem Banner */}
        {gameMode === 'math' && currentMathQuestion && (
          <div className="flex flex-col items-center px-8 py-3 rounded-3xl glass-panel-luxury border-2 border-emerald-400/80 shadow-[0_0_40px_-5px_rgba(52,211,153,0.4)] transform hover:scale-105 transition-all">
            <div className="text-[10px] font-black text-emerald-300 tracking-widest uppercase flex items-center gap-1.5 mb-0.5">
              <span>SOLVE EQUATION</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white font-outfit tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {currentMathQuestion.equation} = <span className="text-emerald-400 animate-pulse">?</span>
            </div>
          </div>
        )}

        {/* Right Side: Hearts & Accessibility Capsule */}
        <div className="flex items-center gap-2.5">
          {/* Hearts / Shield Battery */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-3xl glass-panel-luxury border border-slate-700/80 shadow-2xl">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all duration-300 ${
                  i < lives
                    ? 'text-rose-500 fill-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'text-slate-700 fill-slate-800 scale-75 opacity-30'
                }`}
              />
            ))}
          </div>

          {/* Language Selector Dropdown */}
          <div className="pointer-events-auto relative flex items-center glass-panel-luxury rounded-2xl border border-slate-700/60 p-1.5">
            <Globe className="w-4 h-4 text-sky-400 ml-1.5 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-black text-white focus:outline-none uppercase pr-2 cursor-pointer font-outfit"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-950 text-white">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action Buttons */}
          <button
            onClick={onOpenAnalytics}
            className="pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury hover:bg-slate-800 text-sky-400 transition-all shadow-lg hover:scale-105"
            title="Learning Analytics"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleColorblind}
            className={`pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury transition-all shadow-lg hover:scale-105 ${
              colorblindMode !== 'none'
                ? 'border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Colorblind Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleFps}
            className={`pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury transition-all shadow-lg hover:scale-105 ${
              showFps
                ? 'border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle FPS HUD"
          >
            <Activity className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenEncyclopedia}
            className="pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury hover:bg-slate-800 text-amber-400 transition-all shadow-lg hover:scale-105"
            title="Fruit Encyclopedia"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleMute}
            className="pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury hover:bg-slate-800 text-slate-200 transition-all shadow-lg hover:scale-105"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-sky-400" />}
          </button>

          <button
            onClick={onTogglePause}
            className="pointer-events-auto p-2.5 rounded-2xl glass-panel-luxury hover:bg-slate-800 text-slate-200 transition-all shadow-lg hover:scale-105"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Bottom Center: Weapon Arsenal Dock */}
      <div className="flex justify-center w-full mb-3">
        <WeaponSelector currentWeapon={currentWeapon} onSelectWeapon={onSelectWeapon} />
      </div>

      {/* Combo Flare Popup */}
      {combo >= 2 && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-bounce">
          <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-slate-950 font-black text-4xl md:text-6xl font-outfit shadow-[0_0_60px_rgba(245,158,11,0.6)] tracking-wider transform -rotate-3 ring-4 ring-amber-300/80">
            {combo}x {t.combo}
          </div>
          <span className="text-amber-300 font-black text-sm md:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] mt-1.5 tracking-wide">
            {combo >= 4 ? '🔥 ULTRA SUPER SLASH!' : '⚡ GREAT STREAK!'}
          </span>
        </div>
      )}
    </div>
  );
};
