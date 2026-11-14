import React, { useState } from 'react';
import { Shovel, ShieldCheck, ArrowDown, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function Surveyor3ScoopLab() {
  const [trenchDepthCm, setTrenchDepthCm] = useState(0); // 0 to 17.5 cm
  const [bearingStrengthNcm2, setBearingStrengthNcm2] = useState(0);
  const [isExcavating, setIsExcavating] = useState(false);
  const [clearedApollo12, setClearedApollo12] = useState(false);

  const handleDigStep = () => {
    if (trenchDepthCm >= 17.5) return;
    setIsExcavating(true);
    soundEffects.playChirp(800 + trenchDepthCm * 30);

    const nextDepth = Math.min(Number((trenchDepthCm + 3.5).toFixed(1)), 17.5);
    setTrenchDepthCm(nextDepth);

    // Bearing strength increases slightly with depth as regolith consolidates (3 to 8 N/cm²)
    const calculatedStrength = Number((3.2 + (nextDepth / 17.5) * 4.6).toFixed(1));
    setBearingStrengthNcm2(calculatedStrength);

    if (nextDepth >= 14) {
      setClearedApollo12(true);
      soundEffects.playLockChime();
    }

    setTimeout(() => setIsExcavating(false), 300);
  };

  const handleReset = () => {
    setTrenchDepthCm(0);
    setBearingStrengthNcm2(0);
    setClearedApollo12(false);
  };

  return (
    <div className="bg-space-900/90 border border-sky-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-sky-400">Engineering Mini-Lab 03</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Oceanus Procellarum</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Regolith Bearing-Strength Scoop Lab
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Operate Surveyor 3's motorized pantograph claw to dig a 17.5 cm deep trench in lunar regolith. Verify the soil will not swallow the heavy Apollo Lunar Module.
        </p>
      </div>

      {/* Soil Cross-Section & Claw Visualizer */}
      <div className="relative h-44 bg-slate-950/80 rounded-lg border border-sky-500/20 overflow-hidden p-4 flex flex-col justify-between">
        {/* Sky / Surface Boundary */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>SURVEYOR 3 PANTOGRAPH MECHANISM</span>
          <span>MAX DEPTH: 17.5 CM</span>
        </div>

        {/* Dynamic Regolith Strata */}
        <div className="relative w-full h-24 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded border-t-2 border-slate-500 overflow-hidden">
          {/* Excavated trench hole */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-20 bg-slate-950/90 border-x-2 border-b-2 border-sky-400/50 transition-all duration-300 rounded-b"
            style={{ height: `${(trenchDepthCm / 17.5) * 100}%` }}
          >
            <div className="text-center font-mono text-[9px] text-sky-300 pt-1">
              {trenchDepthCm > 0 ? `${trenchDepthCm} cm` : ''}
            </div>
          </div>

          {/* Pantograph Scoop Head */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col items-center"
            style={{ top: `${Math.max(0, (trenchDepthCm / 17.5) * 65)}%` }}
          >
            <div className="w-1 bg-amber-400 h-6" />
            <div className={`w-8 h-4 bg-amber-500 border border-amber-300 rounded-b flex items-center justify-center text-[8px] font-bold text-slate-950 ${isExcavating ? 'rotate-12' : ''}`}>
              CLAW
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>0 cm (Surface Powder)</span>
          <span>17.5 cm (Compacted Bedrock)</span>
        </div>
      </div>

      {/* Live Measurement Readouts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950/70 border border-sky-500/20 p-2.5 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 block font-mono">TRENCH PENETRATION</span>
          <span className="text-base font-bold font-mono text-sky-300">
            {trenchDepthCm} / 17.5 cm
          </span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-sky-400 h-full transition-all duration-300"
              style={{ width: `${(trenchDepthCm / 17.5) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-950/70 border border-sky-500/20 p-2.5 rounded-lg text-center">
          <span className="text-[10px] text-slate-400 block font-mono">SOIL BEARING STRENGTH</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {bearingStrengthNcm2 > 0 ? `${bearingStrengthNcm2} N/cm²` : '---'}
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Apollo Safety Req: &gt; 3.0 N/cm²</span>
        </div>
      </div>

      {/* Clearance Banner */}
      {clearedApollo12 && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-2 animate-fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-emerald-300">Apollo 12 Touchdown Cleared!</span>
            Surveyor 3's claw confirmed the lunar soil supports heavy landers. 2.5 years later, Pete Conrad & Alan Bean walked right up to Surveyor 3!
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDigStep}
          disabled={trenchDepthCm >= 17.5}
          className="flex-1 hud-button py-2.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
          {trenchDepthCm >= 17.5 ? 'Max Trench Depth Reached' : 'Extend Claw & Dig 3.5 cm'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
          title="Reset Scoop"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
