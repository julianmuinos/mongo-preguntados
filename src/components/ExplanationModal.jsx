import React, { useEffect } from 'react';

export default function ExplanationModal({
  status, // 'correct' | 'wrong' | 'timeout'
  question,
  category,
  pointsEarned,
  wonCrown,
  onContinue,
}) {
  // Enter or Space key to continue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  const isCorrect = status === 'correct';
  const isTimeout = status === 'timeout';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isCorrect ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Status Icon */}
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xl mb-4 border ${
            isCorrect
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400 glow-emerald'
              : 'bg-rose-950/80 border-rose-500/60 text-rose-400'
          }`}
        >
          {isCorrect ? '✨' : isTimeout ? '⏱️' : '❌'}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-white tracking-tight">
          {isCorrect
            ? '¡Respuesta Correcta!'
            : isTimeout
            ? '¡Se agotó el tiempo!'
            : '¡Respuesta Incorrecta!'}
        </h3>

        {/* Crown Notification */}
        {wonCrown && (
          <div className="my-3 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm flex items-center justify-center gap-2 glow-amber animate-bounce">
            <span>👑</span>
            <span>¡Conseguiste la Corona de {category.label}! (+1 Vida recuperada)</span>
          </div>
        )}

        {/* Points or Lives result */}
        <p className="text-xs font-bold uppercase tracking-wider mt-1 mb-4 text-slate-400">
          {isCorrect ? (
            <span className="text-emerald-400 font-black text-sm">+{pointsEarned} puntos</span>
          ) : (
            <span className="text-rose-400 font-black text-sm">-1 vida restante</span>
          )}
        </p>

        {/* Explanation Card */}
        <div className="text-left bg-slate-900/90 border border-slate-800 rounded-2xl p-4 my-4 space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400">Fundamento Teórico:</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
              {question.source}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed pt-1">
            {question.explanation}
          </p>

          {/* Correct answer reminder if answered incorrectly */}
          {!isCorrect && (
            <div className="pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400 font-semibold">Respuesta correcta: </span>
              <span className="text-emerald-400 font-bold">
                {question.options[question.correctIndex]}
              </span>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full mt-4 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#00ED64] to-[#4eed8a] hover:from-[#4eed8a] hover:to-[#00ED64] shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Continuar (Presioná Enter ↵)
        </button>
      </div>
    </div>
  );
}
