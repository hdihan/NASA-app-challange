import React, { useState } from 'react';
import { Activity, Disc, Zap, Radio, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function InSightSeismicLab() {
  const [quakeType, setQuakeType] = useState('mag-4.7'); // 'mag-4.7' | 'meteor-impact'
  const [isSimulating, setIsSimulating] = useState(false);
  const [wavePhase, setWavePhase] = useState('idle'); // idle | p-wave | s-wave | core-reflection | done
  const [seismicData, setSeismicData] = useState([]);

  const handleTrigger = (type) => {
    setQuakeType(type);
    setIsSimulating(true);
    setWavePhase('p-wave');
    soundEffects.playRumble(1.4);

    // Phase 1: P-Waves (Primary compressional waves, fast)
    setTimeout(() => {
      setWavePhase('s-wave');
      soundEffects.playChirp(1200);
    }, 700);

    // Phase 2: S-Waves & Core Reflection (Liquid iron core shadow zone)
    setTimeout(() => {
      setWavePhase('core-reflection');
      soundEffects.playLockChime();
    }, 1500);

    // Generate waveform
    const data = [];
    for (let i = 0; i < 60; i++) {
      const damp = Math.exp(-i / 15);
      const val = (Math.sin(i * 0.7) * 35 + Math.sin(i * 1.8) * 15) * damp;
      data.push(val);
    }
    setSeismicData(data);

    setTimeout(() => {
      setWavePhase('done');
      setIsSimulating(false);
    }, 2800);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setWavePhase('idle');
    setSeismicData([]);
  };

  return (
    <div className="bg-space-900/90 border border-rose-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-rose-400">Engineering Mini-Lab 07</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">SEIS Vacuum Seismometer</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Marsquake Seismic Wave & Core Scanner
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Trigger a Magnitude 4.7 marsquake in Cerberus Fossae. Trace how primary P-waves and shear S-waves refract through Mars's mantle and bounce off its liquid iron core.
        </p>
      </div>

      {/* Planetary Cross-Section & Wave Ray Paths */}
      <div className="relative h-48 bg-slate-950/80 rounded-lg border border-rose-500/20 overflow-hidden flex items-center justify-center p-3">
        {/* Mars Cross-section representation */}
        <div className="relative w-44 h-44 rounded-full border-4 border-amber-800 bg-gradient-to-tr from-amber-950 to-orange-900 flex items-center justify-center overflow-hidden">
          {/* Mantle layer */}
          <div className="w-36 h-36 rounded-full border border-orange-700/60 bg-gradient-to-tr from-amber-900 to-red-900 flex items-center justify-center">
            {/* Liquid Iron Core (~1,830 km radius) */}
            <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-600 border-2 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.6)] flex flex-col items-center justify-center text-[7px] font-bold font-mono text-slate-950 text-center ${wavePhase === 'core-reflection' ? 'animate-ping' : ''}`}>
              LIQUID<br/>CORE<br/>1,830 km
            </div>
          </div>

          {/* Quake Epicenter (Cerberus Fossae) */}
          <div className="absolute top-3 left-10 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] flex items-center justify-center text-[8px] font-bold">
            ⚡
          </div>

          {/* InSight Station on Elysium Planitia */}
          <div className="absolute bottom-4 right-10 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[7px] font-mono text-cyan-200 mt-0.5">SEIS</span>
          </div>

          {/* Animated Wave Rings */}
          {(wavePhase === 'p-wave' || wavePhase === 's-wave' || wavePhase === 'core-reflection') && (
            <div className="absolute top-3 left-10 w-32 h-32 border-2 border-cyan-400/60 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Phase Indicator Badge */}
        <div className="absolute top-2 right-3 font-mono text-[9px] bg-black/60 px-2 py-1 rounded border border-rose-500/30 text-rose-300">
          STATUS: {wavePhase === 'idle' ? 'STANDBY' : wavePhase.toUpperCase()}
        </div>
      </div>

      {/* Live Seismogram Oscilloscope */}
      <div className="bg-slate-950/70 border border-rose-500/20 p-2.5 rounded-lg">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-1">
          <span>SEIS PICOMETER GROUND ACCELERATION</span>
          <span className="text-rose-400">1,319 TOTAL MARSQUAKES RECORDED</span>
        </div>
        <div className="h-16 w-full bg-black/60 rounded border border-rose-900/50 flex items-center justify-center overflow-hidden">
          {seismicData.length > 0 ? (
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <path
                d={`M 0,20 ${seismicData.map((pt, i) => `L ${(i / 60) * 100},${20 + pt * 0.4}`).join(' ')}`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.5"
              />
            </svg>
          ) : (
            <div className="w-full h-0.5 bg-rose-500/30 animate-pulse" />
          )}
        </div>
      </div>

      {/* Interior Findings Readout */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-rose-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">CRUST THICKNESS</span>
          <span className="text-xs font-bold font-mono text-amber-300">
            24 – 72 km
          </span>
          <span className="text-[8px] text-slate-500 block">Layered basalt</span>
        </div>

        <div className="bg-slate-950/70 border border-rose-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">LIQUID CORE RADIUS</span>
          <span className="text-xs font-bold font-mono text-yellow-300">
            ~1,830 km
          </span>
          <span className="text-[8px] text-slate-500 block">Iron-nickel-sulfur</span>
        </div>

        <div className="bg-slate-950/70 border border-rose-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">SEIS SENSITIVITY</span>
          <span className="text-xs font-bold font-mono text-cyan-300">
            1 Picometer
          </span>
          <span className="text-[8px] text-slate-500 block">&lt; 1 Hydrogen atom</span>
        </div>
      </div>

      {/* Trigger Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTrigger('mag-4.7')}
          disabled={isSimulating}
          className="flex-1 hud-button-mars py-2.5 px-3 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          Trigger Mag 4.7 Marsquake
        </button>
        <button
          onClick={() => handleTrigger('meteor-impact')}
          disabled={isSimulating}
          className="flex-1 py-2.5 px-3 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Trigger Meteoroid Impact
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
          title="Reset Seismograph"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
