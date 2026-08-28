import React from 'react';
import { X, Sparkles, Play } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const steps = [
    { num: '1', title: 'Raise Hands Facing Webcam', desc: 'Position your hands in front of your camera. Your glowing hand gauntlet will appear on screen!', color: 'text-amber-400 bg-amber-500/15 border-amber-500/20' },
    { num: '2', title: 'Use Gestures & Weapons', desc: '✋ Open Palm fires Plasma Lasers. ✊ Clenched Fist creates a Gravity Vortex pulling all fruits!', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
    { num: '3', title: 'Mouse / Touch Fallback', desc: 'Webcam off? Simply click and swipe your mouse or finger across the screen to slice!', color: 'text-purple-400 bg-purple-500/15 border-purple-500/20' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl overflow-y-auto select-none">
      <div className="relative w-full max-w-xl my-auto game-panel rounded-[2rem] p-6 md:p-8 shadow-[0_0_60px_-10px_rgba(251,191,36,0.2)] text-center corner-brackets">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition-colors border border-slate-800">
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <h2 className="text-3xl font-black text-white font-display">How to Play 🖐️</h2>
        <p className="text-slate-500 text-xs mt-1">Your hands in the air are your weapons!</p>

        <div className="my-6 space-y-3 text-left">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className={`p-2 rounded-lg border font-black text-sm ${step.color}`}>{step.num}</div>
              <div>
                <div className="font-black text-sm text-white">{step.title}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all glow-ring"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>GOT IT, LET'S PLAY!</span>
        </button>
      </div>
    </div>
  );
};
