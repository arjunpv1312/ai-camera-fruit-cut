import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Target, Zap, Calculator, Award } from 'lucide-react';
import type { Achievement, GameStats } from '../types/game';

interface GameOverModalProps {
  stats: GameStats;
  achievements: Achievement[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  achievements,
  onPlayAgain,
  onGoHome,
}) => {
  useEffect(() => {
    // Fire festive confetti cannon!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-lg my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-sky-500/10 text-center">
        {/* Top Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white font-outfit tracking-tight">GAME OVER</h2>
        <p className="text-slate-400 text-sm mt-1">Awesome effort, Ninja!</p>

        {/* Final Score Card */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/60 shadow-xl">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Final Score</div>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300 font-outfit mt-1">
            {stats.score}
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Fruits Cut</div>
              <div className="text-lg font-extrabold text-white font-outfit">{stats.fruitsCut}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</div>
              <div className="text-lg font-extrabold text-white font-outfit">{stats.accuracy}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Max Combo</div>
              <div className="text-lg font-extrabold text-white font-outfit">{stats.maxCombo}x</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Math Solved</div>
              <div className="text-lg font-extrabold text-white font-outfit">{stats.mathSolved}</div>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {achievements.some((a) => a.unlocked) && (
          <div className="mb-6 text-left">
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
              Unlocked Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements
                .filter((a) => a.unlocked)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.title}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-base font-outfit shadow-xl shadow-sky-500/25 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center justify-center p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Main Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
