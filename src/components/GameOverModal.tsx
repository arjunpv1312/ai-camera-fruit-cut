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
    // Fire double celebratory confetti cannons!
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { x: 0.2, y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { x: 0.8, y: 0.6 },
      });
    }, 250);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto select-none ambient-spotlight">
      <div className="relative w-full max-w-xl my-auto glass-panel-luxury border border-slate-700/80 rounded-[2.5rem] p-6 md:p-8 shadow-[0_0_80px_-10px_rgba(245,158,11,0.3)] text-center overflow-hidden">
        {/* Top Gold Ambient Glow Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Top Trophy Icon */}
        <div className="mx-auto w-18 h-18 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight">MISSION DEBRIEF</h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1">Excellent performance in the air arena!</p>

        {/* Final Score Card */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/70 shadow-2xl relative overflow-hidden">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Battle Score</div>
          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 font-outfit mt-1 drop-shadow-md">
            {stats.score.toLocaleString()}
          </div>
          {stats.xpEarned && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-black">
              <span>+{stats.xpEarned} XP Earned</span>
            </div>
          )}
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fruits Sliced</div>
              <div className="text-xl font-black text-white font-outfit">{stats.fruitsCut}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Accuracy</div>
              <div className="text-xl font-black text-white font-outfit">{stats.accuracy}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Max Combo</div>
              <div className="text-xl font-black text-white font-outfit">{stats.maxCombo}x</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Math Solved</div>
              <div className="text-xl font-black text-white font-outfit">{stats.mathSolved}</div>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {achievements.some((a) => a.unlocked) && (
          <div className="mb-6 text-left">
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2.5">
              Unlocked Badges
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements
                .filter((a) => a.unlocked)
                .map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-black shadow-md"
                  >
                    <span className="text-base">{badge.icon}</span>
                    <span>{badge.title}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-slate-950 font-black text-base font-outfit shadow-xl shadow-sky-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex items-center justify-center p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700 hover:scale-105"
            title="Main Menu"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
