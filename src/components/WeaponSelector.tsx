import React from 'react';
import type { WeaponType, WeaponInfo } from '../types/game';
import { audioEngine } from '../utils/audioEngine';

interface WeaponSelectorProps {
  currentWeapon: WeaponType;
  onSelectWeapon: (weapon: WeaponType) => void;
}

export const WEAPON_CATALOG: Record<WeaponType, WeaponInfo> = {
  katana: { id: 'katana', name: 'Dual Katanas', emoji: '⚔️', description: 'Precision air edge slicing with energy blade trails', color: 'from-amber-400 to-rose-500', soundFx: 'katana' },
  hammer: { id: 'hammer', name: 'Thunder Hammer', emoji: '🔨', description: 'Hand slam sends electrical shockwaves!', color: 'from-cyan-400 to-blue-600', soundFx: 'hammer' },
  laser: { id: 'laser', name: 'Plasma Cannon', emoji: '🔫', description: 'Open palm shoots energy laser beams!', color: 'from-emerald-400 to-teal-500', soundFx: 'laser' },
  frost: { id: 'frost', name: 'Frost Gauntlet', emoji: '❄️', description: 'Freeze fruits mid-air, then shatter!', color: 'from-sky-300 to-indigo-500', soundFx: 'frost' },
  vortex: { id: 'vortex', name: 'Gravity Vortex', emoji: '🌌', description: 'Fist pulls all fruits into a black hole!', color: 'from-purple-500 to-fuchsia-600', soundFx: 'vortex' },
};

export const WeaponSelector: React.FC<WeaponSelectorProps> = ({ currentWeapon, onSelectWeapon }) => {
  const weaponsList = Object.values(WEAPON_CATALOG);

  const handleSelect = (w: WeaponType) => {
    audioEngine.playButtonClick();
    if (w === 'hammer') audioEngine.playHammerShockwave();
    if (w === 'laser') audioEngine.playLaserBeam();
    if (w === 'frost') audioEngine.playFrostFreeze();
    if (w === 'vortex') audioEngine.playVortexPull();
    if (w === 'katana') audioEngine.playKatanaSlice();
    onSelectWeapon(w);
  };

  return (
    <div className="pointer-events-auto flex items-center justify-center gap-1.5 p-2 rounded-2xl game-panel">
      {weaponsList.map((w) => {
        const isSelected = currentWeapon === w.id;
        return (
          <button
            key={w.id}
            onClick={() => handleSelect(w.id)}
            className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
            }`}
            title={`${w.name}: ${w.description}`}
          >
            <span className="text-lg leading-none group-hover:scale-110 transition-transform">{w.emoji}</span>
            <span className="hidden sm:inline text-[11px] font-black tracking-wide">{w.name}</span>
          </button>
        );
      })}
    </div>
  );
};
