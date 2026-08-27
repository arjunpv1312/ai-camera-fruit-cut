import React from 'react';
import { Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import type { HandSkin, UserProgress } from '../types/game';

interface HandSkinSelectorProps {
  progress: UserProgress;
  onSelectSkin: (skin: HandSkin) => void;
}

export const SKINS_CATALOG: { id: HandSkin; name: string; icon: string; unlockReq: string; color: string }[] = [
  { id: 'cyber', name: 'Cyberpunk Neon', icon: '🤖', unlockReq: 'Unlocked by Default', color: 'from-cyan-400 to-pink-500' },
  { id: 'holo', name: 'Holographic Mesh', icon: '💠', unlockReq: 'Unlocks at Level 5', color: 'from-sky-300 to-teal-400' },
  { id: 'ghost', name: 'Ghost Spirit', icon: '👻', unlockReq: 'Unlocks at Level 10', color: 'from-purple-400 to-indigo-600' },
  { id: 'rainbow', name: 'Rainbow Saber', icon: '🌈', unlockReq: 'Unlocks at Level 15', color: 'from-pink-400 via-amber-400 to-cyan-400' },
  { id: 'gold', name: 'Golden Flame', icon: '🔥', unlockReq: 'Unlocks at Level 20', color: 'from-amber-300 to-yellow-500' },
];

export const HandSkinSelector: React.FC<HandSkinSelectorProps> = ({ progress, onSelectSkin }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
        <Sparkles className="w-4 h-4 text-sky-400" />
        <span>Customize Hand Skeleton Skin</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {SKINS_CATALOG.map((skin) => {
          const isUnlocked = progress.unlockedSkins.includes(skin.id);
          const isSelected = progress.activeSkin === skin.id;

          return (
            <button
              key={skin.id}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectSkin(skin.id)}
              className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-slate-800 border-sky-400 ring-2 ring-sky-400/40 text-white scale-105 shadow-lg'
                  : isUnlocked
                  ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 text-slate-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl mb-1">{skin.icon}</span>
              <span className="text-xs font-extrabold text-center font-outfit leading-tight">{skin.name}</span>
              <span className="text-[9px] text-slate-400 mt-1">{isUnlocked ? skin.unlockReq : '🔒 Locked'}</span>

              {isSelected && (
                <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-sky-400" />
              )}
              {!isUnlocked && (
                <Lock className="absolute top-2 right-2 w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
