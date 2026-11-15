import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Award, Sparkles } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function Apollo11LaserLab() {
  const [status, setStatus] = useState('idle'); // idle | firing | returning | completed
  const [elapsedMs, setElapsedMs] = useState(0);
  const [recessionMm, setRecessionMm] = useState(38); // 3.8 cm/yr -> 38 mm
  const [photonsReturned, setPhotonsReturned] = useState(0);
  const animRef = useRef(null);
  const startTimeRef = useRef(0);
  const stageRef = useRef(null);

  // Speed of light in km/s: 299,792.458
  // Distance: ~384,400 km -> Round-trip: 768,800 km -> ~2.564 seconds
  const TOTAL_SIM_DURATION_MS = 2564;

  const handleFireLaser = () => {
    if (status === 'firing' || status === 'returning') return;
    setStatus('firing');
    setElapsedMs(0);
    setPhotonsReturned(0);
    soundEffects.playLaserFire();
    startTimeRef.current = performance.now();

    // Auto-scroll stage into view smoothly if needed
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      setElapsedMs(Math.min(elapsed, TOTAL_SIM_DURATION_MS));

      if (elapsed < TOTAL_SIM_DURATION_MS / 2) {
        setStatus('firing');
        animRef.current = requestAnimationFrame(animate);
      } else if (elapsed < TOTAL_SIM_DURATION_MS) {
        setStatus('returning');
        animRef.current = requestAnimationFrame(animate);
      } else {
        setStatus('completed');
        soundEffects.playLaserEcho();
        setPhotonsReturned(Math.floor(1 + Math.random() * 4));
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setStatus('idle');
    setElapsedMs(0);
    setPhotonsReturned(0);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const currentDistanceKm = status === 'firing'
    ? Math.round((elapsedMs / (TOTAL_SIM_DURATION_MS / 2)) * 384400)
    : status === 'returning' || status === 'completed'
    ? 384400
    : 0;

  return (
    <div className="bg-space-900/95 border border-cyan-500/30 rounded-xl p-3 text-white flex flex-col gap-2.5 shadow-xl select-none">
      {/* Compact Header with Fire Controls Right on Top */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="text-[11px] font-heading font-bold text-white truncate">
            Earth-to-Moon Laser Ranging (LRRR)
          </span>
        </div>

        {/* Action Controls Docked Right at Top so User NEVER Has to Scroll! */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleFireLaser}
            disabled={status === 'firing' || status === 'returning'}
            className="hud-button py-1 px-3 rounded-lg font-heading text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>{status === 'firing' ? 'Firing...' : status === 'returning' ? 'Echoing...' : 'Fire Laser'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Visual Animation Stage - Immediate Direct Visibility */}
      <div
        ref={stageRef}
        className="relative h-24 bg-slate-950/90 rounded-lg border border-cyan-500/30 overflow-hidden flex items-center px-4 shadow-inner"
      >
        {/* Earth Station */}
        <div className="flex flex-col items-center z-10 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 via-emerald-600 to-sky-400 border border-cyan-300 shadow-md flex items-center justify-center text-[8px] font-bold">
            EARTH
          </div>
          <span className="text-[8px] font-mono text-cyan-300 mt-0.5">Observatory</span>
        </div>

        {/* Laser Path Line */}
        <div className="flex-1 relative mx-3 h-1 bg-slate-800">
          {/* Firing Beam (Earth -> Moon) */}
          {status === 'firing' && (
            <div
              className="absolute top-0 left-0 h-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
              style={{ width: `${(elapsedMs / (TOTAL_SIM_DURATION_MS / 2)) * 100}%` }}
            />
          )}

          {/* Returning Beam (Moon -> Earth) */}
          {status === 'returning' && (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-400/20" />
              <div
                className="absolute top-0 right-0 h-full bg-cyan-400 shadow-[0_0_12px_#00e5ff]"
                style={{ width: `${((elapsedMs - TOTAL_SIM_DURATION_MS / 2) / (TOTAL_SIM_DURATION_MS / 2)) * 100}%` }}
              />
            </>
          )}

          {status === 'completed' && (
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-400/40" />
          )}

          {/* Glowing Photon Pulse Head */}
          {(status === 'firing' || status === 'returning') && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_16px_#34d399] -ml-1.5"
              style={{
                left: status === 'firing'
                  ? `${(elapsedMs / (TOTAL_SIM_DURATION_MS / 2)) * 100}%`
                  : `${(1 - ((elapsedMs - TOTAL_SIM_DURATION_MS / 2) / (TOTAL_SIM_DURATION_MS / 2))) * 100}%`
              }}
            />
          )}
        </div>

        {/* Apollo 11 LRRR on the Moon */}
        <div className="flex flex-col items-center z-10 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-500 border border-slate-300 shadow-md flex items-center justify-center text-[8px] font-bold text-slate-900 text-center leading-tight">
            MOON<br/><span className="text-[7px] text-slate-700">LRRR</span>
          </div>
          <span className="text-[8px] font-mono text-slate-300 mt-0.5">Tranquility</span>
        </div>
      </div>

      {/* Telemetry Output Grid (Compact 3-column row) */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-950/70 border border-cyan-500/20 rounded-lg p-1.5">
          <span className="text-[9px] text-slate-400 block font-mono">ROUND-TRIP</span>
          <span className="text-xs font-bold font-mono text-cyan-300">
            {(elapsedMs / 1000).toFixed(3)}s
          </span>
        </div>

        <div className="bg-slate-950/70 border border-cyan-500/20 rounded-lg p-1.5">
          <span className="text-[9px] text-slate-400 block font-mono">DISTANCE</span>
          <span className="text-xs font-bold font-mono text-emerald-300">
            {currentDistanceKm.toLocaleString()} km
          </span>
        </div>

        <div className="bg-slate-950/70 border border-cyan-500/20 rounded-lg p-1.5">
          <span className="text-[9px] text-slate-400 block font-mono">RECESSION</span>
          <span className="text-xs font-bold font-mono text-amber-300">
            +{recessionMm / 10} cm/yr
          </span>
        </div>
      </div>

      {/* Scientific Confirmation Banner */}
      {status === 'completed' && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-2 text-[11px] text-emerald-200 flex items-start gap-1.5 animate-fade-in">
          <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-bold text-emerald-300">Laser Ranging Echo Verified ({photonsReturned} Photons Detected)</span>
            <span className="block text-[10px] text-slate-300 mt-0.5">Proves the Moon recedes 3.8 cm/yr and verifies General Relativity to 10⁻¹⁴ precision!</span>
          </div>
        </div>
      )}
    </div>
  );
}
