import React, { useState } from 'react';
import { Gauge, Compass, Mountain, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function Apollo15RoverLab() {
  const [slopeAngle, setSlopeAngle] = useState(12); // degrees (0 to 25)
  const [tireMode, setTireMode] = useState('wire-mesh'); // 'wire-mesh' | 'rubber'
  const [speedKmh, setSpeedKmh] = useState(10);
  const [isDriving, setIsDriving] = useState(false);

  // In 1/6th gravity with fine powdery regolith:
  // Rubber tires accumulate electrostatic dust and lose traction above 15°
  // Woven wire-mesh tires shed dust through the open mesh and climb up to 25°
  const isBoggedDown = tireMode === 'rubber' && slopeAngle > 14;
  const tractionScore = tireMode === 'wire-mesh'
    ? Math.max(98 - Math.round(slopeAngle * 0.8), 75)
    : Math.max(90 - Math.round(slopeAngle * 3.8), 15);

  const handleDriveToggle = () => {
    setIsDriving(!isDriving);
    soundEffects.playChirp(isDriving ? 600 : 900);
  };

  return (
    <div className="bg-space-900/90 border border-amber-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-amber-400">Engineering Mini-Lab 02</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">1/6th Earth Gravity (1.62 m/s²)</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          1/6th Gravity Wire-Mesh Traction Drive
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Test LRV-1's woven piano-wire mesh tires against rubber tires on steep Hadley-Apennine slopes. Observe how open wire mesh sheds electrostatic dust.
        </p>
      </div>

      {/* Slope & Rover Visual Canvas */}
      <div className="relative h-44 bg-slate-950/80 rounded-lg border border-amber-500/20 overflow-hidden flex items-end justify-center p-4">
        {/* Sky / Moon Horizon */}
        <div className="absolute top-2 left-3 flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <Mountain className="w-3.5 h-3.5 text-amber-400" />
          <span>Apennine Mountain Front — Spur Crater Route</span>
        </div>

        {/* Dynamic Slope Surface */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="regolithGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          {/* Ground polygon tilted by slopeAngle */}
          <polygon
            points={`0,176 0,${150 - slopeAngle * 2.8} 450,${150 + slopeAngle * 1.5} 450,176`}
            fill="url(#regolithGrad)"
          />
        </svg>

        {/* Rover Representation */}
        <div
          className={`relative z-10 flex flex-col items-center transition-transform duration-300 ${
            isBoggedDown ? 'animate-bounce' : isDriving ? 'translate-x-1' : ''
          }`}
          style={{ transform: `rotate(${-slopeAngle * 0.7}deg)` }}
        >
          {/* Buggy Frame & Crew Seat */}
          <div className="w-24 h-10 border-2 border-amber-400/80 bg-amber-950/40 rounded flex items-center justify-between px-2 text-[9px] font-mono text-amber-200">
            <span>LRV-1</span>
            <span>{tireMode === 'wire-mesh' ? 'MESH' : 'RUBBER'}</span>
          </div>

          {/* Wheels */}
          <div className="w-28 flex justify-between -mt-2">
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold ${
                tireMode === 'wire-mesh'
                  ? 'border-cyan-400 bg-slate-800 text-cyan-300'
                  : 'border-slate-500 bg-slate-900 text-slate-400'
              } ${isDriving && !isBoggedDown ? 'animate-spin' : ''}`}
            >
              {tireMode === 'wire-mesh' ? '⚙' : '●'}
            </div>
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-mono font-bold ${
                tireMode === 'wire-mesh'
                  ? 'border-cyan-400 bg-slate-800 text-cyan-300'
                  : 'border-slate-500 bg-slate-900 text-slate-400'
              } ${isDriving && !isBoggedDown ? 'animate-spin' : ''}`}
            >
              {tireMode === 'wire-mesh' ? '⚙' : '●'}
            </div>
          </div>
        </div>

        {/* Status overlay badge */}
        <div className="absolute bottom-2 right-3 font-mono text-[10px]">
          {isBoggedDown ? (
            <span className="text-red-400 flex items-center gap-1 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
              <AlertTriangle className="w-3 h-3" /> BOGGED DOWN IN DUST!
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              <CheckCircle className="w-3 h-3" /> NOMINAL TRACTION
            </span>
          )}
        </div>
      </div>

      {/* Control Sliders & Radios */}
      <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-amber-500/20">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-300">Lunar Slope Incline:</span>
          <span className="font-mono text-amber-300 font-bold">{slopeAngle}° (Max tested: 25°)</span>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          value={slopeAngle}
          onChange={(e) => setSlopeAngle(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-mono text-slate-300">Tire Construction:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setTireMode('wire-mesh')}
              className={`text-xs px-2.5 py-1 rounded font-mono cursor-pointer transition-colors ${
                tireMode === 'wire-mesh'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Woven Piano-Wire Mesh
            </button>
            <button
              onClick={() => setTireMode('rubber')}
              className={`text-xs px-2.5 py-1 rounded font-mono cursor-pointer transition-colors ${
                tireMode === 'rubber'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Standard Rubber
            </button>
          </div>
        </div>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[10px] text-slate-400 block font-mono">TRACTION EFFICIENCY</span>
          <span className={`text-sm font-bold font-mono ${tractionScore > 70 ? 'text-emerald-400' : 'text-red-400'}`}>
            {tractionScore}%
          </span>
        </div>
        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[10px] text-slate-400 block font-mono">DRIVE SPEED</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            {isBoggedDown ? 0 : speedKmh} km/h
          </span>
        </div>
        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[10px] text-slate-400 block font-mono">TOTAL RANGE</span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            27.9 km
          </span>
        </div>
      </div>

      {/* Historical Discovery Note */}
      <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200/90 leading-relaxed">
        <span className="font-bold text-amber-300 block">Historic Achievement:</span>
        This open wire-mesh tire innovation allowed Scott and Irwin to reach Spur Crater and discover the 4.1-billion-year-old <strong>'Genesis Rock' (Sample 15415)</strong>, confirming the Moon was once covered in an ocean of molten magma!
      </div>
    </div>
  );
}
