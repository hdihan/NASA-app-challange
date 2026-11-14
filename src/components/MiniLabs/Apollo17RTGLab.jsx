import React, { useState, useEffect } from 'react';
import { Zap, Radio, Flame, Activity, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function Apollo17RTGLab() {
  const [lunarNight, setLunarNight] = useState(true);
  const [seismicWaveTriggered, setSeismicWaveTriggered] = useState(false);
  const [geophonePoints, setGeophonePoints] = useState([]);

  // SNAP-27 RTG specs:
  // Fuel: 3.8 kg Plutonium-238 dioxide
  // Thermal output: ~1,480 W
  // Electrical output: ~70 to 73 W via 442 lead-telluride thermocouples
  const ambientTempC = lunarNight ? -173 : 117;
  const hotJunctionTempC = 590;
  const electricalWatts = 72.8;

  const handleTriggerSeismic = () => {
    setSeismicWaveTriggered(true);
    soundEffects.playRumble(1.0);

    // Generate seismic waveform points
    const points = [];
    for (let i = 0; i < 40; i++) {
      const damp = Math.exp(-i / 8);
      const amp = Math.sin(i * 0.9) * 28 * damp;
      points.push(amp);
    }
    setGeophonePoints(points);

    setTimeout(() => {
      setSeismicWaveTriggered(false);
    }, 2500);
  };

  return (
    <div className="bg-space-900/90 border border-purple-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-purple-400">Engineering Mini-Lab 04</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">SNAP-27 Radioisotope Power</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          SNAP-27 Nuclear Heat-to-Power & Seismic Array
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Observe how radioactive decay of Plutonium-238 kept the ALSEP science station powered through 14-day freezing lunar nights (-173°C) and recorded moonquakes until 1977.
        </p>
      </div>

      {/* RTG Core & Thermocouple Visualizer */}
      <div className="grid grid-cols-2 gap-3">
        {/* Core Schematic */}
        <div className="relative h-40 bg-slate-950/80 rounded-lg border border-purple-500/20 p-3 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-purple-300">PU-238 FUEL CAPSULE</div>
          {/* Radioactive Core Glow */}
          <div className="relative w-16 h-20 rounded-lg bg-gradient-to-t from-red-600 via-amber-500 to-purple-600 border-2 border-amber-300 shadow-[0_0_24px_rgba(239,68,68,0.7)] flex flex-col items-center justify-center animate-pulse">
            <Flame className="w-6 h-6 text-white" />
            <span className="text-[8px] font-bold font-mono text-white mt-1">Pu-238</span>
            <span className="text-[7px] font-mono text-amber-100">1,480 W(th)</span>
          </div>
          {/* Heat Radiator Fins */}
          <div className="flex justify-between w-28 mt-1 text-[8px] font-mono text-slate-400">
            <span>◄ COOL FIN</span>
            <span>COOL FIN ►</span>
          </div>
        </div>

        {/* ALSEP Geophone Seismograph */}
        <div className="relative h-40 bg-slate-950/80 rounded-lg border border-purple-500/20 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center text-[9px] font-mono text-purple-300">
            <span>ALSEP SEISMOGRAPH</span>
            <span className={seismicWaveTriggered ? 'text-amber-400 animate-pulse' : 'text-slate-500'}>
              {seismicWaveTriggered ? 'SIGNAL ACTIVE' : 'IDLE'}
            </span>
          </div>

          {/* Oscilloscope Waveform */}
          <div className="h-20 w-full flex items-center justify-center border border-purple-900/50 bg-black/40 rounded">
            {geophonePoints.length > 0 ? (
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <path
                  d={`M 0,20 ${geophonePoints.map((pt, i) => `L ${(i / 40) * 100},${20 + pt * 0.4}`).join(' ')}`}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <div className="w-full h-0.5 bg-purple-500/30" />
            )}
          </div>

          <div className="text-[8px] font-mono text-slate-400 flex justify-between">
            <span>Geophone #1</span>
            <span>Taurus-Littrow Subsurface</span>
          </div>
        </div>
      </div>

      {/* Thermocouple Telemetry Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-purple-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">OUTSIDE ENVIRONMENT</span>
          <span className="text-xs font-bold font-mono text-sky-300">
            {ambientTempC}°C
          </span>
          <span className="text-[8px] text-slate-500 block">{lunarNight ? 'Lunar Night' : 'Lunar Noon'}</span>
        </div>

        <div className="bg-slate-950/70 border border-purple-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">NUCLEAR CORE TEMP</span>
          <span className="text-xs font-bold font-mono text-rose-400">
            {hotJunctionTempC}°C
          </span>
          <span className="text-[8px] text-slate-500 block">Alpha decay</span>
        </div>

        <div className="bg-slate-950/70 border border-purple-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">CONTINUOUS POWER</span>
          <span className="text-xs font-bold font-mono text-emerald-400">
            {electricalWatts} W
          </span>
          <span className="text-[8px] text-slate-500 block">Lead-telluride</span>
        </div>
      </div>

      {/* Interactive Toggles & Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setLunarNight(!lunarNight)}
          className="flex-1 py-2 px-3 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 rounded-lg text-xs font-mono text-purple-200 cursor-pointer transition-colors"
        >
          Toggle: {lunarNight ? '🌙 Lunar Night (-173°C)' : '☀️ Lunar Day (+117°C)'}
        </button>

        <button
          onClick={handleTriggerSeismic}
          disabled={seismicWaveTriggered}
          className="flex-1 hud-button py-2 px-3 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Activity className="w-3.5 h-3.5 text-purple-300" />
          Trigger Seismic Pulse
        </button>
      </div>
    </div>
  );
}
