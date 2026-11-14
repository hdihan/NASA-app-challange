import React, { useState } from 'react';
import { Plane, ArrowUp, Wind, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function IngenuityRotorLab() {
  const [rotorRpm, setRotorRpm] = useState(0); // 0 to 2,900 RPM
  const [hoverAltMeters, setHoverAltMeters] = useState(0);

  // Mars atmospheric physics:
  // Density: 0.020 kg/m³ (~1% of Earth's 1.225 kg/m³)
  // Gravity: 0.379g (3.72 m/s²)
  // Mass: 1.8 kg -> Downward weight = 1.8 * 3.72 = 6.696 N
  // Lift-off occurs at exactly 2,537 RPM where aerodynamic thrust exceeds 6.7 N!
  const LIFTOFF_RPM = 2537;
  const isAirborne = rotorRpm >= LIFTOFF_RPM;
  const liftForceN = Number(((rotorRpm / LIFTOFF_RPM) ** 2 * 6.7).toFixed(2));
  const altitude = isAirborne ? Number(((rotorRpm - LIFTOFF_RPM) / 363 * 10).toFixed(1)) : 0;

  const handleSliderChange = (newRpm) => {
    setRotorRpm(newRpm);
    if (newRpm > 2000 && !isAirborne && newRpm >= LIFTOFF_RPM) {
      soundEffects.playLockChime();
    }
  };

  const handleTestFlight = () => {
    setRotorRpm(2700);
    soundEffects.playFlyWhoosh();
  };

  const handleReset = () => {
    setRotorRpm(0);
  };

  return (
    <div className="bg-space-900/90 border border-emerald-500/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-emerald-400">Engineering Mini-Lab 08</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Mars Air Density: 0.020 kg/m³</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          1% Thin-Air Coaxial Rotor Throttle
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Earth helicopters spin at ~500 RPM. In Mars's razor-thin air (1% Earth density), advance the throttle to find the exact 2,537 RPM required to achieve extraterrestrial flight!
        </p>
      </div>

      {/* Flight Chamber Visualizer */}
      <div className="relative h-44 bg-slate-950/80 rounded-lg border border-emerald-500/20 overflow-hidden flex flex-col justify-end items-center p-4">
        {/* Sky / Air density metric */}
        <div className="absolute top-2 left-3 font-mono text-[9px] text-slate-400">
          ATMOSPHERE: 95% CO₂ | 610 PASCALS (0.006 ATM)
        </div>

        {/* Ingenuity Helicopter Graphic */}
        <div
          className="relative transition-all duration-300 flex flex-col items-center"
          style={{ bottom: `${isAirborne ? Math.min(60, altitude * 6) : 0}px` }}
        >
          {/* Upper Rotor Blade */}
          <div
            className={`w-28 h-1 bg-cyan-300 rounded shadow-[0_0_8px_#67e8f9] transition-transform ${rotorRpm > 0 ? 'animate-spin' : ''}`}
            style={{ animationDuration: `${Math.max(0.04, (3000 - rotorRpm) / 10000)}s` }}
          />

          {/* Mast & Swashplate */}
          <div className="w-1.5 h-3 bg-slate-400" />

          {/* Lower Counter-Rotating Rotor Blade */}
          <div
            className={`w-28 h-1 bg-emerald-300 rounded shadow-[0_0_8px_#6ee7b7] transition-transform ${rotorRpm > 0 ? 'animate-spin' : ''}`}
            style={{ animationDuration: `${Math.max(0.04, (3000 - rotorRpm) / 10000)}s`, animationDirection: 'reverse' }}
          />

          {/* Fuselage Cube & Solar Panel */}
          <div className="w-8 h-8 bg-amber-600 border border-amber-300 rounded flex flex-col items-center justify-center text-[7px] font-bold font-mono text-slate-950 shadow-lg mt-0.5">
            <span>GINNY</span>
            <span className="text-[6px] text-amber-200">1.8 kg</span>
          </div>

          {/* 4 Carbon Landing Legs */}
          <div className="w-16 flex justify-between -mt-1">
            <div className="w-0.5 h-4 bg-slate-300 rotate-25" />
            <div className="w-0.5 h-4 bg-slate-300 -rotate-25" />
          </div>
        </div>

        {/* Surface Ground Line */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-900 to-orange-950 border-t border-amber-700/60 rounded" />

        {/* Airborne Altitude Badge */}
        {isAirborne && (
          <div className="absolute top-2 right-3 font-mono text-[9px] bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40 text-emerald-300 flex items-center gap-1 animate-pulse">
            <ArrowUp className="w-3 h-3" /> HOVERING AT {altitude} M
          </div>
        )}
      </div>

      {/* Throttle Slider */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-emerald-500/20 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300">Coaxial Rotor Speed (RPM):</span>
          <span className={`font-bold ${rotorRpm >= LIFTOFF_RPM ? 'text-emerald-400' : 'text-amber-400'}`}>
            {rotorRpm.toLocaleString()} RPM {rotorRpm >= LIFTOFF_RPM ? '✈ FLIGHT ACTIVE' : '(Grounded)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2900"
          step="25"
          value={rotorRpm}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
        <div className="flex justify-between text-[9px] font-mono text-slate-500">
          <span>0 RPM</span>
          <span className="text-emerald-400 font-bold">2,537 RPM (Takeoff Threshold)</span>
          <span>2,900 RPM (Max)</span>
        </div>
      </div>

      {/* Aerodynamics Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-emerald-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">VERTICAL LIFT</span>
          <span className={`text-sm font-bold font-mono ${liftForceN >= 6.7 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {liftForceN} N
          </span>
          <span className="text-[8px] text-slate-500 block">Weight: 6.7 N (0.38g)</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">TIP SPEED</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            {rotorRpm > 0 ? `${Math.round((rotorRpm * 2 * Math.PI * 0.6) / 60)} m/s` : '0 m/s'}
          </span>
          <span className="text-[8px] text-slate-500 block">Mach 0.74 limit</span>
        </div>

        <div className="bg-slate-950/70 border border-emerald-500/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">TOTAL MISSIONS</span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            72 Flights
          </span>
          <span className="text-[8px] text-slate-500 block">Planned: 5 flights</span>
        </div>
      </div>

      {/* Quick Launch & Reset Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleTestFlight}
          className="flex-1 hud-button py-2.5 px-3 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plane className="w-3.5 h-3.5 text-emerald-300" />
          Autonomous Takeoff (2,700 RPM)
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
          title="Cut Throttle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
