import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  CheckCircle2,
  Circle,
  Satellite,
  Bot,
  Search,
  ArrowRight
} from 'lucide-react';
import { ARTIFACTS } from '../data/artifacts';
import { soundEffects } from '../services/soundEffects';

function StatusBadge({ statusType }) {
  if (statusType === 'abandoned') {
    return (
      <span className="badge-abandoned whitespace-nowrap shrink-0 text-xs px-2.5 py-1">
        🏛️ Abandoned Artifact
      </span>
    );
  }
  return (
    <span className="badge-future-monument whitespace-nowrap shrink-0 text-xs px-2.5 py-1">
      🛸 Future Monument (Active)
    </span>
  );
}

export default function MissionRoster({
  activePlanetId,
  selectedArtifact,
  onSelectArtifact,
  recoveredIds = [],
  artifactFilter = 'abandoned'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [marsFilterGroup, setMarsFilterGroup] = useState('all'); // 'all' | 'surface' | 'orbiter'
  const [searchQuery, setSearchQuery] = useState('');

  // Clear search query on planet switch so searches don't bleed across planets
  useEffect(() => {
    setSearchQuery('');
  }, [activePlanetId]);

  // Planet-specific artifacts
  const planetArtifacts = useMemo(() => {
    return ARTIFACTS.filter((a) => a.planetId === activePlanetId);
  }, [activePlanetId]);

  // Filtered list respecting both the global artifactFilter and local group filter
  // Moon and Mars work completely separately so Mars orbit/surface sections never interfere with Moon
  const filteredArtifacts = useMemo(() => {
    return planetArtifacts.filter((item) => {
      const matchesStatus =
        artifactFilter === 'all' ? true : item.statusType === 'abandoned';
      const matchesGroup =
        activePlanetId === 'mars'
          ? marsFilterGroup === 'all'
            ? true
            : item.group === marsFilterGroup
          : true;
      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesGroup && matchesSearch;
    });
  }, [planetArtifacts, activePlanetId, marsFilterGroup, searchQuery, artifactFilter]);

  return (
    <div
      className={`fixed left-4 top-24 z-20 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? '-translate-x-[calc(100%-14px)]' : 'translate-x-0'
      }`}
    >
      <div className="relative flex">
        {/* Main Sci-Fi Roster Panel */}
        <div className="w-88 sm:w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <Compass
                className={`w-5 h-5 ${
                  activePlanetId === 'mars' ? 'text-orange-400' : 'text-cyan-400'
                }`}
              />
              <span className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                {activePlanetId === 'mars' ? 'Mars Hardware Registry' : 'Lunar Hardware Registry'}
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-bold">
              {filteredArtifacts.length} Units
            </span>
          </div>

          {/* Filter status indicator */}
          {artifactFilter === 'abandoned' && (
            <div className="flex items-center gap-2 text-xs font-body text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-2">
              <span className="text-sm">🏛️</span>
              <span>Showing 5 abandoned relics. Toggle filter above to view all 8 units.</span>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rovers, landers, sites..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Group Filter Tabs (Mars: Surface vs Orbiters) */}
          {activePlanetId === 'mars' && (
            <div className="grid grid-cols-3 gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-display">
              <button
                onClick={() => setMarsFilterGroup('all')}
                className={`py-1.5 rounded-xl text-center transition-colors cursor-pointer ${
                  marsFilterGroup === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMarsFilterGroup('surface')}
                className={`py-1.5 rounded-xl text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  marsFilterGroup === 'surface'
                    ? 'bg-orange-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" /> Surface
              </button>
              <button
                onClick={() => setMarsFilterGroup('orbiter')}
                className={`py-1.5 rounded-xl text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  marsFilterGroup === 'orbiter'
                    ? 'bg-purple-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" /> Orbiters
              </button>
            </div>
          )}

          {/* Mission List */}
          <div className="flex flex-col gap-2.5 mt-1">
            {filteredArtifacts.map((item) => {
              const isSelected = selectedArtifact?.id === item.id;
              const isRecovered = recoveredIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEffects.playChirp(1100);
                    onSelectArtifact(item);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-[1.01]'
                      : item.statusType === 'abandoned'
                      ? 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/40 hover:border-amber-500/50'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-base text-white mb-0.5">
                        {isRecovered ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{item.shortName}</span>
                      </div>
                      {item.tagline && (
                        <div className="text-xs font-body text-slate-300 leading-snug mt-1 line-clamp-2">
                          {item.tagline}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-2">
                    <StatusBadge statusType={item.statusType} />
                  </div>

                  {/* Location & Year */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="truncate">{item.location.split('(')[0].trim()}</span>
                    <span className={item.statusLed + ' font-bold shrink-0 ml-1'}>
                      {item.launchYear || ''}
                    </span>
                  </div>

                  {/* Legacy Chain */}
                  {item.legacyChain && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-xs font-body text-cyan-200/90">
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.legacyChain}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredArtifacts.length === 0 && (
              <div className="text-center py-8 text-sm font-body text-slate-400">
                No matching hardware missions found.
              </div>
            )}
          </div>
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => {
            soundEffects.playChirp(800);
            setIsCollapsed(!isCollapsed);
          }}
          className="self-center -ml-px w-6 h-14 bg-slate-950/90 hover:bg-slate-900 border border-l-0 border-cyan-500/40 rounded-r-xl flex items-center justify-center text-cyan-300 hover:text-white cursor-pointer shadow-xl transition-colors"
          title={isCollapsed ? 'Expand Mission Roster' : 'Collapse Mission Roster'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
