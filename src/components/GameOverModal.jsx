import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../data/questions';

export default function GameOverModal({
  isVictory,
  score,
  highScore,
  isNewHighScore,
  stats,
  crowns,
  onRestart,
}) {
  useEffect(() => {
    if (isVictory) {
      // Fire confetti celebration
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00ED64', '#06B6D4', '#A855F7', '#FACC15'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00ED64', '#06B6D4', '#A855F7', '#FACC15'],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isVictory]);

  const totalAsked = stats.totalQuestions || 0;
  const totalCorrect = stats.correctAnswers || 0;
  const overallAccuracy = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;

  // Identify weakest category with at least 1 question asked (RF-23)
  let weakestCategory = null;
  let lowestRate = 101;

  CATEGORIES.forEach((cat) => {
    const data = stats.byCategory[cat.id];
    if (data && data.asked > 0) {
      const rate = (data.correct / data.asked) * 100;
      if (rate < lowestRate) {
        lowestRate = rate;
        weakestCategory = { ...cat, rate: Math.round(rate), ...data };
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 my-8 relative overflow-hidden text-center">
        {/* Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
            isVictory ? 'bg-amber-500/25' : 'bg-rose-500/20'
          }`}
        />

        {/* Header Icon */}
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl mb-4 border ${
            isVictory
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 glow-amber animate-bounce'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          {isVictory ? '🏆' : '💀'}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white tracking-tight">
          {isVictory ? '¡Victoria Absoluta!' : 'Fin de la Partida'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-4">
          {isVictory
            ? '¡Felicitaciones! Completaste las 6 coronas teóricas de MongoDB y Mongoose.'
            : 'Te quedaste sin vidas, pero cada partida afianza los conceptos teóricos.'}
        </p>

        {/* New High Score Banner (RF-25) */}
        {isNewHighScore ? (
          <div className="my-3 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs inline-flex items-center gap-2 glow-emerald">
            <span>🎉</span>
            <span>¡NUEVO RÉCORD HISTÓRICO: {score} PTS!</span>
          </div>
        ) : (
          <div className="my-2 text-xs font-semibold text-slate-400">
            Récord histórico: <span className="text-emerald-400 font-bold">{highScore} pts</span>
          </div>
        )}

        {/* High-level Metrics */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
            <span className="block text-[11px] font-bold uppercase text-slate-400">Puntaje</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{score}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
            <span className="block text-[11px] font-bold uppercase text-slate-400">Efectividad</span>
            <span className="text-xl sm:text-2xl font-black text-white">{overallAccuracy}%</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
            <span className="block text-[11px] font-bold uppercase text-slate-400">Coronas</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">{crowns.length}/6</span>
          </div>
        </div>

        {/* Category Breakdown (RF-23) */}
        <div className="text-left bg-slate-900/80 border border-slate-800 rounded-2xl p-4 my-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Rendimiento por Categoría:
          </h4>
          <div className="space-y-2.5">
            {CATEGORIES.map((cat) => {
              const data = stats.byCategory[cat.id] || { asked: 0, correct: 0 };
              const rate = data.asked > 0 ? Math.round((data.correct / data.asked) * 100) : 0;
              const hasCrown = crowns.includes(cat.id);

              return (
                <div key={cat.id} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span>{hasCrown ? '👑' : cat.emoji}</span>
                    <span className="font-semibold text-slate-300 truncate">{cat.label}</span>
                  </div>
                  <div className="flex-1 max-w-[120px] bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rate}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-400 w-12 text-right">
                    {data.asked > 0 ? `${rate}%` : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendation for Weakest Category (RF-23) */}
        {weakestCategory && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-left my-4 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <span>💡</span>
              <span>Recomendación de estudio:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Te conviene repasar la categoría <strong className="text-white">{weakestCategory.label}</strong>{' '}
              ({weakestCategory.sections} del PDF), donde tuviste un {weakestCategory.rate}% de aciertos.
            </p>
          </div>
        )}

        {/* Restart Button (RF-24) */}
        <button
          onClick={onRestart}
          className="w-full mt-2 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#00ED64] to-[#4eed8a] hover:from-[#4eed8a] hover:to-[#00ED64] shadow-xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          🔄 Jugar de nuevo
        </button>
      </div>
    </div>
  );
}
