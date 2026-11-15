import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { PLANETS, ARTIFACTS } from '../data/artifacts';
import { soundEffects } from '../services/soundEffects';
import { Radio, Eye, Pause, Play } from 'lucide-react';

export default function PlanetViewer({
  activePlanetId,
  selectedArtifact,
  onSelectArtifact,
  isWarping,
  artifactFilter = 'abandoned'
}) {
  const globeRef = useRef(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [cameraAltitude, setCameraAltitude] = useState(2.2);

  const activePlanet = PLANETS[activePlanetId.toUpperCase()] || PLANETS.MARS;

  // Filter surface artifacts for active planet + artifact filter
  const surfaceArtifacts = useMemo(() => {
    return ARTIFACTS.filter((a) => {
      const matchesPlanet = a.planetId === activePlanetId && a.group !== 'orbiter';
      const matchesFilter = artifactFilter === 'all' ? true : a.statusType === 'abandoned';
      return matchesPlanet && matchesFilter;
    });
  }, [activePlanetId, artifactFilter]);

  // Filter orbiters for active planet + artifact filter
  const orbiterArtifacts = useMemo(() => {
    return ARTIFACTS.filter((a) => {
      const matchesPlanet = a.planetId === activePlanetId && a.group === 'orbiter';
      const matchesFilter = artifactFilter === 'all' ? true : a.statusType === 'abandoned';
      return matchesPlanet && matchesFilter;
    });
  }, [activePlanetId, artifactFilter]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Poll camera altitude for beacon scaling
  useEffect(() => {
    const interval = setInterval(() => {
      if (globeRef.current) {
        const pov = globeRef.current.pointOfView();
        if (pov && pov.altitude !== undefined) {
          setCameraAltitude(pov.altitude);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Set initial camera & axial tilt per planet without altering materials
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;
    const tiltDeg = activePlanetId === 'mars' ? 25.19 : 1.54;
    const tiltRad = (tiltDeg * Math.PI) / 180;

    const scene = globe.scene();
    if (scene) {
      scene.rotation.z = tiltRad;
    }

    // Default initial orbital point of view
    globe.pointOfView(
      { lat: 15, lng: 50, altitude: 2.2 },
      1400
    );
  }, [activePlanetId]);

  // Animate camera fly-to when an artifact is selected
  useEffect(() => {
    if (!globeRef.current || !selectedArtifact) return;

    if (selectedArtifact.planetId === activePlanetId) {
      soundEffects.playFlyWhoosh();

      if (selectedArtifact.group === 'orbiter') {
        globeRef.current.pointOfView(
          { lat: selectedArtifact.lat || 10, lng: selectedArtifact.lng || 20, altitude: 1.45 },
          1600
        );
      } else {
        globeRef.current.pointOfView(
          { lat: selectedArtifact.lat, lng: selectedArtifact.lng, altitude: 0.55 },
          1800
        );
      }

      const chimeTimer = setTimeout(() => {
        soundEffects.playLockChime();
      }, 1400);

      return () => clearTimeout(chimeTimer);
    }
  }, [selectedArtifact, activePlanetId]);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
    soundEffects.playChirp(isPausedRef.current ? 700 : 1000);
  }, []);

  // Setup animated 3D Orbit Trajectories & Spacecraft Meshes in scene
  useEffect(() => {
    if (!globeRef.current) return;
    const scene = globeRef.current.scene();
    if (!scene) return;

    const cleanupObjects = [];

    if (activePlanetId === 'mars') {
      const orbitersConfig = [
        { id: 'mro',   name: 'MRO',   radiusX: 130, radiusY: 124, inclination: 1.62, rotY: 0.35, color: 0x00e5ff, speed: 0.007, bodyColor: 0xe2e8f0, solarColor: 0x0284c7 },
        { id: 'maven', name: 'MAVEN', radiusX: 146, radiusY: 116, inclination: 1.31, rotY: 1.15, color: 0xa855f7, speed: 0.0055, bodyColor: 0xf1f5f9, solarColor: 0x9333ea },
        { id: 'mgs',   name: 'MGS',   radiusX: 122, radiusY: 120, inclination: 1.62, rotY: 2.10, color: 0xf59e0b, speed: 0.0085, bodyColor: 0xfef08a, solarColor: 0xd97706 }
      ];

      orbitersConfig.forEach((cfg) => {
        const orbitCurve = new THREE.EllipseCurve(0, 0, cfg.radiusX, cfg.radiusY, 0, 2 * Math.PI, false, 0);
        const orbitPoints = orbitCurve.getPoints(140);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: cfg.color, transparent: true, opacity: 0.55,
          blending: THREE.AdditiveBlending, linewidth: 2
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLine.rotation.x = cfg.inclination;
        orbitLine.rotation.y = cfg.rotY;
        scene.add(orbitLine);
        cleanupObjects.push(orbitLine, orbitGeo, orbitMat);

        const satGroup = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.bodyColor, roughness: 0.3, metalness: 0.8 });
        const solarMat = new THREE.MeshStandardMaterial({ color: cfg.solarColor, roughness: 0.1, metalness: 0.7 });

        const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 1.2), bodyMat);
        const solar1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.4), solarMat);
        solar1.position.x = 3.2;
        const solar2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.4), solarMat);
        solar2.position.x = -3.2;
        const dish = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat);
        dish.position.y = 1.0;
        dish.rotation.x = Math.PI;

        satGroup.add(bodyMesh, solar1, solar2, dish);
        scene.add(satGroup);
        cleanupObjects.push(satGroup, bodyMesh.geometry, solar1.geometry, solar2.geometry, dish.geometry, bodyMat, solarMat);

        let angle = Math.random() * Math.PI * 2;
        satGroup.userData.animate = () => {
          if (isPausedRef.current) return;
          angle += cfg.speed;
          const x = Math.cos(angle) * cfg.radiusX;
          const z = Math.sin(angle) * cfg.radiusY;
          const v = new THREE.Vector3(x, 0, z);
          v.applyEuler(orbitLine.rotation);
          satGroup.position.copy(v);
          satGroup.rotation.y += 0.01;
        };
      });
    } else {
      // Moon LRO
      const orbitRadius = 122;
      const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.94, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x00e5ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = 1.56;
      orbitLine.rotation.y = 0.35;
      scene.add(orbitLine);
      cleanupObjects.push(orbitLine, orbitGeo, orbitMat);

      const satGroup = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.8 });
      const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.1, metalness: 0.7 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 1.2), bodyMat);
      const solar1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.1, 1.5), solarMat);
      solar1.position.x = 3.5;
      const solar2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.1, 1.5), solarMat);
      solar2.position.x = -3.5;
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), bodyMat);
      dish.position.y = 1.0;
      dish.rotation.x = Math.PI;

      satGroup.add(body, solar1, solar2, dish);
      scene.add(satGroup);
      cleanupObjects.push(satGroup, body.geometry, solar1.geometry, solar2.geometry, dish.geometry, bodyMat, solarMat);

      let angle = 0;
      satGroup.userData.animate = () => {
        if (isPausedRef.current) return;
        angle += 0.006;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * (orbitRadius * 0.94);
        const v = new THREE.Vector3(x, 0, z);
        v.applyEuler(orbitLine.rotation);
        satGroup.position.copy(v);
        satGroup.rotation.y += 0.01;
      };
    }

    // Animate satellites and celestial axial rotation (delta * 0.035)
    let reqId;
    const clock = new THREE.Clock();

    const animateSatellites = () => {
      reqId = requestAnimationFrame(animateSatellites);
      const delta = clock.getDelta();

      // Realistic slow celestial axial rotation pace
      if (!isPausedRef.current && scene) {
        scene.rotation.y += delta * 0.035;
      }

      scene.traverse((obj) => {
        if (obj.userData && typeof obj.userData.animate === 'function') {
          obj.userData.animate();
        }
      });
    };
    animateSatellites();

    return () => {
      cancelAnimationFrame(reqId);
      cleanupObjects.forEach((obj) => {
        if (obj.parent) obj.parent.remove(obj);
        if (typeof obj.dispose === 'function') obj.dispose();
      });
    };
  }, [activePlanetId]);

  // Floating Aerospace Callout Beacon Pins for Surface Missions
  const htmlElementsData = useMemo(() => {
    return surfaceArtifacts.map(a => ({ ...a, lat: a.lat, lng: a.lng, size: 32 }));
  }, [surfaceArtifacts, cameraAltitude]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#040711] transition-opacity duration-700 ${
        isWarping ? 'opacity-20 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <Globe
        ref={globeRef}
        key={activePlanet?.id || activePlanetId}
        width={windowDimensions.width}
        height={windowDimensions.height}
        backgroundColor="#040711"
        backgroundImageUrl="/textures/2k_stars_milky_way.jpg"
        globeImageUrl={activePlanetId === 'moon' ? '/textures/2k_moon.jpg' : '/textures/2k_mars.jpg'}
        bumpImageUrl={activePlanet.bumpTexture || undefined}
        showAtmosphere={activePlanetId === 'mars'}
        atmosphereColor={activePlanetId === 'mars' ? '#f97316' : 'rgba(0,0,0,0)'}
        atmosphereAltitude={activePlanetId === 'mars' ? 0.15 : 0}
        htmlElementsData={htmlElementsData}
        htmlElement={(d) => {
          const isSelected = selectedArtifact?.id === d.id;
          const el = document.createElement('div');
          el.className = 'cursor-pointer select-none transition-transform duration-200 group';

          const isZoomedOut = cameraAltitude > 1.8;
          const scale = isZoomedOut ? '0.72' : '1';
          el.style.transformOrigin = 'bottom center';
          el.style.transform = `translate(-50%, -100%) scale(${scale})`;

          const badgeHtml = d.statusType === 'abandoned'
            ? `<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:rgba(120,53,15,0.9);border:1px solid rgba(251,191,36,0.6);color:#fbbf24;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">🏛️ ARTIFACT</span>`
            : `<span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:rgba(6,78,59,0.9);border:1px solid rgba(52,211,153,0.6);color:#34d399;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">🛸 ACTIVE</span>`;

          el.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;">
              <div style="padding:6px 10px;border-radius:8px;backdrop-filter:blur(12px);transition:all 0.3s;box-shadow:0 4px 20px rgba(0,0,0,0.5);white-space:nowrap;${
                isSelected
                  ? 'background:rgba(8,47,73,0.95);border:1px solid #22d3ee;color:white;box-shadow:0 0 20px rgba(0,229,255,0.8);transform:scale(1.1);'
                  : 'background:rgba(2,6,23,0.85);border:1px solid rgba(100,116,139,0.5);color:#cbd5e1;'
              }${isZoomedOut ? 'opacity:0.8;' : ''}">
                <div style="display:flex;align-items:center;gap:5px;font-family:\'Space Grotesk\',sans-serif;font-size:11px;font-weight:700;">
                  <span style="width:7px;height:7px;border-radius:50%;background:${
                    isSelected ? '#22d3ee' : d.statusType === 'abandoned' ? '#fbbf24' : '#34d399'
                  };${isSelected ? 'animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;' : ''}"></span>
                  <span>${d.shortName}</span>
                </div>
                ${!isZoomedOut ? `<div style="margin-top:2px;display:flex;align-items:center;justify-content:space-between;gap:8px;">${badgeHtml}</div>` : ''}
              </div>
              <div style="width:2px;height:22px;background:linear-gradient(to bottom, ${isSelected ? '#22d3ee' : '#475569'}, transparent);"></div>
              <div style="width:10px;height:10px;border-radius:50%;border:2px solid ${isSelected ? '#67e8f9' : '#22d3ee'};background:${isSelected ? '#22d3ee' : 'rgba(8,145,178,0.4)'};margin-top:-4px;${isSelected ? 'animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;' : ''}"></div>
            </div>
          `;

          el.onclick = () => {
            soundEffects.playChirp(1100);
            onSelectArtifact(d);
          };

          return el;
        }}
        htmlAltitude={0.015}
      />

      {/* Orbital HUD Panel */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:flex flex-col gap-2 pointer-events-auto">
        <div className="bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl flex flex-col gap-2 max-w-sm text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              {activePlanetId === 'mars' ? 'MARS ORBITAL TRAJECTORIES' : 'LUNAR ORBITAL TRAJECTORY'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                LIVE 3D
              </span>
              <button
                onClick={handleTogglePause}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                  isPaused
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title={isPaused ? 'Resume Orbit' : 'Pause Orbit'}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
            </div>
          </div>

          {activePlanetId === 'mars' ? (
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              {ARTIFACTS.filter(a => a.planetId === 'mars' && a.group === 'orbiter').map((orbiter) => {
                const isSelected = selectedArtifact?.id === orbiter.id;
                const hidden = artifactFilter === 'abandoned' && orbiter.statusType !== 'abandoned';
                if (hidden) return null;
                return (
                  <button
                    key={orbiter.id}
                    onClick={() => { soundEffects.playChirp(1000); onSelectArtifact(orbiter); }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-md'
                        : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: orbiter.orbitColor || '#00e5ff' }}
                      />
                      <span className="font-display font-bold truncate text-[11px]">{orbiter.shortName}</span>
                      {orbiter.statusType === 'abandoned' && (
                        <span style={{fontSize:'8px',color:'#fbbf24'}}>🏛️</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Eye className="w-3 h-3 text-cyan-400" /> Inspect
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <div>
                <span className="text-white font-display font-bold block">{activePlanet.relaySatellite?.name}</span>
                <span className="text-[10px] text-slate-400">
                  Orbit: ~{activePlanet.relaySatellite?.altitude} km
                </span>
              </div>
            </div>
          )}

          {/* Earth Distance Telemetry readout */}
          <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300 font-semibold flex items-center justify-between">
            <span>📍 {activePlanet.distanceDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
