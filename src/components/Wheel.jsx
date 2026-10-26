import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/questions';
import { soundManager } from '../utils/audio';

export default function Wheel({ onSpinEnd, isSpinning, setIsSpinning, disabled }) {
  const [rotation, setRotation] = useState(0);
  const audioIntervalRef = useRef(null);
  const wheelRef = useRef(null);

  // SVG dimensions
  const size = 380;
  const center = size / 2;
  const radius = center - 16;
  const numSlices = CATEGORIES.length; // 6
  const anglePerSlice = 360 / numSlices; // 60 deg

  // Generate SVG path for a circular slice
  const getSlicePath = (index) => {
    const startAngle = (index * anglePerSlice - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSlice - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);

    // Pick random category index (0 to 5)
    const targetIndex = Math.floor(Math.random() * numSlices);
    const targetCategory = CATEGORIES[targetIndex];

    // Calculate required rotation so that target slice lands at the top pointer (0 deg / -90 in svg)
    // Center of slice `targetIndex` is at (targetIndex * 60 + 30) degrees from top.
    const sliceCenterAngle = targetIndex * anglePerSlice + anglePerSlice / 2;
    // To bring sliceCenterAngle to the top (0 deg), we need wheel rotation to end at (360 - sliceCenterAngle) mod 360.
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const currentRotMod = rotation % 360;
    const targetMod = (360 - sliceCenterAngle) % 360;
    let extraRotation = targetMod - currentRotMod;
    if (extraRotation < 0) extraRotation += 360;
    // Add subtle jitter within +/- 15 deg so it doesn't always hit dead center
    const jitter = (Math.random() - 0.5) * 16;
    const totalNewRotation = rotation + fullSpins * 360 + extraRotation + jitter;

    setRotation(totalNewRotation);

    // Audio ticks during spin
    let tickCount = 0;
    const maxTicks = 28;
    const tickInterval = 140;
    audioIntervalRef.current = setInterval(() => {
      soundManager.playSpinTick();
      tickCount++;
      if (tickCount >= maxTicks) {
        clearInterval(audioIntervalRef.current);
      }
    }, tickInterval);

    // Complete spin after 4.2 seconds
    setTimeout(() => {
      clearInterval(audioIntervalRef.current);
      setIsSpinning(false);
      onSpinEnd(targetCategory);
    }, 4200);
  };

  // Keyboard shortcut: Spacebar to spin (RF-4)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpinning && !disabled && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, disabled, rotation]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Glow Halo */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Pointer Indicator */}
      <div className="relative z-20 -mb-5 flex flex-col items-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <div className="w-8 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
          <span className="text-xs">🔻</span>
        </div>
        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-500 -mt-1" />
      </div>

      {/* Wheel Container */}
      <div className="relative w-[340px] sm:w-[380px] h-[340px] sm:h-[380px] drop-shadow-2xl">
        <svg
          ref={wheelRef}
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4.2s cubic-bezier(0.12, 0.8, 0.15, 1)'
              : 'none',
          }}
        >
          <defs>
            {/* Outer border gradient */}
            <radialGradient id="rim-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="90%" stopColor="#1e293b" />
              <stop offset="98%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Outer Ring */}
          <circle cx={center} cy={center} r={radius + 8} fill="url(#rim-gradient)" stroke="#475569" strokeWidth="4" />

          {/* Slices */}
          {CATEGORIES.map((cat, idx) => {
            const midAngle = idx * anglePerSlice + anglePerSlice / 2 - 90;
            const textDist = radius * 0.65;
            const textX = center + textDist * Math.cos(midAngle * (Math.PI / 180));
            const textY = center + textDist * Math.sin(midAngle * (Math.PI / 180));

            return (
              <g key={cat.id}>
                {/* Sector wedge */}
                <path
                  d={getSlicePath(idx)}
                  fill={cat.color}
                  stroke="#0f172a"
                  strokeWidth="3"
                  className="transition-opacity hover:opacity-95"
                />

                {/* Content group rotated towards center */}
                <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#0f172a"
                    className="font-extrabold text-[15px] select-none"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.4)' }}
                  >
                    {cat.emoji}
                  </text>
                  <text
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#0f172a"
                    className="font-bold text-[10px] tracking-wider uppercase select-none"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                  >
                    {cat.label.split(' ')[0]}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Inner separator line rings */}
          <circle cx={center} cy={center} r={radius * 0.32} fill="#0b0f19" stroke="#334155" strokeWidth="4" />
        </svg>

        {/* Center Spin Button (Stationary / Overlay) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning || disabled}
            aria-label="Girar ruleta"
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-extrabold shadow-2xl border-4 transition-all duration-200 transform ${
              isSpinning || disabled
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed scale-95'
                : 'bg-gradient-to-tr from-[#00684A] via-[#00ED64] to-[#4eed8a] text-slate-950 border-white hover:scale-105 active:scale-95 glow-emerald cursor-pointer'
            }`}
          >
            <span className="text-xl leading-none">🎲</span>
            <span className="text-xs uppercase tracking-wider font-black mt-1">
              {isSpinning ? 'GIRANDO...' : 'GIRAR'}
            </span>
          </button>
        </div>
      </div>

      {/* Helpful Hint */}
      <p className="mt-4 text-xs text-slate-400 font-medium text-center">
        Presioná <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">Espacio</kbd> o hacé clic en el centro para girar
      </p>
    </div>
  );
}
