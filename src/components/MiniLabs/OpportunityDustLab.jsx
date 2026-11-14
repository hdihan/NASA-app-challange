import React, { useState } from 'react';
import { Sun, CloudRain, AlertOctagon, Wind, RotateCcw, BatteryCharging } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function OpportunityDustLab() {
  const [tauOpacity, setTauOpacity] = useState(0.8); // 0.5 (clear) to 10.8 (June 2018 storm)

  // Solar calculation:
  // Sunlight transmission follows Beer-Lambert law: I = I_0 * exp(-Tau)
  // At Tau 0.5: ~900 Wh/sol
  // At Tau 10.8: ~22 Wh/sol (below 24 Wh clock survival threshold)
  const sunlightPercent = Math.max(0.1, Number((Math.exp(-tauOpacity * 0.45) * 100).toFixed(1)));
  const solarWh = Math.max(18, Math.round(900 * Math.exp(-tauOpacity * 0.38)));
  const isCritical = tauOpacity >= 8.5;

  const handleDustDevilCleaning = () => {
    setTauOpacity(0.6);
    soundEffects.playFlyWhoosh();
  };

  return (
    <div className="bg-space-900/90 border border-amber-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-amber-500">Engineering Mini-Lab 05</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Meridiani Planum (Sol 5,111)</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          2018 Global Dust Storm Solar Survival Simulator
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Simulate the planet-encircling dust storm of June 2018. Drag atmospheric opacity (Tau) from clear sky (0.5) to apocalyptic darkness (10.8) to observe battery starvation.
        </p>
      </div>

      {/* Visual Sky & Rover Canvas */}
      <div
        className="relative h-44 rounded-lg border border-amber-500/30 overflow-hidden flex flex-col justify-between p-4 transition-colors duration-500"
        style={{
          backgroundColor: `rgb(${Math.max(8, Math.round(180 * (1 - (tauOpacity / 10.8) * 0.95)))}, ${Math.max(5, Math.round(80 * (1 - (tauOpacity / 10.8) * 0.95)))}, ${Math.max(8, Math.round(60 * (1 - (tauOpacity / 10.8) * 0.95)))})`
        }}
      >
        {/* Dimming Sun */}
        <div className="flex justify-between items-start z-10">
          <div className="font-mono text-[10px] text-amber-200 bg-black/40 px-2 py-0.5 rounded">
            MARTIAN SKY ILLUMINATION: {sunlightPercent}%
          </div>
          <div
            className="w-10 h-10 rounded-full bg-amber-100 shadow-[0_0_20px_#fde047] transition-opacity duration-300 flex items-center justify-center"
            style={{ opacity: Math.max(0.05, 1 - (tauOpacity / 10.8)) }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Opportunity Rover Graphic */}
        <div className="flex flex-col items-center z-10">
          <div className="w-28 h-6 bg-slate-800 border border-amber-400/60 rounded flex items-center justify-around px-2 text-[9px] font-mono text-amber-300">
            <span>MER-B SOLAR WINGS</span>
            <span>{solarWh} Wh</span>
          </div>
          <div className="w-32 flex justify-between px-1">
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-600" />
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-600" />
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-600" />
          </div>
        </div>

        {/* Critical alert overlay */}
        {isCritical && (
          <div className="absolute inset-x-4 bottom-3 bg-red-950/90 border border-red-500/60 rounded p-2 text-xs text-red-200 flex items-center gap-2 animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-mono">
              CRITICAL POWER FAULT: <strong>"My battery is low and it's getting dark."</strong>
            </span>
          </div>
        )}
      </div>

      {/* Tau Opacity Slider */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-amber-500/20 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300">Atmospheric Dust Opacity (Tau):</span>
          <span className={`font-bold ${tauOpacity > 8 ? 'text-red-400' : 'text-amber-400'}`}>
            τ = {tauOpacity.toFixed(1)} {tauOpacity >= 10 ? '(Sol 5,111 Final Storm)' : ''}
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="10.8"
          step="0.1"
          value={tauOpacity}
          onChange={(e) => setTauOpacity(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-slate-500">
          <span>0.5 (Clear Sol)</span>
          <span>5.0 (Moderate Storm)</span>
          <span>10.8 (June 2018 Blackout)</span>
        </div>
      </div>

      {/* Power Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">SOLAR ENERGY</span>
          <span className={`text-sm font-bold font-mono ${solarWh < 50 ? 'text-red-400' : 'text-amber-300'}`}>
            {solarWh} Wh/sol
          </span>
          <span className="text-[8px] text-slate-500 block">Nominal: ~900 Wh</span>
        </div>

        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">BATTERY STATUS</span>
          <span className={`text-sm font-bold font-mono ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
            {isCritical ? 'DEPLETED' : `${Math.round((solarWh / 900) * 100)}%`}
          </span>
          <span className="text-[8px] text-slate-500 block">Li-Ion Cells</span>
        </div>

        <div className="bg-slate-950/70 border border-amber-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">ODOMETER RECORD</span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            45.16 km
          </span>
          <span className="text-[8px] text-slate-500 block">1st Planet Marathon</span>
        </div>
      </div>

      {/* Dust Devil Cleaning Event Button */}
      <button
        onClick={handleDustDevilCleaning}
        className="w-full py-2.5 px-3 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg text-xs font-mono text-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        <Wind className="w-3.5 h-3.5 text-cyan-400" />
        Trigger Passing Martian Dust Devil (Clean Panels)
      </button>
    </div>
  );
}
