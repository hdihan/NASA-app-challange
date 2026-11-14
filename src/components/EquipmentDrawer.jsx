import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  BookOpen,
  Lightbulb,
  Wrench,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Volume2,
  Square,
  Milestone,
  ArrowRight,
  Radio,
  Clock,
  PlayCircle,
  Crosshair
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
  { border: 'border-cyan-400/80', bg: 'bg-cyan-950/60', text: 'text-cyan-300', dot: 'bg-cyan-400', glow: 'shadow-[0_0_12px_rgba(0,229,255,0.4)]' },
  { border: 'border-amber-400/80', bg: 'bg-amber-950/60', text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_12px_rgba(251,191,36,0.4)]' },
  { border: 'border-emerald-400/80', bg: 'bg-emerald-950/60', text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]' },
  { border: 'border-purple-400/80', bg: 'bg-purple-950/60', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]' },
  { border: 'border-rose-400/80', bg: 'bg-rose-950/60', text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]' }
];

export default function EquipmentDrawer({
  artifact,
  onClose,
  onTriggerFarewell,
  isRecovered,
  isMuted
}) {
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'engineering' | 'legacy' | 'fate' | 'minilab'
  const [selectedSubsystem, setSelectedSubsystem] = useState(artifact?.subsystems?.[0] || null);
  const [selectedSubsystemIndex, setSelectedSubsystemIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePlayingSection, setActivePlayingSection] = useState(null); // 'full' | 'story' | 'engineering' | 'legacy' | 'fate'

  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      if (!state.isSpeaking) {
        setActivePlayingSection(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setSelectedSubsystem(artifact?.subsystems?.[0] || null);
    setSelectedSubsystemIndex(0);
  }, [artifact]);

  if (!artifact) return null;

  // Speak specific section with Zero Overlap
  const handlePlaySection = (sectionKey, text) => {
    soundEffects.playChirp(1200);
    setActivePlayingSection(sectionKey);
    speechService.speak(text, artifact.voiceProfile, () => {
      setActivePlayingSection(null);
    });
  };

  // Play full comprehensive narrative across all 4 chapters
  const handlePlayFullStory = () => {
    soundEffects.playChirp(1300);
    setActivePlayingSection('full');
    const fullText = `Welcome to the official story of ${artifact.name}. ${artifact.tagline || ''}. Chapter one, the mission story: ${artifact.story}. Chapter two, engineering and hardware: ${artifact.hardware}. Chapter three, how it paved the way: ${artifact.science}. Chapter four, its final resting fate: ${artifact.farewell || artifact.story}.`;
    speechService.speak(fullText, artifact.voiceProfile, () => {
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

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl flex flex-col text-white h-screen overflow-hidden animate-fade-in select-none">
      {/* Top Header Bar */}
      <div className="h-16 px-6 border-b border-cyan-500/30 bg-slate-950/95 flex items-center justify-between shrink-0 gap-4">
        {/* Left: Titles & Status Badges */}
        <div className="flex items-center gap-3 truncate">
          {artifact.statusType === 'abandoned' ? (
            <span className="badge-abandoned text-xs px-2.5 py-1 shrink-0 font-bold">
              🏛️ ABANDONED ARTIFACT
            </span>
          ) : (
            <span className="badge-future-monument text-xs px-2.5 py-1 shrink-0 font-bold">
              🛸 FUTURE MONUMENT
            </span>
          )}

          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight truncate">
            {artifact.name}
          </h2>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-bold hidden md:inline shrink-0">
            NSSDCA: {artifact.nssdcaId}
          </span>

          <span className="text-xs font-mono text-slate-400 hidden lg:inline truncate">
            📍 {artifact.location}
          </span>
        </div>

        {/* Center: Audio Narration Master Controller (Zero Overlap Guaranteed) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePlayFullStory}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-display text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-lg ${
              activePlayingSection === 'full'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.7)] animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>{activePlayingSection === 'full' ? 'Playing Story...' : 'Play Full Story'}</span>
          </button>

          <button
            onClick={handleStopVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-display font-bold transition-all cursor-pointer shadow-md ${
              isSpeaking
                ? 'bg-rose-950 text-rose-200 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce'
                : 'bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border-slate-700'
            }`}
            title="Stop voice immediately"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Voice</span>
          </button>

          {artifact.voiceProfile?.narrator && (
            <span className="hidden xl:inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300">
              🎙️ {artifact.voiceProfile.narrator}
            </span>
          )}
        </div>

        {/* Right: Farewell Ritual + Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          {artifact.statusType === 'abandoned' && (
            <button
              onClick={() => {
                soundEffects.playLockChime();
                speechService.stop();
                onTriggerFarewell(artifact);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-display font-bold text-white flex items-center gap-1.5 cursor-pointer shadow transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="hidden sm:inline">Farewell Ritual</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playChirp(700);
              speechService.stop();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Exit Inspection HUD"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Single-Screen Split-Pane HUD: 3D Stage on Left, Subsystems & Story on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-64px)] overflow-hidden">
        {/* Left / Center: Full-Stage 3D CAD & Surface Drive Viewport */}
        <div className="lg:col-span-7 xl:col-span-8 h-full relative p-3 flex flex-col bg-slate-950/80 overflow-hidden">
          <HardwareViewer3D
            artifact={artifact}
            selectedSubsystemId={selectedSubsystem?.id}
            selectedSubsystemIndex={selectedSubsystemIndex}
            onSelectSubsystem={(sub, idx) => {
              setSelectedSubsystem(sub);
              setSelectedSubsystemIndex(idx);
            }}
            isFullStage={true}
          />
        </div>

        {/* Right Panel: Story Tabs (Top) + Interactive Hardware Subsystem Cards (Bottom) */}
        <div className="lg:col-span-5 xl:col-span-4 h-full flex flex-col border-l border-cyan-500/30 bg-slate-950/95 backdrop-blur-xl overflow-hidden">
          {/* Top Story Tabs Section */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Story Tabs Bar */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('story'); }}
                className={`flex items-center gap-1.5 px-3 py-2 font-display text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'story'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Story</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('engineering'); }}
                className={`flex items-center gap-1.5 px-3 py-2 font-display text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'engineering'
                    ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Engineering</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('legacy'); }}
                className={`flex items-center gap-1.5 px-3 py-2 font-display text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'legacy'
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Milestone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legacy</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('fate'); }}
                className={`flex items-center gap-1.5 px-3 py-2 font-display text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'fate'
                    ? 'border-rose-400 text-rose-300 bg-rose-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Fate</span>
              </button>

              <button
                onClick={() => { soundEffects.playChirp(950); setActiveTab('minilab'); }}
                className={`flex items-center gap-1.5 px-3 py-2 font-display text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'minilab'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mini-Lab</span>
              </button>
            </div>

            {/* Chapter Header + Voice Audio Play Button */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-cyan-300">
                {activeTab === 'story' && '1. The Mission Story'}
                {activeTab === 'engineering' && '2. Engineering Specifications'}
                {activeTab === 'legacy' && '3. How It Paved The Way'}
                {activeTab === 'fate' && '4. Final Resting Fate'}
                {activeTab === 'minilab' && '5. Interactive Mini-Lab'}
              </span>

              {activeTab !== 'minilab' && (
                <button
                  onClick={() => {
                    if (activeTab === 'story') handlePlaySection('story', artifact.narrationScript || artifact.story);
                    else if (activeTab === 'engineering') handlePlaySection('engineering', artifact.hardware);
                    else if (activeTab === 'legacy') handlePlaySection('legacy', artifact.science);
                    else if (activeTab === 'fate') handlePlaySection('fate', artifact.farewell || artifact.story);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-display text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow ${
                    activePlayingSection === activeTab
                      ? 'bg-cyan-500 text-slate-950 animate-pulse'
                      : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{activePlayingSection === activeTab ? 'Speaking...' : 'Listen'}</span>
                </button>
              )}
            </div>

            {/* Scrollable Story Narrative Content (Crisp, High-Contrast 16px font) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-body text-base sm:text-lg leading-relaxed text-slate-100">
              {activeTab === 'story' && (
                <div className="space-y-3">
                  <p>{artifact.story}</p>
                  {artifact.narrationScript && (
                    <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-sm sm:text-base italic text-slate-200">
                      "{artifact.narrationScript}"
                    </div>
                  )}
                  {artifact.missionTimeline && (
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono space-y-1">
                      <div className="text-slate-400 font-bold uppercase mb-1">Timeline Log</div>
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
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono space-y-1">
                    <div className="text-amber-400 font-bold uppercase mb-1">Physical Metrics</div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Launch Year:</span>
                      <span className="text-white">{artifact.launchYear}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Operating Body:</span>
                      <span className="text-cyan-300">{artifact.body}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Coordinates:</span>
                      <span className="text-white">{artifact.coordinates}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'legacy' && (
                <div className="space-y-3">
                  <p>{artifact.science}</p>
                  {artifact.legacyChain && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-sm sm:text-base text-indigo-200">
                      <strong className="text-cyan-300 block mb-0.5">Lineage & Direct Successors:</strong>
                      {artifact.legacyChain}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'fate' && (
                <div className="space-y-3">
                  <p>{artifact.farewell || artifact.story}</p>
                  <a
                    href={artifact.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline pt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verify on {artifact.sourceLabel}
                  </a>
                </div>
              )}

              {activeTab === 'minilab' && (
                <div className="space-y-3">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs">
                    <h4 className="font-display font-bold text-white flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      {artifact.miniLab?.title}
                    </h4>
                    <p className="text-cyan-300 mt-0.5">{artifact.miniLab?.subtitle}</p>
                  </div>
                  <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 shadow-xl">
                    {renderMiniLab()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Interactive Hardware Subsystems Grid (Click to Fly Camera directly) */}
          {artifact.subsystems && artifact.subsystems.length > 0 && (
            <div className="shrink-0 border-t border-cyan-500/30 bg-slate-900/80 p-3 flex flex-col gap-2 max-h-[44%] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-display font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Hardware Subsystems (Click to Fly Camera):</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">Auto-Zooms 3D View</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {artifact.subsystems.map((sub, idx) => {
                  const isSelected = selectedSubsystemIndex === idx;
                  const color = SUBSYSTEM_COLORS[idx % SUBSYSTEM_COLORS.length];

                  return (
                    <button
                      key={sub.id || idx}
                      onClick={() => {
                        soundEffects.playLockChime();
                        setSelectedSubsystem(sub);
                        setSelectedSubsystemIndex(idx);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? `${color.bg} ${color.border} ${color.glow} scale-[1.02]`
                          : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-display font-bold text-xs text-white truncate">
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
