import React from 'react';
import { Volume2, VolumeX, BookOpen, Filter, Sparkles } from 'lucide-react';
import { PLANETS } from '../data/artifacts';
import { soundEffects } from '../services/soundEffects';

export default function NavigationBar({
  activePlanetId,
  onChangePlanet,
  isMuted,
  onToggleMute,
  onOpenCitations,
  artifactFilter,
  onToggleFilter,
  abandonedCount,
  totalCount
}) {
  const activePlanet = PLANETS[activePlanetId.toUpperCase()];

  const handlePlanetChange = (newPlanetId) => {
    if (newPlanetId === activePlanetId) return;
    soundEffects.playFlyWhoosh();
    onChangePlanet(newPlanetId);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-30 px-4 py-3 flex items-center justify-between pointer-events-none">
      {/* Left: BYTESTAR Team Branding & Challenge Subtitle */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 px-4 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.25)]">
          {/* 3D Orbital Spinning BYTESTAR Emblem */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            {/* Outer Glowing Orbital Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/80 animate-spin-slow shadow-[0_0_15px_rgba(0,229,255,0.7)]" />
            {/* Counter-rotating Inner Ring */}
            <div className="absolute inset-1 rounded-full border border-amber-400/60 animate-spin-reverse opacity-70" />
            {/* Core Cosmic Star Gem */}
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.9)] transform rotate-45">
              <Sparkles className="w-3.5 h-3.5 text-white transform -rotate-45 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,229,255,0.6)]">
                BYTESTAR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-400/50 font-bold uppercase tracking-widest shadow-sm">
                NASA SPACE APPS 2026
              </span>
            </div>
            <div className="text-xs sm:text-sm font-body font-medium text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-400 font-semibold">Abandoned but not Forgotten:</span>
              <span className="text-slate-400 hidden md:inline">NASA's Discarded Equipment on the Moon and Mars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Planetary Switcher & Clear Distance From Earth Telemetry */}
      <div className="hidden xl:flex items-center gap-3 pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl">
        <button
          onClick={() => handlePlanetChange('moon')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-display text-sm font-bold transition-all cursor-pointer ${
            activePlanetId === 'moon'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.6)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 shadow-[0_0_6px_#fff]" />
          <span>THE MOON</span>
        </button>

        <button
          onClick={() => handlePlanetChange('mars')}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-display text-sm font-bold transition-all cursor-pointer ${
            activePlanetId === 'mars'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-[0_0_6px_#f97316]" />
          <span>MARS</span>
        </button>

        <div className="h-5 w-px bg-slate-700 mx-1" />

        {/* Clear Reference Distance Telemetry */}
        <div className="px-3 text-xs font-mono text-cyan-300 flex items-center gap-3 font-semibold">
          <span className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            📍 {activePlanet.distanceDisplay}
          </span>
          <span className="text-slate-400 hidden 2xl:inline">
            Gravity: <strong className="text-white font-mono">{activePlanet.gravity}</strong>
          </span>
        </div>
      </div>

      {/* Right Controls: Filter Toggle, Settings, Citations, Audio */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Mobile Planet Toggle */}
        <div className="xl:hidden flex items-center bg-slate-950/90 border border-slate-700 rounded-xl p-1">
          <button
            onClick={() => handlePlanetChange('moon')}
            className={`px-3 py-1.5 text-xs font-display rounded-lg ${
              activePlanetId === 'moon' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Moon
          </button>
          <button
            onClick={() => handlePlanetChange('mars')}
            className={`px-3 py-1.5 text-xs font-display rounded-lg ${
              activePlanetId === 'mars' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-300'
            }`}
          >
            Mars
          </button>
        </div>

        {/* Artifact Filter Toggle */}
        <div className="flex items-center bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-xl gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 mx-1" />
          <button
            onClick={() => {
              soundEffects.playChirp(900);
              onToggleFilter('abandoned');
            }}
            className={`filter-toggle-btn px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-display ${
              artifactFilter === 'abandoned'
                ? 'active-abandoned'
                : 'bg-transparent border-transparent text-slate-400 hover:text-amber-300'
            }`}
            title="Show only the 5 abandoned artifacts"
          >
            🏛️ Abandoned Only ({abandonedCount})
          </button>
          <button
            onClick={() => {
              soundEffects.playChirp(1000);
              onToggleFilter('all');
            }}
            className={`filter-toggle-btn px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-display ${
              artifactFilter === 'all'
                ? 'active-all'
                : 'bg-transparent border-transparent text-slate-400 hover:text-cyan-300'
            }`}
            title="Show all 8 legacy hardware units"
          >
            🛸 All Legacy ({totalCount})
          </button>
        </div>

        {/* Citations & AI Disclosure */}
        <button
          onClick={() => {
            soundEffects.playChirp(900);
            onOpenCitations();
          }}
          className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-colors shadow-lg"
          title="NASA NSSDCA Citations & Competition Disclosure"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Global Audio Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer transition-colors shadow-lg"
          title={isMuted ? 'Unmute Audio & Voice' : 'Mute Audio & Voice'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
}
