import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Heart, Search } from 'lucide-react';
import { FRUIT_TRIVIA } from '../utils/triviaData';
import type { FruitType } from '../types/game';

interface NutritionModalProps {
  onClose: () => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<FruitType>('watermelon');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fruitTypes: FruitType[] = ['watermelon', 'banana', 'strawberry', 'pineapple', 'orange', 'apple', 'dragonfruit', 'kiwi', 'coconut'];
  const filteredTypes = fruitTypes.filter((t) => FRUIT_TRIVIA[t].name.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeFact = FRUIT_TRIVIA[selectedType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto select-none">
      <div className="relative w-full max-w-3xl my-auto game-panel rounded-[2rem] p-6 md:p-8 shadow-[0_0_60px_-10px_rgba(251,191,36,0.2)] corner-brackets">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition-colors border border-slate-800">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-display">Fruit Encyclopedia 🍉</h2>
            <p className="text-[11px] text-slate-500">Discover incredible superfood facts and vitamins</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fruit List */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-72 pb-2 md:pb-0 pr-1">
            {filteredTypes.map((type) => {
              const fact = FRUIT_TRIVIA[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`game-card flex items-center gap-3 p-3 !rounded-xl min-w-[140px] md:min-w-0 text-left ${
                    isSelected ? 'game-card-active' : ''
                  }`}
                >
                  <span className="text-2xl">{fact.emoji}</span>
                  <div>
                    <div className="font-black text-sm text-white">{fact.name}</div>
                    <div className="text-[10px] text-slate-500">{fact.vitamins[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Panel */}
          {activeFact && (
            <div className="md:col-span-2 flex flex-col justify-between p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{activeFact.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-black text-white font-display">{activeFact.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeFact.vitamins.map((vit, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                          {vit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-black text-amber-400 uppercase tracking-[0.15em] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Did You Know?</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeFact.funFact}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-black text-rose-400 uppercase tracking-[0.15em] mb-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Health Benefit</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeFact.healthBenefit}</p>
                </div>
              </div>

              <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-sm border border-slate-800 transition-colors">
                Back to Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
