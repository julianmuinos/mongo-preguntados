import React from 'react';
import { CATEGORIES } from '../data/questions';

export default function Header({
  lives,
  score,
  streak,
  crowns,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md rounded-2xl mt-2 shadow-lg">
      {/* Brand & Help */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-xl shadow-md shadow-emerald-900/40 border border-emerald-300/30">
          🍃
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            MongoPreguntados
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">ITBA · Clase 16</p>
        </div>
      </div>

      {/* Crowns Collection Bar (RF-16) */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
          Coronas:
        </span>
        {CATEGORIES.map((cat) => {
          const hasCrown = crowns.includes(cat.id);
          return (
            <div
              key={cat.id}
              title={`${cat.label}: ${hasCrown ? 'Corona conseguida' : 'Pendiente'}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
                hasCrown
                  ? 'bg-amber-400 text-slate-950 scale-105 shadow-md shadow-amber-500/30 ring-2 ring-amber-300 font-extrabold'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-700/60 opacity-40'
              }`}
            >
              {hasCrown ? '👑' : cat.emoji}
            </div>
          );
        })}
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Lives (RF-16) */}
        <div
          className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800"
          title={`Vidas: ${lives}/3`}
        >
          {[1, 2, 3].map((val) => (
            <span
              key={val}
              className={`text-base transition-transform ${
                val <= lives ? 'opacity-100 scale-105' : 'opacity-20 grayscale'
              }`}
            >
              ❤️
            </span>
          ))}
        </div>

        {/* Streak (RF-13, RF-16) */}
        <div
          className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800"
          title={`Racha: ${streak} seguidas (${3 - streak} para jugar por Corona)`}
        >
          <span className="text-amber-400 text-sm animate-pulse">🔥</span>
          <div className="flex flex-col">
            <span className="text-xs font-black text-amber-300">
              {streak}/3
            </span>
          </div>
        </div>

        {/* Score (RF-16) */}
        <div className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40 text-emerald-300">
          <span className="text-xs font-extrabold">⭐</span>
          <span className="text-xs font-black tracking-tight">{score}</span>
        </div>

        {/* Sound Toggle (RF-27) */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* How to play / Rules button (RF-1) */}
        <button
          onClick={onOpenRules}
          title="Reglas del juego"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer text-sm"
        >
          ❓
        </button>
      </div>
    </header>
  );
}
