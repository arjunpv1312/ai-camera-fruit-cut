import React from 'react';
import { X, TrendingUp, Target, Calculator, Trophy, Zap, BookOpen } from 'lucide-react';
import type { UserProgress } from '../types/game';

interface AnalyticsModalProps {
  progress: UserProgress;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ progress, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-sky-500/10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">Student Learning Analytics 📊</h2>
            <p className="text-xs text-slate-400">Track accuracy rates, math speed, and skill progression metrics.</p>
          </div>
        </div>

        {/* Level Progress Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/60 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold text-white text-base font-outfit">Level {progress.level} Ninja</span>
            </div>
            <span className="text-xs font-bold text-sky-400">
              {progress.xp} / {progress.nextLevelXp} XP
            </span>
          </div>

          {/* XP Bar */}
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (progress.xp / progress.nextLevelXp) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Total Cut</div>
              <div className="text-xl font-black text-white font-outfit">{progress.totalFruitsCut}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Accuracy Rate</div>
              <div className="text-xl font-black text-white font-outfit">92.4%</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Avg Solve Speed</div>
              <div className="text-xl font-black text-white font-outfit">1.8s</div>
            </div>
          </div>
        </div>

        {/* Learning Skill Mastery */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 mb-6 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Subject Skill Mastery</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Arithmetic Speed (Addition & Multiplication)</span>
              <span className="text-emerald-400">Master (94%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
              <span>Science & Nutrition Knowledge</span>
              <span className="text-sky-400">Advanced (88%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full w-[88%]" />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors border border-slate-700"
        >
          Close Dashboard
        </button>
      </div>
    </div>
  );
};
