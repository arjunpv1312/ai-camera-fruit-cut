import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Target, Zap, Calculator, Award, Crown } from 'lucide-react';
import type { Achievement, GameStats } from '../types/game';

interface GameOverModalProps {
  stats: GameStats;
  achievements: Achievement[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, achievements, onPlayAgain, onGoHome }) => {
  useEffect(() => {
    confetti({ particleCount: 60, spread: 55, origin: { x: 0.25, y: 0.6 }, colors: ['#fbbf24', '#f97316', '#e11d48'] });
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 55, origin: { x: 0.75, y: 0.6 }, colors: ['#fbbf24', '#f97316', '#7c3aed'] });
    }, 300);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto select-none">
      <div className="relative w-full max-w-xl my-auto game-panel rounded-[2rem] p-6 md:p-8 shadow-[0_0_80px_-12px_rgba(251,191,36,0.25)] text-center overflow-hidden corner-brackets">
        {/* Gold accent line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
          <Crown className="w-8 h-8" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white font-display">MISSION COMPLETE</h2>
        <p className="text-slate-500 text-xs mt-1">Outstanding combat performance, Ninja!</p>

        {/* Score */}
        <div className="my-6 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Score</div>
          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 leading-tight mt-1">
            {stats.score.toLocaleString()}
          </div>
          {stats.xpEarned && (
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-black">
              +{stats.xpEarned} XP
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {[
            { icon: <Zap className="w-4 h-4" />, label: 'Sliced', value: stats.fruitsCut, color: 'text-amber-400 bg-amber-500/15 border-amber-500/20' },
            { icon: <Target className="w-4 h-4" />, label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
            { icon: <Award className="w-4 h-4" />, label: 'Max Combo', value: `${stats.maxCombo}x`, color: 'text-purple-400 bg-purple-500/15 border-purple-500/20' },
            { icon: <Calculator className="w-4 h-4" />, label: 'Math', value: stats.mathSolved, color: 'text-sky-400 bg-sky-500/15 border-sky-500/20' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className={`p-2 rounded-lg border ${m.color}`}>{m.icon}</div>
              <div className="text-left">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{m.label}</div>
                <div className="text-lg font-black text-white">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {achievements.some((a) => a.unlocked) && (
          <div className="mb-6 text-left">
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-400 mb-2">Unlocked Badges</div>
            <div className="flex flex-wrap gap-1.5">
              {achievements.filter((a) => a.unlocked).map((badge) => (
                <div key={badge.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-200 text-[10px] font-black">
                  <span>{badge.icon}</span>
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all glow-ring"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>
          <button
            onClick={onGoHome}
            className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all hover:scale-105"
            title="Main Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
