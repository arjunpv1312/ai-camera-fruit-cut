import React from 'react';
import { X, Sparkles, Play } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto select-none">
      <div className="relative w-full max-w-xl my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-sky-500/10 text-center">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-4 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <h2 className="text-3xl font-black text-white font-outfit">How to Play with Air Hands 🖐️</h2>
        <p className="text-slate-400 text-xs mt-1">Zero controllers needed — your hands in the air are your weapons!</p>

        <div className="my-6 space-y-3 text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 font-extrabold text-sm font-outfit">1</div>
            <div>
              <div className="font-extrabold text-sm text-white font-outfit">Raise Hands Facing Webcam</div>
              <p className="text-xs text-slate-400">Position your hands in front of your camera. Your glowing hand gauntlet will appear on screen!</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-sm font-outfit">2</div>
            <div>
              <div className="font-extrabold text-sm text-white font-outfit">Use Gestures & Weapons</div>
              <p className="text-xs text-slate-400">✋ <b>Open Palm</b> fires Plasma Lasers. ✊ <b>Clenched Fist</b> creates a Gravity Vortex pulling all fruits into a black hole!</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-sm font-outfit">3</div>
            <div>
              <div className="font-extrabold text-sm text-white font-outfit">Mouse / Touch Screen Fallback</div>
              <p className="text-xs text-slate-400">If your webcam is turned off, simply click and swipe your mouse or finger across the screen to slice!</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 text-slate-950 font-black text-base font-outfit shadow-xl transition-all hover:scale-105"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>GOT IT, LET'S PLAY!</span>
        </button>
      </div>
    </div>
  );
};
