import React from 'react';
import { CATEGORIES } from '../data/questions';

export default function RulesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 my-8 relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl font-black text-white tracking-tight">
              Cómo se juega a MongoPreguntados
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">
              🎯 Objetivo del Juego
            </h4>
            <p className="leading-relaxed">
              Conseguir las <strong>6 coronas temáticas</strong> respondiendo
              correctamente preguntas basadas en el documento oficial de MongoDB
              y Mongoose.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">
              👑 ¿Cómo ganar una corona?
            </h4>
            <p className="leading-relaxed">
              Cada acierto consecutivo aumenta tu racha. Al llegar a{' '}
              <strong>3 aciertos seguidos</strong> podés elegir jugar un desafío
              de corona en una categoría pendiente. Si acertás la pregunta, ¡te
              llevás la corona y recuperás 1 vida!
            </p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">
              ❤️ Vidas y Tiempo
            </h4>
            <p className="leading-relaxed">
              Empezás con <strong>3 vidas</strong>. Cada fallo o tiempo agotado
              descuenta 1 vida y reinicia tu racha. Tenés{' '}
              <strong>20 segundos</strong> por pregunta.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">
              ⚡ Comodines (1 uso por partida)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li>
                <strong>50/50:</strong> Descarta 2 opciones incorrectas.
              </li>
              <li>
                <strong>+15s:</strong> Suma 15 segundos extra al temporizador.
              </li>
              <li>
                <strong>Pasar:</strong> Descarta la pregunta sin penalización y
                vuelve a la ruleta.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-2">
              📚 Las 6 Categorías Oficiales
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"
                >
                  <span>{cat.emoji}</span>
                  <div>
                    <span className="font-bold text-white block">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cat.sections}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-wider mb-1">
              ⌨️ Atajos de Teclado
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300">
                Espacio: Girar
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300">
                1, 2, 3, 4: Responder
              </span>
              <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300">
                Enter: Continuar
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
        >
          ¡Entendido, a jugar!
        </button>
      </div>
    </div>
  );
}
