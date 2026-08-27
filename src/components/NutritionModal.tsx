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

  const fruitTypes: FruitType[] = [
    'watermelon',
    'banana',
    'strawberry',
    'pineapple',
    'orange',
    'apple',
    'dragonfruit',
    'kiwi',
    'coconut',
  ];

  const filteredTypes = fruitTypes.filter((t) =>
    FRUIT_TRIVIA[t].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeFact = FRUIT_TRIVIA[selectedType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-3xl my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">Fruit Nutrition Encyclopedia 🍉</h2>
            <p className="text-xs text-slate-400">Discover incredible superfood facts and vitamins!</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fruits (e.g. Watermelon, Kiwi, Apple)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Fruit Cards Selector */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-72 pb-2 md:pb-0 pr-1">
            {filteredTypes.map((type) => {
              const fact = FRUIT_TRIVIA[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left min-w-[140px] md:min-w-0 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70 text-slate-400'
                  }`}
                >
                  <span className="text-2xl">{fact.emoji}</span>
                  <div>
                    <div className="font-extrabold text-sm font-outfit text-white">{fact.name}</div>
                    <div className="text-[10px] text-slate-400">{fact.vitamins[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Fact Inspection Panel */}
          {activeFact && (
            <div className="md:col-span-2 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-slate-800/70 to-slate-900/80 border border-slate-700/60 shadow-xl">
              <div>
                {/* Fruit Title Header */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{activeFact.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-black text-white font-outfit">{activeFact.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {activeFact.vitamins.map((vit, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider"
                        >
                          {vit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fun Trivia Section */}
                <div className="mb-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-sky-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Did You Know?</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeFact.funFact}</p>
                </div>

                {/* Health Benefit Section */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-rose-400 uppercase tracking-wider mb-1">
                    <Heart className="w-4 h-4" />
                    <span>Health Benefit</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeFact.healthBenefit}</p>
                </div>
              </div>

              {/* Close Action */}
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors border border-slate-700"
              >
                Back to Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
