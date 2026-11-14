import React, { useState } from 'react';
import { Sparkles, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export default function SpiritPlowLab() {
  const [dragTrenchMeters, setDragTrenchMeters] = useState(0); // 0 to 10 meters
  const [isDrivingBackward, setIsDrivingBackward] = useState(false);
  const [silicaRevealed, setSilicaRevealed] = useState(false);

  const handleDriveStep = () => {
    if (dragTrenchMeters >= 10) return;
    setIsDrivingBackward(true);
    soundEffects.playChirp(700);

    const nextMeters = Math.min(dragTrenchMeters + 2, 10);
    setDragTrenchMeters(nextMeters);

    if (nextMeters >= 4) {
      setSilicaRevealed(true);
      soundEffects.playLockChime();
    }

    setTimeout(() => setIsDrivingBackward(false), 300);
  };

  const handleReset = () => {
    setDragTrenchMeters(0);
    setSilicaRevealed(false);
  };

  return (
    <div className="bg-space-900/90 border border-amber-600/30 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-amber-600/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
          <span className="text-xs uppercase tracking-widest font-mono text-amber-500">Engineering Mini-Lab 06</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Gusev Crater (Home Plate)</span>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          5-Wheel Backward Plow & Silica Discovery
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          In 2006, Spirit's right-front drive motor jammed. JPL began driving backward, dragging the seized wheel. Scrape away red dust to reveal what lay beneath!
        </p>
      </div>

      {/* Regolith Trench Visualizer */}
      <div className="relative h-44 bg-slate-950/80 rounded-lg border border-amber-600/30 overflow-hidden p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>DRAGGED RIGHT-FRONT TRENCH</span>
          <span>SILICA PURITY: {silicaRevealed ? '91.4% SiO₂' : '0% (Covered)'}</span>
        </div>

        {/* Ground Surface with Scraped Trench */}
        <div className="relative w-full h-20 bg-gradient-to-r from-amber-900 via-orange-950 to-amber-950 rounded border-t-2 border-amber-800 overflow-hidden flex items-center">
          {/* Uncovered Silica Layer (Bright White/Opaline) */}
          <div
            className="absolute top-2 left-0 h-10 bg-gradient-to-r from-slate-100 via-cyan-50 to-white shadow-[0_0_16px_rgba(255,255,255,0.7)] transition-all duration-300 rounded-r flex items-center justify-center border-y-2 border-white"
            style={{ width: `${(dragTrenchMeters / 10) * 100}%` }}
          >
            {silicaRevealed && (
              <span className="text-[10px] font-bold font-mono text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600 animate-spin" /> PURE SILICA
              </span>
            )}
          </div>

          {/* Rover Graphic Moving Backward (Right to Left) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center"
            style={{ left: `calc(${(dragTrenchMeters / 10) * 80}% + 10px)` }}
          >
            {/* Frozen wheel drag plow marker */}
            <div className="w-4 h-6 bg-red-600 border border-white rounded-sm shadow-md" title="Jammed Front-Right Wheel" />
            <div className="w-16 h-8 bg-slate-800 border border-amber-500/80 rounded ml-1 flex items-center justify-center text-[8px] font-mono text-amber-200">
              SPIRIT ◄
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Start Point (Sol 1,150)</span>
          <span>10 Meters Backward</span>
        </div>
      </div>

      {/* Discovery Achievement Banner */}
      {silicaRevealed && (
        <div className="bg-cyan-950/60 border border-cyan-500/50 rounded-lg p-3 text-xs text-cyan-200 flex items-start gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-cyan-300">Hydrothermal Silica Discovered!</span>
            The dragged wheel sliced open 91% pure opaline silica—proving ancient Mars had bubbling volcanic hot springs and steam vents identical to Yellowstone, ideal for microbial life!
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-950/70 border border-amber-600/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">TRENCH DISTANCE</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            {dragTrenchMeters} / 10 m
          </span>
        </div>

        <div className="bg-slate-950/70 border border-amber-600/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">DRIVE MODE</span>
          <span className="text-sm font-bold font-mono text-rose-400">
            5-Wheel Reverse
          </span>
        </div>

        <div className="bg-slate-950/70 border border-amber-600/20 p-2 rounded text-center">
          <span className="text-[9px] text-slate-400 block font-mono">LOCKED ACTUATOR</span>
          <span className="text-sm font-bold font-mono text-cyan-300">
            Wheel #1 (Right-Front)
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleDriveStep}
          disabled={dragTrenchMeters >= 10}
          className="flex-1 hud-button-mars py-2.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          {dragTrenchMeters >= 10 ? 'Silica Deposit Fully Exposed' : 'Drive Backward & Drag Jammed Wheel'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 cursor-pointer transition-colors"
          title="Reset Plow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
