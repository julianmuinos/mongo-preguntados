import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../utils/audio';

export default function QuestionCard({
  question,
  category,
  isCrownQuestion,
  onSelectOption,
  onTimeout,
  onUseFiftyFifty,
  onUseExtraTime,
  onUseSkip,
  powerUps, // { fiftyFifty: boolean, extraTime: boolean, skip: boolean } (true = available)
  hiddenOptionIndices, // Set of indices hidden by 50/50
  selectedOptionIndex,
  isAnswered,
}) {
  const [secondsLeft, setSecondsLeft] = useState(20);
  const totalTime = useRef(20);
  const startTimeRef = useRef(Date.now());
  const timerIdRef = useRef(null);
  const hasTimedOutRef = useRef(false);

  // Initialize or reset timer when question changes
  useEffect(() => {
    setSecondsLeft(20);
    totalTime.current = 20;
    startTimeRef.current = Date.now();
    hasTimedOutRef.current = false;

    if (timerIdRef.current) clearInterval(timerIdRef.current);

    timerIdRef.current = setInterval(() => {
      if (isAnswered) {
        clearInterval(timerIdRef.current);
        return;
      }

      // Delta timestamp based calculation (CL-9)
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, totalTime.current - elapsed);
      setSecondsLeft(remaining);

      // Low time tick sound
      if (remaining <= 5 && remaining > 0) {
        soundManager.playWarningTick();
      }

      // Timeout trigger
      if (remaining === 0 && !hasTimedOutRef.current) {
        hasTimedOutRef.current = true;
        clearInterval(timerIdRef.current);
        onTimeout();
      }
    }, 250);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [question.id, isAnswered]);

  // Handle +15s powerup
  const handleExtraTime = () => {
    if (!powerUps.extraTime || isAnswered) return;
    totalTime.current += 15;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setSecondsLeft(Math.max(0, totalTime.current - elapsed));
    onUseExtraTime();
  };

  // Keyboard shortcuts: 1, 2, 3, 4 for options (RF-8)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnswered) return;
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (e.key in keyMap) {
        const idx = keyMap[e.key];
        if (!hiddenOptionIndices.includes(idx)) {
          onSelectOption(idx, secondsLeft);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, hiddenOptionIndices, secondsLeft, onSelectOption]);

  const progressPct = Math.min(100, Math.max(0, (secondsLeft / 20) * 100));
  const isUrgent = secondsLeft <= 5;

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-slate-800">
      {/* Top Banner: Category and Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border shadow-sm"
            style={{
              backgroundColor: `${category.color}20`,
              color: category.color,
              borderColor: `${category.color}40`,
            }}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </span>

          <span className="text-[11px] font-semibold text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
            {question.source}
          </span>

          {isCrownQuestion && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
              👑 Desafío de Corona
            </span>
          )}
        </div>

        {/* Circular / Linear Countdown Timer (RF-7) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800">
            <span className={`text-xs ${isUrgent ? 'animate-bounce text-red-400' : 'text-slate-400'}`}>
              ⏱️
            </span>
            <span
              className={`font-mono text-base font-black transition-colors ${
                isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-200'
              }`}
            >
              {secondsLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-1.5 bg-slate-800/80 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isUrgent ? 'bg-red-500 shadow-md shadow-red-500/50' : 'bg-emerald-400 shadow-md shadow-emerald-400/50'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="my-5">
        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {question.question}
        </h2>

        {/* Optional Code Snippet (CL-10) */}
        {question.codeSnippet && (
          <div className="mt-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300">
            <pre className="whitespace-pre">{question.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* 4 Options Grid (RF-8, RF-9, RF-10) */}
      <div className="grid grid-cols-1 gap-2.5 my-5">
        {question.options.map((opt, idx) => {
          const isHidden = hiddenOptionIndices.includes(idx);
          if (isHidden) {
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-dashed border-slate-800/50 bg-slate-900/20 opacity-30 text-xs font-mono text-slate-600 text-center select-none"
              >
                (Opción descartada por 50/50)
              </div>
            );
          }

          let btnStyle =
            'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 text-slate-200 hover:border-slate-700 active:scale-[0.99]';

          if (isAnswered) {
            if (idx === question.correctIndex) {
              btnStyle =
                'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-500/50';
            } else if (idx === selectedOptionIndex) {
              btnStyle =
                'bg-rose-950/80 border-rose-500/80 text-rose-200 font-bold shadow-lg shadow-rose-900/30';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-900 text-slate-500 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelectOption(idx, secondsLeft)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 transition-all duration-150 cursor-pointer ${btnStyle}`}
            >
              <span className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0">
                {idx + 1}
              </span>
              <span className="text-sm sm:text-base font-medium flex-1">{opt}</span>
              {isAnswered && idx === question.correctIndex && (
                <span className="text-emerald-400 font-extrabold text-lg">✓</span>
              )}
              {isAnswered && idx === selectedOptionIndex && idx !== question.correctIndex && (
                <span className="text-rose-400 font-extrabold text-lg">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Power-ups / Comodines Bar (RF-17, RF-18, RF-19, RF-20) */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Comodines:
        </span>

        <div className="flex items-center gap-2">
          {/* 50/50 */}
          <button
            onClick={onUseFiftyFifty}
            disabled={!powerUps.fiftyFifty || isAnswered || hiddenOptionIndices.length > 0}
            title={powerUps.fiftyFifty ? 'Descartar 2 opciones incorrectas' : 'Comodín 50/50 ya utilizado'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              powerUps.fiftyFifty && !isAnswered && hiddenOptionIndices.length === 0
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60 hover:scale-105 active:scale-95'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span>🌓</span>
            <span>50/50</span>
          </button>

          {/* +15s */}
          <button
            onClick={handleExtraTime}
            disabled={!powerUps.extraTime || isAnswered}
            title={powerUps.extraTime ? 'Sumar 15 segundos al temporizador' : 'Comodín +15s ya utilizado'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              powerUps.extraTime && !isAnswered
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-300 hover:bg-blue-900/60 hover:scale-105 active:scale-95'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span>⏳</span>
            <span>+15s</span>
          </button>

          {/* Pasar */}
          <button
            onClick={onUseSkip}
            disabled={!powerUps.skip || isAnswered}
            title={powerUps.skip ? 'Pasar de pregunta sin penalización' : 'Comodín Pasar ya utilizado'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              powerUps.skip && !isAnswered
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 hover:scale-105 active:scale-95'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span>⏭️</span>
            <span>Pasar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
