import React, { useState, useEffect } from 'react';
import SpaceBackground from './components/SpaceBackground';
import MeteorOverlay from './components/MeteorOverlay';
import PlanetViewer from './components/PlanetViewer';
import NavigationBar from './components/NavigationBar';
import MissionRoster from './components/MissionRoster';
import EquipmentDrawer from './components/EquipmentDrawer';
import FarewellModal from './components/FarewellModal';
import CitationsModal from './components/CitationsModal';
import AiVoiceBot from './components/AiVoiceBot';
import { ARTIFACTS } from './data/artifacts';
import { soundEffects } from './services/soundEffects';
import { speechService } from './services/speechService';

export default function App() {
  const [activePlanetId, setActivePlanetId] = useState('moon'); // 'moon' | 'mars'
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [farewellArtifact, setFarewellArtifact] = useState(null);
  const [isCitationsOpen, setIsCitationsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  // Filter: 'abandoned' shows only abandoned artifacts (default), 'all' shows all 8
  const [artifactFilter, setArtifactFilter] = useState('abandoned');

  // Recovered artifacts persistent tracking
  const [recoveredIds, setRecoveredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('echoes_recovered_artifacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markArtifactRecovered = (id) => {
    if (!recoveredIds.includes(id)) {
      const updated = [...recoveredIds, id];
      setRecoveredIds(updated);
      try {
        localStorage.setItem('echoes_recovered_artifacts', JSON.stringify(updated));
      } catch {}
    }
  };

  // Change planet with warp animation
  const handlePlanetChange = (planetId) => {
    if (planetId === activePlanetId) return;
    speechService.stop();
    setIsWarping(true);
    setSelectedArtifact(null);
    setIsDrawerOpen(false);

    setTimeout(() => {
      setActivePlanetId(planetId);
      setIsWarping(false);
    }, 600);
  };

  // Select artifact for inspection
  const handleSelectArtifact = (artifact) => {
    speechService.stop();
    if (artifact.planetId !== activePlanetId) {
      setActivePlanetId(artifact.planetId);
    }
    setSelectedArtifact(artifact);
    setIsDrawerOpen(true);
    markArtifactRecovered(artifact.id);
  };

  // Trigger emotional farewell sequence
  const handleTriggerFarewell = (artifact) => {
    markArtifactRecovered(artifact.id);
    setIsDrawerOpen(false);
    speechService.stop();
    setFarewellArtifact(artifact);
  };

  // Toggle audio
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    speechService.setMuted(nextMuted);
  };

  // Close drawer and stop voice
  const handleCloseDrawer = () => {
    speechService.stop();
    setIsDrawerOpen(false);
    setSelectedArtifact(null);
  };

  const abandonedCount = ARTIFACTS.filter((a) => a.statusType === 'abandoned').length;
  const totalCount = ARTIFACTS.length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-900 select-none text-white">
      {/* 1. Deep Space Starfield & Realistic Shooting Meteor Canvas */}
      <SpaceBackground />

      {/* 2. Meteor Shower Overlay — rendered above the globe canvas, below UI */}
      <MeteorOverlay />

      {/* 3. Interactive 3D Planet Globe (react-globe.gl) */}
      <PlanetViewer
        activePlanetId={activePlanetId}
        selectedArtifact={selectedArtifact}
        onSelectArtifact={handleSelectArtifact}
        isWarping={isWarping}
        artifactFilter={artifactFilter}
      />

      {/* 3. Top Navigation Bar with BYTESTAR Branding */}
      <NavigationBar
        activePlanetId={activePlanetId}
        onChangePlanet={handlePlanetChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        recoveredCount={recoveredIds.length}
        totalCount={totalCount}
        onOpenCitations={() => setIsCitationsOpen(true)}
        artifactFilter={artifactFilter}
        onToggleFilter={(f) => setArtifactFilter(f)}
        abandonedCount={abandonedCount}
      />

      {/* 4. Left Mission Roster Sidebar */}
      <MissionRoster
        activePlanetId={activePlanetId}
        selectedArtifact={selectedArtifact}
        onSelectArtifact={handleSelectArtifact}
        recoveredIds={recoveredIds}
        artifactFilter={artifactFilter}
      />

      {/* 5. Right Slide-Over Equipment Inspection Drawer */}
      {isDrawerOpen && selectedArtifact && (
        <EquipmentDrawer
          artifact={selectedArtifact}
          onClose={handleCloseDrawer}
          onTriggerFarewell={handleTriggerFarewell}
          isRecovered={recoveredIds.includes(selectedArtifact.id)}
          isMuted={isMuted}
        />
      )}

      {/* 6. Cinematic Emotional Farewell Modal */}
      {farewellArtifact && (
        <FarewellModal
          artifact={farewellArtifact}
          isOpen={Boolean(farewellArtifact)}
          onClose={() => {
            setFarewellArtifact(null);
            setSelectedArtifact(null);
          }}
        />
      )}

      {/* 7. Official NASA NSSDCA Citations Modal */}
      <CitationsModal
        isOpen={isCitationsOpen}
        onClose={() => setIsCitationsOpen(false)}
      />

      {/* 8. Floating AI Voice Bot Companion (Docked cleanly at bottom-5 left-5) */}
      <AiVoiceBot
        activePlanetId={activePlanetId}
        activeArtifact={isDrawerOpen ? selectedArtifact : null}
        isDrawerOpen={isDrawerOpen}
        isMuted={isMuted}
      />
    </div>
  );
}
