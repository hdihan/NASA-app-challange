import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  BookOpen,
  Lightbulb,
  Milestone,
  Clock,
  Wrench,
  HeartHandshake,
  Volume2,
  Square,
  Crosshair,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import HardwareViewer3D from './HardwareViewer3D';
import Apollo11LaserLab from './MiniLabs/Apollo11LaserLab';
import Apollo15RoverLab from './MiniLabs/Apollo15RoverLab';
import Surveyor3ScoopLab from './MiniLabs/Surveyor3ScoopLab';
import Apollo17RTGLab from './MiniLabs/Apollo17RTGLab';
import OpportunityDustLab from './MiniLabs/OpportunityDustLab';
import SpiritPlowLab from './MiniLabs/SpiritPlowLab';
import InSightSeismicLab from './MiniLabs/InSightSeismicLab';
import IngenuityRotorLab from './MiniLabs/IngenuityRotorLab';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';

const SUBSYSTEM_COLORS = [
  { border: 'border-cyan-400/80', bg: 'bg-cyan-950/60', text: 'text-cyan-300', dot: 'bg-cyan-400', glow: 'shadow-[0_0_15px_rgba(0,229,255,0.4)]' },
  { border: 'border-amber-400/80', bg: 'bg-amber-950/60', text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]' },
  { border: 'border-emerald-400/80', bg: 'bg-emerald-950/60', text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]' },
  { border: 'border-purple-400/80', bg: 'bg-purple-950/60', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
  { border: 'border-rose-400/80', bg: 'bg-rose-950/60', text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' }
];

export default function EquipmentDrawer({
  artifact,
  onClose,
  onTriggerFarewell,
  isRecovered,
  isMuted
}) {
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'engineering' | 'legacy' | 'fate' | 'minilab'
  // Starts at null so model always renders in full proper heroic 3/4 camera view upon opening!
  const [selectedSubsystemIndex, setSelectedSubsystemIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePlayingSection, setActivePlayingSection] = useState(null);
  const [hasElevenKey, setHasElevenKey] = useState(speechService.hasElevenLabsKey());

  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      setHasElevenKey(state.hasKey);
      if (!state.isSpeaking) {
        setActivePlayingSection(null);
      }
    });
    return () => unsub();
  }, []);

  // When opening a new artifact, start in full model view with no subsystem auto-selected
  useEffect(() => {
    setSelectedSubsystemIndex(null);
  }, [artifact]);

  // Stable callback prevents any model angle change when switching tabs
  const handleSelectSubsystem = useCallback((sub, idx) => {
    setSelectedSubsystemIndex(idx);
  }, []);

  if (!artifact) return null;

  // Single-Voice Speech Controller with Zero Overlap Guarantee
  const handlePlaySection = (sectionKey, text) => {
    soundEffects.playChirp(1200);
    setActivePlayingSection(sectionKey);
    speechService.speak(text, artifact.voiceProfile, () => {
      setActivePlayingSection(null);
    });
  };

  const handleStopVoice = () => {
    soundEffects.playChirp(800);
    speechService.stop();
    setActivePlayingSection(null);
  };

  const renderMiniLab = () => {
    switch (artifact.id) {
      case 'apollo-11':
        return <Apollo11LaserLab />;
      case 'apollo-15':
        return <Apollo15RoverLab />;
      case 'surveyor-3':
      case 'viking-1':
        return <Surveyor3ScoopLab />;
      case 'apollo-17':
        return <Apollo17RTGLab />;
      case 'opportunity':
        return <OpportunityDustLab />;
      case 'spirit':
        return <SpiritPlowLab />;
      case 'insight':
        return <InSightSeismicLab />;
      case 'ingenuity':
      case 'perseverance':
      case 'maven':
        return <IngenuityRotorLab />;
      case 'mro':
      case 'mgs':
      default:
        return <Apollo11LaserLab />;
    }
  };

  const distanceText =
    artifact.body === 'Moon'
      ? '384,400 km (1.28 Light-Sec)'
      : '~225,000,000 km (12.5 Light-Min)';

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-2xl flex flex-col text-white h-screen overflow-hidden animate-fade-in select-none">
      {/* 1. Sleek Top Header Bar (Height: 76px) */}
      <header className="h-[76px] px-6 border-b border-cyan-500/30 bg-slate-950/95 flex items-center justify-between shrink-0 gap-4">
        {/* Left: BYTESTAR Emblem & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/80 animate-spin-slow shadow-[0_0_12px_rgba(0,229,255,0.6)]" />
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.8)] rotate-45">
              <Sparkles className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                BYTESTAR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-widest">
                3D CAD INSPECTOR
              </span>
            </div>
            <div className="text-xs font-body font-medium text-slate-400">
              Abandoned but not Forgotten: NASA's Discarded Equipment on the Moon and Mars
            </div>
          </div>
        </div>

        {/* Right: Farewell Ritual + Close / Back Button */}
        <div className="flex items-center gap-3">
          {artifact.statusType === 'abandoned' && (
            <button
              onClick={() => {
                soundEffects.playLockChime();
                speechService.stop();
                onTriggerFarewell(artifact);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-heading font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Farewell Ritual</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playChirp(700);
              speechService.stop();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/80 text-slate-200 hover:text-white font-heading text-xs font-bold transition-all cursor-pointer shadow-md"
            title="Return to Planet Orbit View"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Planet</span>
          </button>
        </div>
      </header>

      {/* 2. Structured Desktop Split-Screen Layout (Height: calc(100vh - 76px)) */}
      <div className="h-[calc(100vh-76px)] w-full flex flex-col lg:flex-row overflow-hidden">
        {/* Left Stage (60% Width): 3D Viewport with Status Pill and Control Bar */}
        <div className="w-full lg:w-[60%] h-full relative overflow-hidden bg-slate-950 border-r border-cyan-500/30 flex flex-col">
          <HardwareViewer3D
            artifact={artifact}
            selectedSubsystemIndex={selectedSubsystemIndex}
            onSelectSubsystem={handleSelectSubsystem}
            onBackToPlanet={onClose}
          />
        </div>

        {/* Right Inspector Panel (40% Width): Neat Card Layout with Complete Information */}
        <div className="w-full lg:w-[40%] h-full flex flex-col bg-slate-950/95 backdrop-blur-2xl overflow-hidden p-6 gap-3.5 justify-between border-l border-slate-800/80">
          {/* Top Info Card */}
          <div className="flex flex-col gap-1.5 shrink-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {artifact.statusType === 'abandoned' ? (
                <span className="badge-abandoned text-xs px-2.5 py-1 font-bold shrink-0">
                  🏛️ ABANDONED ARTIFACT
                </span>
              ) : (
                <span className="badge-future-monument text-xs px-2.5 py-1 font-bold shrink-0">
                  🛸 FUTURE MONUMENT
                </span>
              )}

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30 shrink-0">
                📍 {distanceText}
              </span>

              {hasElevenKey && (
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 font-bold shrink-0 shadow-sm animate-pulse">
                  🎙️ ElevenLabs HD Voice Active
                </span>
              )}
            </div>

            {/* Equipment Title (Outfit font 22px-28px) */}
            <h2 className="font-heading font-black text-2xl lg:text-[26px] text-white tracking-tight leading-tight mt-0.5">
              {artifact.name}
            </h2>

            {/* Subtitle & Location */}
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>📍 {artifact.location}</span>
              <span>•</span>
              <span className="text-cyan-400">Launch: {artifact.launchYear}</span>
              <span>•</span>
              <span className="text-slate-300">NSSDCA: {artifact.nssdcaId}</span>
            </div>
          </div>

          {/* Middle Story Tabs & Complete Information Section */}
          <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-4 gap-3 overflow-hidden min-h-0 shadow-inner">
            {/* Story Tabs Bar */}
            <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('story'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'story'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mission Story</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('engineering'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'engineering'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Engineering</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('legacy'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'legacy'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Milestone className="w-3.5 h-3.5" />
                <span>Legacy</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('fate'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'fate'
                    ? 'bg-rose-500 text-slate-950 shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Final Fate</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('minilab'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'minilab'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Mini-Lab</span>
              </button>
            </div>

            {/* Chapter Header + Listen & Stop Voice Buttons */}
            <div className="flex items-center justify-between shrink-0">
              <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                {activeTab === 'story' && '1. The Mission Story'}
                {activeTab === 'engineering' && '2. Engineering Specifications'}
                {activeTab === 'legacy' && '3. How It Paved The Way'}
                {activeTab === 'fate' && '4. Final Resting Fate'}
                {activeTab === 'minilab' && '5. Interactive Mini-Lab'}
              </span>

              {activeTab !== 'minilab' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (activeTab === 'story') handlePlaySection('story', artifact.narrationScript || artifact.story);
                      else if (activeTab === 'engineering') handlePlaySection('engineering', artifact.hardware);
                      else if (activeTab === 'legacy') handlePlaySection('legacy', artifact.science);
                      else if (activeTab === 'fate') handlePlaySection('fate', artifact.farewell || artifact.story);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                      activePlayingSection === activeTab
                        ? 'bg-cyan-500 text-slate-950 animate-pulse shadow-[0_0_12px_rgba(0,229,255,0.7)]'
                        : 'bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{activePlayingSection === activeTab ? 'Speaking...' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={handleStopVoice}
                    className={`px-2.5 py-1.5 rounded-xl font-heading text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      isSpeaking
                        ? 'bg-rose-950 text-rose-200 border-rose-500 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Stop active speech immediately"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Story Narrative Content with ALL Original Details */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 font-body text-[15px] sm:text-[16px] leading-[1.6] text-slate-100">
              {activeTab === 'story' && (
                <div className="space-y-3">
                  <p>{artifact.story}</p>
                  {artifact.narrationScript && (
                    <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-sm italic text-slate-200">
                      "{artifact.narrationScript}"
                    </div>
                  )}
                  {artifact.missionTimeline && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1">
                      <div className="text-cyan-400 font-bold uppercase mb-1 flex items-center justify-between">
                        <span>Mission Timeline Log</span>
                        <span className="text-[10px] text-slate-400">NASA JPL Telemetry</span>
                      </div>
                      {Object.entries(artifact.missionTimeline).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-slate-800/80 pb-1 last:border-0">
                          <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-white font-semibold text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'engineering' && (
                <div className="space-y-3">
                  <p>{artifact.hardware}</p>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1">
                    <div className="text-amber-400 font-bold uppercase mb-1">Physical Metrics & Specifications</div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Launch Year:</span>
                      <span className="text-white font-bold">{artifact.launchYear}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Operating Body:</span>
                      <span className="text-cyan-300 font-bold">{artifact.body}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Surface Coordinates:</span>
                      <span className="text-white">{artifact.coordinates || artifact.officialNssdcaCoords}</span>
                    </div>
                    {artifact.primaryObjective && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] font-body text-slate-300">
                        <strong className="text-amber-300 block mb-0.5">Primary Objective:</strong>
                        {artifact.primaryObjective}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'legacy' && (
                <div className="space-y-3">
                  <p>{artifact.science}</p>
                  {artifact.legacyChain && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs sm:text-sm text-indigo-200">
                      <strong className="text-cyan-300 block mb-1">Lineage & Direct Successors:</strong>
                      {artifact.legacyChain}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'fate' && (
                <div className="space-y-3">
                  <p>{artifact.farewell || artifact.story}</p>
                  {artifact.sourceUrl && (
                    <a
                      href={artifact.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline pt-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify on {artifact.sourceLabel || 'NASA NSSDCA Archive'}
                    </a>
                  )}
                </div>
              )}

              {activeTab === 'minilab' && (
                <div className="space-y-2">
                  <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-2 shadow-xl">
                    {renderMiniLab()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Neat 2x2 Grid of Hardware Subsystem Buttons (Click to Fly Camera) */}
          {artifact.subsystems && artifact.subsystems.length > 0 && (
            <div className="shrink-0 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-heading font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Hardware Subsystems (Click to Fly Camera):</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">Auto-Zooms 3D View</span>
              </div>

              {/* Neat 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {artifact.subsystems.map((sub, idx) => {
                  const isSelected = selectedSubsystemIndex === idx;
                  const color = SUBSYSTEM_COLORS[idx % SUBSYSTEM_COLORS.length];

                  return (
                    <button
                      key={sub.id || idx}
                      onClick={() => {
                        soundEffects.playLockChime();
                        setSelectedSubsystemIndex(idx);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? `${color.bg} ${color.border} ${color.glow} scale-[1.02]`
                          : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-white truncate">
                          <div className={`w-2.5 h-2.5 rounded-full ${color.dot} ${isSelected ? 'animate-ping' : ''} shrink-0`} />
                          <span className="truncate">{sub.name}</span>
                        </div>
                        {isSelected && (
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border} shrink-0`}>
                            FOCUSED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 font-body line-clamp-2 leading-tight">
                        {sub.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
