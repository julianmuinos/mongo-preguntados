import React from 'react';
import { CATEGORIES } from '../data/questions';

export default function CrownPickerModal({ availableCrownIds, onSelectCategory }) {
  // Filter categories that player doesn't have yet
  const eligibleCategories = CATEGORIES.filter((c) => availableCrownIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/40 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Crown Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-amber-950/80 border border-amber-500/60 text-amber-400 shadow-xl mb-3 glow-amber animate-bounce">
          👑
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight">
          ¡Racha de 3 aciertos!
        </h3>
        <p className="text-xs text-amber-300 font-semibold mt-1 mb-5">
          Elegí por cuál corona querés jugar en este turno:
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
          {eligibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800/90 hover:border-amber-500/50 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer text-left group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base border"
                style={{
                  backgroundColor: `${cat.color}20`,
                  borderColor: `${cat.color}40`,
                }}
              >
                {cat.emoji}
              </div>
              <div className="flex-1">
                <span className="block text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.label}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {cat.sections}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Si acertás la pregunta, te llevás la corona y recuperás 1 vida.
        </p>
      </div>
    </div>
  );
}
