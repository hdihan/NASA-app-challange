import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity, Award, Radio } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function Apollo11LaserLab() {
  const [status, setStatus] = useState('idle'); // idle | firing | returning | completed
  const [elapsedMs, setElapsedMs] = useState(0);
  const [recessionMm, setRecessionMm] = useState(38); // 3.8 cm/yr -> 38 mm
  const [photonsReturned, setPhotonsReturned] = useState(0);
  const animRef = useRef(null);
  const startTimeRef = useRef(0);

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
        setPhotonsReturned(Math.floor(1 + Math.random() * 4)); // Only a few photons survive the 768,800 km journey!
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

  const progress = Math.min(elapsedMs / TOTAL_SIM_DURATION_MS, 1);
  const currentDistanceKm = status === 'firing'
    ? Math.round((elapsedMs / (TOTAL_SIM_DURATION_MS / 2)) * 384400)
    : status === 'returning' || status === 'completed'
    ? 384400
    : 0;

  return (
    <div className="bg-space-900/90 border border-cyan-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400">Engineering Mini-Lab 01</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">NSSDCA DE421 Grounding</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Earth-to-Moon Laser Ranging Experiment
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Fire a 532nm green Nd:YAG laser pulse from Apache Point Observatory to Apollo 11's 100 corner-cube retroreflector array. Measure the photon round-trip time to prove lunar recession.
        </p>
      </div>

      {/* Visual Animation Stage */}
      <div className="relative h-36 bg-slate-950/80 rounded-lg border border-cyan-500/20 overflow-hidden flex items-center px-6">
        {/* Earth Station */}
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 via-emerald-600 to-sky-400 border border-cyan-300 shadow-lg flex items-center justify-center text-[10px] font-bold">
            EARTH
          </div>
          <span className="text-[10px] font-mono text-cyan-300 mt-1">Observatory</span>
        </div>

        {/* Laser Path Line */}
        <div className="flex-1 relative mx-4 h-1 bg-slate-800">
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

          {/* Photon pulse head */}
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
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-500 border border-slate-300 shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-900 text-center leading-tight">
            MOON<br/><span className="text-[8px] text-slate-700">LRRR</span>
          </div>
          <span className="text-[10px] font-mono text-slate-300 mt-1">Tranquility</span>
        </div>
      </div>

      {/* Telemetry Output Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-950/60 border border-cyan-500/20 rounded-lg p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block font-mono">ROUND-TRIP TIME</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {(elapsedMs / 1000).toFixed(3)} s
          </span>
          <span className="text-[9px] text-slate-500 block">Nominal: ~2.564s</span>
        </div>

        <div className="bg-slate-950/60 border border-cyan-500/20 rounded-lg p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block font-mono">CALCULATED DISTANCE</span>
          <span className="text-base font-bold font-mono text-emerald-300">
            {currentDistanceKm.toLocaleString()} km
          </span>
          <span className="text-[9px] text-slate-500 block">c = 299,792.458 km/s</span>
        </div>

        <div className="bg-slate-950/60 border border-cyan-500/20 rounded-lg p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block font-mono">LUNAR RECESSION</span>
          <span className="text-base font-bold font-mono text-amber-300">
            +{recessionMm / 10} cm / yr
          </span>
          <span className="text-[9px] text-slate-500 block">Tidal friction proof</span>
        </div>
      </div>

      {/* Scientific Confirmation Banner */}
      {status === 'completed' && (
        <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-2 animate-fade-in">
          <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-emerald-300">Laser Ranging Echo Verified ({photonsReturned} Photons Detected)</span>
            Laser pulses confirm the Moon recedes at exactly 3.8 cm/year and verify Einstein's General Relativity to 10⁻¹⁴ precision!
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleFireLaser}
          disabled={status === 'firing' || status === 'returning'}
          className="flex-1 hud-button py-2.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          {status === 'firing' ? 'Photon Outbound...' : status === 'returning' ? 'Echo Inbound...' : 'Fire Observatory Laser'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
          title="Reset Simulator"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
