import React from 'react';
import { X, TrendingUp, Target, Calculator, Trophy, Zap, BookOpen } from 'lucide-react';
import type { UserProgress } from '../types/game';

interface AnalyticsModalProps {
  progress: UserProgress;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ progress, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto select-none">
      <div className="relative w-full max-w-2xl my-auto game-panel rounded-[2rem] p-6 md:p-8 shadow-[0_0_60px_-10px_rgba(251,191,36,0.2)] corner-brackets">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition-colors border border-slate-800">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">Learning Analytics 📊</h2>
            <p className="text-[11px] text-slate-500">Track accuracy, speed, and skill progression</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-black text-white text-base">Level {progress.level} Ninja</span>
            </div>
            <span className="text-[10px] font-black text-amber-400 tracking-wider">
              {progress.xp} / {progress.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (progress.xp / progress.nextLevelXp) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          {[
            { icon: <Zap className="w-5 h-5" />, label: 'Total Cut', value: progress.totalFruitsCut, color: 'text-amber-400 bg-amber-500/15 border-amber-500/20' },
            { icon: <Target className="w-5 h-5" />, label: 'Accuracy Rate', value: '92.4%', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
            { icon: <Calculator className="w-5 h-5" />, label: 'Avg Solve', value: '1.8s', color: 'text-purple-400 bg-purple-500/15 border-purple-500/20' },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border ${m.color}`}>{m.icon}</div>
              <div>
                <div className="text-[9px] font-black uppercase text-slate-500 tracking-wider">{m.label}</div>
                <div className="text-xl font-black text-white">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Skill Mastery */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 mb-6 space-y-3.5">
          <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Skill Mastery</span>
          </div>
          {[
            { name: 'Arithmetic Speed', pct: 94, color: 'bg-emerald-400', label: 'Master (94%)', labelColor: 'text-emerald-400' },
            { name: 'Nutrition Knowledge', pct: 88, color: 'bg-amber-400', label: 'Advanced (88%)', labelColor: 'text-amber-400' },
          ].map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between text-[11px] font-black text-slate-400 mb-1">
                <span>{skill.name}</span>
                <span className={skill.labelColor}>{skill.label}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-sm border border-slate-800 transition-colors">
          Close Dashboard
        </button>
      </div>
    </div>
  );
};
