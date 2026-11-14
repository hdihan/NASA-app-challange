import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Rotate3D,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Info,
  Compass,
  Radio,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Pause,
  Play,
  Crosshair
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

// Vibrant color accents for subsystem cards
const SUBSYSTEM_COLORS = [
  { border: 'border-cyan-400/80', bg: 'bg-cyan-950/40', text: 'text-cyan-300', dot: 'bg-cyan-400', glow: 'shadow-[0_0_15px_rgba(0,229,255,0.4)]', hex: 0x00e5ff },
  { border: 'border-amber-400/80', bg: 'bg-amber-950/40', text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]', hex: 0xfbbf24 },
  { border: 'border-emerald-400/80', bg: 'bg-emerald-950/40', text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]', hex: 0x34d399 },
  { border: 'border-purple-400/80', bg: 'bg-purple-950/40', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]', hex: 0xa855f7 },
  { border: 'border-rose-400/80', bg: 'bg-rose-950/40', text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]', hex: 0xf43f5e }
];

// 3D Hardware Subsystem Focus Coordinates per Spacecraft (Tight Close-Up Offsets)
const SUBSYSTEM_TARGETS = {
  'apollo-11': [
    { id: 'sub-0', name: 'Descent Stage & Gold Thermal Foil', target: [0, 0.35, 0], cam: [0.7, 0.55, 0.8] },
    { id: 'sub-1', name: 'Quad Truss Landing Struts & Footpads', target: [0.7, -0.05, 0.7], cam: [1.15, 0.15, 1.15] },
    { id: 'sub-2', name: 'Ascent Cabin & Crew Windows', target: [0, 1.1, 0.2], cam: [0.4, 1.35, 0.65] },
    { id: 'sub-3', name: 'EASEP Laser Retroreflector (LRRR)', target: [-0.55, 0.2, 0.55], cam: [-0.9, 0.45, 0.9] },
    { id: 'sub-4', name: 'Throttleable Descent Engine (DPS)', target: [0, 0.08, 0], cam: [0.45, 0.2, 0.65] }
  ],
  'apollo-17': [
    { id: 'sub-0', name: 'SNAP-27 RTG Plutonium Core', target: [-0.55, 0.3, -0.35], cam: [-0.9, 0.55, -0.65] },
    { id: 'sub-1', name: 'J-Series Extended Descent Stage', target: [0, 0.35, 0], cam: [0.7, 0.6, 0.8] },
    { id: 'sub-2', name: 'Lunar Seismic Profiling Array', target: [0.55, 0.2, 0.45], cam: [0.9, 0.4, 0.8] },
    { id: 'sub-3', name: 'Lunar Surface Drill & Heat Probes', target: [-0.35, 0.2, 0.65], cam: [-0.65, 0.4, 1.0] },
    { id: 'sub-4', name: 'ALSEP Telemetry Antenna Mast', target: [0.45, 1.25, -0.15], cam: [0.75, 1.5, -0.35] }
  ],
  'viking-1': [
    { id: 'sub-0', name: 'Dual SNAP-19 RTG Power Units', target: [0.55, 0.65, -0.25], cam: [0.9, 0.9, 0.1] },
    { id: 'sub-1', name: '3-Meter Motorized Sampler Scoop Arm', target: [-0.65, 0.3, 0.65], cam: [-1.0, 0.5, 1.0] },
    { id: 'sub-2', name: 'Integrated Biology Lab (IBI) & GCMS', target: [0, 0.45, 0], cam: [0.4, 0.7, 0.55] },
    { id: 'sub-3', name: 'Dual Steerable Facsimile Cameras', target: [0.2, 0.85, 0.2], cam: [0.45, 1.05, 0.45] },
    { id: 'sub-4', name: 'Meteorology Boom & Wind Sensor', target: [-0.35, 0.95, -0.35], cam: [-0.6, 1.2, -0.55] }
  ],
  'opportunity': [
    { id: 'sub-0', name: 'Rocker-Bogie 6-Wheel Articulated Suspension', target: [0.55, 0.12, 0.1], cam: [0.95, 0.3, 0.45] },
    { id: 'sub-1', name: 'Triple-Junction Solar Array Wings', target: [0, 0.55, 0], cam: [0.1, 1.0, 0.65] },
    { id: 'sub-2', name: 'Pancam Stereo Binocular Mast', target: [0.2, 0.95, 0.3], cam: [0.45, 1.15, 0.65] },
    { id: 'sub-3', name: 'Robotic Arm & RAT Diamond Grinder', target: [0.5, 0.3, 0.55], cam: [0.85, 0.48, 0.88] },
    { id: 'sub-4', name: 'High-Gain Gimbaled Dish Antenna', target: [-0.35, 0.75, -0.35], cam: [-0.65, 1.0, -0.6] }
  ],
  'ingenuity': [
    { id: 'sub-0', name: 'Counter-Rotating Carbon-Fiber Blades', target: [0, 0.85, 0], cam: [0.45, 1.05, 0.45] },
    { id: 'sub-1', name: 'Solar Array Panel & Battery Hub', target: [0, 1.25, 0], cam: [0.3, 1.45, 0.3] },
    { id: 'sub-2', name: 'Qualcomm Snapdragon 801 Avionics Cube', target: [0, 0.35, 0], cam: [0.4, 0.5, 0.45] },
    { id: 'sub-3', name: '4 Resilient Carbon-Fiber Landing Legs', target: [0.35, -0.05, 0.35], cam: [0.7, 0.18, 0.7] },
    { id: 'sub-4', name: 'Downward Navigation Odometry Camera', target: [0, 0.12, 0.08], cam: [0.25, -0.02, 0.35] }
  ],
  'mgs': [
    { id: 'sub-0', name: 'MOLA 3D Laser Altimeter Transmitter', target: [0, 0.2, 0.45], cam: [0.35, 0.42, 0.8] },
    { id: 'sub-1', name: '1.5-Meter Parabolic High-Gain Dish', target: [0, 0.85, -0.35], cam: [0.4, 1.15, -0.65] },
    { id: 'sub-2', name: 'Dual GaAs Solar Panels & Drag Flaps', target: [0.9, 0.45, 0], cam: [1.35, 0.75, 0.45] },
    { id: 'sub-3', name: 'Mars Orbiter Camera (MOC) Telescope', target: [-0.25, 0.2, 0.35], cam: [-0.55, 0.45, 0.65] },
    { id: 'sub-4', name: 'Dual Magnetometer Boom Assembly', target: [-0.9, 0.25, -0.4], cam: [-1.3, 0.48, -0.65] }
  ],
  'perseverance': [
    { id: 'sub-0', name: 'Mastcam-Z & SuperCam Laser Head', target: [0.2, 1.15, 0.4], cam: [0.4, 1.35, 0.8] },
    { id: 'sub-1', name: 'MMRTG Nuclear Plutonium-238 Core', target: [-0.1, 0.65, -0.7], cam: [-0.2, 0.85, -1.15] },
    { id: 'sub-2', name: '6-Wheel Rocker-Bogie Suspension', target: [0.6, 0.15, 0.1], cam: [1.05, 0.32, 0.45] },
    { id: 'sub-3', name: '2.1m Robotic Arm & Coring Drill', target: [0.45, 0.45, 0.65], cam: [0.75, 0.68, 1.05] },
    { id: 'sub-4', name: 'MOXIE Oxygen Production Unit', target: [-0.25, 0.55, 0.05], cam: [-0.55, 0.78, 0.4] }
  ],
  'mro': [
    { id: 'sub-0', name: 'HiRISE 0.5m Aperture Telescopic Camera', target: [0, 0.35, 0.45], cam: [0.35, 0.55, 0.8] },
    { id: 'sub-1', name: '3-Meter High-Gain Cassegrain Dish', target: [0, 0.95, 0], cam: [0.45, 1.3, 0.45] },
    { id: 'sub-2', name: '20 m² Dual Solar Array Wings', target: [1.1, 0.45, 0], cam: [1.55, 0.75, 0.45] },
    { id: 'sub-3', name: 'CRISM Mineralogical Spectrometer', target: [-0.25, 0.2, 0.25], cam: [-0.55, 0.42, 0.55] },
    { id: 'sub-4', name: 'SHARAD Ice-Penetrating Radar Antenna', target: [0, -0.15, -0.35], cam: [0.4, 0.1, -0.7] }
  ],
  'maven': [
    { id: 'sub-0', name: 'Gull-Wing Solar Arrays & MAG Booms', target: [1.0, 0.55, 0], cam: [1.45, 0.85, 0.45] },
    { id: 'sub-1', name: 'NGIMS Neutral Gas & Ion Spectrometer', target: [0, 0.35, 0.45], cam: [0.35, 0.55, 0.8] },
    { id: 'sub-2', name: '2.0m High-Gain Communications Dish', target: [0, 0.85, -0.15], cam: [0.4, 1.15, -0.45] },
    { id: 'sub-3', name: 'Imaging Ultraviolet Spectrograph (IUVS)', target: [-0.25, 0.25, 0.35], cam: [-0.55, 0.48, 0.65] },
    { id: 'sub-4', name: 'SWIA Solar Wind Ion Analyzer', target: [0.25, 0.45, 0.25], cam: [0.55, 0.68, 0.55] }
  ]
};

export default function HardwareViewer3D({
  artifact,
  onSelectSubsystem,
  selectedSubsystemId,
  selectedSubsystemIndex,
  isFullStage = false
}) {
  const containerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState('sun'); // 'sun' | 'studio' | 'night'
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [focusedSubName, setFocusedSubName] = useState(null);

  // References
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const markerMeshRef = useRef(null);
  const modelPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const modelRotationRef = useRef(0);
  const lightsRef = useRef({});

  // Target animation state
  const isTransitioningRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(3.5, 2.4, 4.2));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0.4, 0));

  // Toggle user-requested Pause Rotation directly
  const handleToggleRotation = () => {
    const next = !isRotating;
    setIsRotating(next);
    soundEffects.playChirp(next ? 1000 : 800);
  };

  // Movement handler (WASD / Arrows)
  const moveModel = useCallback((direction) => {
    if (!modelRef.current) return;
    const step = 0.35;
    const rotStep = 0.15;

    // Moving automatically pauses auto-rotation
    setIsRotating(false);

    if (direction === 'forward') {
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), modelRotationRef.current);
      modelPositionRef.current.addScaledVector(forward, step);
    } else if (direction === 'backward') {
      const backward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), modelRotationRef.current);
      modelPositionRef.current.addScaledVector(backward, step);
    } else if (direction === 'left') {
      modelRotationRef.current += rotStep;
    } else if (direction === 'right') {
      modelRotationRef.current -= rotStep;
    } else if (direction === 'up' && artifact?.id === 'ingenuity') {
      modelPositionRef.current.y = Math.min(modelPositionRef.current.y + 0.3, 3.5);
    } else if (direction === 'down' && artifact?.id === 'ingenuity') {
      modelPositionRef.current.y = Math.max(modelPositionRef.current.y - 0.3, 0);
    } else if (direction === 'reset') {
      modelPositionRef.current.set(0, 0, 0);
      modelRotationRef.current = 0;
    }

    modelRef.current.position.x = modelPositionRef.current.x;
    modelRef.current.position.z = modelPositionRef.current.z;
    if (artifact?.id === 'ingenuity') {
      modelRef.current.position.y = modelPositionRef.current.y;
    }
    modelRef.current.rotation.y = modelRotationRef.current;
  }, [artifact]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'w' || e.key === 'ArrowUp') moveModel('forward');
      else if (e.key === 's' || e.key === 'ArrowDown') moveModel('backward');
      else if (e.key === 'a' || e.key === 'ArrowLeft') moveModel('left');
      else if (e.key === 'd' || e.key === 'ArrowRight') moveModel('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveModel]);

  // Click-to-Focus Subsystem Implementation: Automatic Camera Fly-To & Zoom
  const focusSubsystem = useCallback((sub, index) => {
    soundEffects.playLockChime();
    setActiveSubIndex(index);
    if (onSelectSubsystem) onSelectSubsystem(sub, index);

    // Pause model rotation during focused subsystem inspection
    setIsRotating(false);

    // Find coordinate target with tight close-up camera angles
    const targets = SUBSYSTEM_TARGETS[artifact.id] || [];
    const cfg = targets[index] || { target: [0, 0.4, 0], cam: [0.75, 0.65, 0.85] };
    setFocusedSubName(cfg.name || sub?.name || `Subsystem #${index + 1}`);

    targetLookAtRef.current.set(...cfg.target);
    targetCamPosRef.current.set(...cfg.cam);
    isTransitioningRef.current = true;

    // Update 3D Glowing Subsystem Pulse Marker
    if (markerMeshRef.current) {
      markerMeshRef.current.position.set(...cfg.target);
      markerMeshRef.current.visible = true;
      const col = SUBSYSTEM_COLORS[index % SUBSYSTEM_COLORS.length];
      markerMeshRef.current.material.color.setHex(col.hex);
    }
  }, [artifact, onSelectSubsystem]);

  // Synchronize when external selectedSubsystemIndex changes from right panel
  useEffect(() => {
    if (selectedSubsystemIndex !== undefined && selectedSubsystemIndex !== null && selectedSubsystemIndex >= 0) {
      const targets = SUBSYSTEM_TARGETS[artifact.id] || [];
      const cfg = targets[selectedSubsystemIndex];
      const sub = artifact.subsystems?.[selectedSubsystemIndex] || cfg;
      if (cfg) {
        focusSubsystem(sub, selectedSubsystemIndex);
      }
    }
  }, [selectedSubsystemIndex, artifact.id, focusSubsystem]);

  const resetCameraView = () => {
    soundEffects.playFlyWhoosh();
    setFocusedSubName(null);
    targetLookAtRef.current.set(0, 0.4, 0);
    targetCamPosRef.current.set(3.5, 2.4, 4.2);
    isTransitioningRef.current = true;
    if (markerMeshRef.current) markerMeshRef.current.visible = false;
  };

  // Wireframe toggle
  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => { m.wireframe = isWireframe; });
        } else {
          child.material.wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  // Lighting adjustments
  useEffect(() => {
    const { sunLight, ambientLight, rimLight } = lightsRef.current;
    if (!sunLight || !ambientLight) return;

    if (lightingMode === 'sun') {
      sunLight.intensity = 2.6;
      sunLight.color.setHex(artifact?.body === 'Mars' ? 0xfff4e6 : 0xffffff);
      ambientLight.intensity = 0.9;
      if (rimLight) rimLight.intensity = 1.1;
    } else if (lightingMode === 'studio') {
      sunLight.intensity = 1.8;
      sunLight.color.setHex(0x00e5ff);
      ambientLight.intensity = 1.3;
      if (rimLight) rimLight.intensity = 1.9;
    } else {
      sunLight.intensity = 0.7;
      sunLight.color.setHex(0x94a3b8);
      ambientLight.intensity = 0.4;
      if (rimLight) rimLight.intensity = 0.6;
    }
  }, [lightingMode, artifact]);

  // Primary Three.js setup
  useEffect(() => {
    if (!containerRef.current || !artifact) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 380;

    setIsLoading(true);
    setLoadingProgress(10);
    modelPositionRef.current.set(0, 0, 0);
    modelRotationRef.current = 0;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isMars = artifact.body === 'Mars';
    scene.background = new THREE.Color(isMars ? 0x0c0607 : 0x040711);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 2.4, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 16;
    controls.minDistance = 0.8;
    controls.target.set(0, 0.4, 0);
    controlsRef.current = controls;

    // Auto-pause auto-rotate when user drags with mouse/touch
    controls.addEventListener('start', () => {
      setIsRotating(false);
    });

    // Ground Environment Disc
    const groundGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.25, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isMars ? 0x8a2c16 : 0x475569,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.12;
    ground.receiveShadow = true;
    scene.add(ground);

    // Planetary Grid Floor
    const gridColor = isMars ? 0xf97316 : 0x00e5ff;
    const gridHelper = new THREE.GridHelper(16, 24, gridColor, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Subsystem 3D Glowing Pulsing Highlight Marker
    const markerGeo = new THREE.RingGeometry(0.12, 0.18, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.rotation.x = Math.PI / 2;
    markerMesh.visible = false;
    scene.add(markerMesh);
    markerMeshRef.current = markerMesh;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isMars ? 0xffecd1 : 0xffffff, 2.6);
    sunLight.position.set(5, 9, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(isMars ? 0xf97316 : 0x00e5ff, 1.2);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    lightsRef.current = { sunLight, ambientLight, rimLight };

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // DRACO Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    if (artifact.modelGlb) {
      gltfLoader.load(
        artifact.modelGlb,
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.x -= center.x;
          model.position.y -= center.y;
          model.position.z -= center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const desiredSize = 2.4;
            const normScale = desiredSize / maxDim;
            model.scale.set(normScale, normScale, normScale);
          }

          const normBox = new THREE.Box3().setFromObject(model);
          model.position.y -= normBox.min.y;

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) child.material.side = THREE.DoubleSide;
            }
          });

          rootGroup.add(model);
          setIsLoading(false);
          setLoadingProgress(100);
        },
        (xhr) => {
          if (xhr.total > 0) {
            setLoadingProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
          }
        },
        (err) => {
          console.warn('GLB load error:', err);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
      setLoadingProgress(100);
    }

    let reqId;
    let pulseAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Smooth camera interpolation toward subsystem target
      if (isTransitioningRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.08);
        controls.target.lerp(targetLookAtRef.current, 0.08);
        if (
          camera.position.distanceTo(targetCamPosRef.current) < 0.02 &&
          controls.target.distanceTo(targetLookAtRef.current) < 0.02
        ) {
          isTransitioningRef.current = false;
        }
      }

      // Animate pulsing subsystem marker
      if (markerMesh.visible) {
        pulseAngle += 0.05;
        const s = 1.0 + Math.sin(pulseAngle) * 0.2;
        markerMesh.scale.set(s, s, s);
      }

      controls.autoRotate = isRotating;
      controls.autoRotateSpeed = 1.5;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      modelRef.current = null;
    };
  }, [artifact]);

  return (
    <div className={isFullStage ? "w-full h-full relative flex flex-col overflow-hidden" : "flex flex-col gap-5"}>
      {/* 3D CAD Viewport */}
      <div className={`relative w-full ${isFullStage ? 'flex-1 h-full min-h-[440px]' : 'h-88 sm:h-96'} bg-slate-950/95 rounded-2xl border border-cyan-500/40 overflow-hidden shadow-2xl group`}>
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading Indicator HUD */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-cyan-300">
                {loadingProgress}%
              </div>
            </div>
            <span className="text-cyan-400 tracking-wider flex items-center gap-2 font-display text-sm font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              STREAMING 3D NASA CAD MODEL
            </span>
          </div>
        )}

        {/* Top Viewport Header Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-display font-bold text-cyan-300 bg-black/80 px-3 py-1.5 rounded-xl border border-cyan-500/40 flex items-center gap-1.5 shadow-md">
              <Rotate3D className="w-4 h-4 text-cyan-400" />
              3D CAD HARDWARE INSPECTION
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/40 hidden sm:inline-block">
              {artifact.body?.toUpperCase()} REGOLITH SURFACE
            </span>

            {/* Active Subsystem Focus Banner with Reset Button */}
            {focusedSubName && (
              <div className="flex items-center gap-2 bg-cyan-950/95 border border-cyan-400 px-3 py-1 rounded-xl text-cyan-200 text-xs font-mono font-bold animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.6)] pointer-events-auto">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[200px] sm:max-w-[280px]">FOCUSING: {focusedSubName}</span>
                <button
                  onClick={resetCameraView}
                  className="ml-1 text-[11px] underline text-amber-300 hover:text-white cursor-pointer"
                  title="Return to Full Equipment View"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          <button
            onClick={resetCameraView}
            className="pointer-events-auto px-3 py-1.5 rounded-xl bg-black/80 hover:bg-cyan-950 border border-cyan-500/40 text-xs font-display font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all shadow-md shrink-0"
            title="Reset Camera View to Wide Angle"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Camera</span>
          </button>
        </div>

        {/* On-Screen D-Pad / Interactive Vehicle Controls */}
        <div className="absolute bottom-16 left-3.5 z-20 pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-2 shadow-2xl flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold px-1">
              {artifact.id === 'ingenuity' ? 'Fly / Hover' : 'Drive Controls'}
            </span>
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                onClick={() => moveModel('forward')}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 flex items-center justify-center text-white cursor-pointer transition-all shadow"
                title="Move Forward (W / Up Arrow)"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <div />
              <button
                onClick={() => moveModel('left')}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 flex items-center justify-center text-white cursor-pointer transition-all shadow"
                title="Turn Left (A / Left Arrow)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveModel('reset')}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all"
                title="Reset Position"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveModel('right')}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 flex items-center justify-center text-white cursor-pointer transition-all shadow"
                title="Turn Right (D / Right Arrow)"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div />
              <button
                onClick={() => moveModel('backward')}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-cyan-600 active:bg-cyan-500 flex items-center justify-center text-white cursor-pointer transition-all shadow"
                title="Move Backward (S / Down Arrow)"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <div />
            </div>
          </div>
        </div>

        {/* Bottom Toolbar: Rotation Pause, Lighting, Wireframe */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 z-20 pointer-events-auto">
          {/* Prominent Pause Rotation Button */}
          <button
            onClick={handleToggleRotation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold border transition-all cursor-pointer shadow-lg ${
              isRotating
                ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
                : 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
            }`}
            title="Pause continuous rotation to inspect any angle without fighting spin"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause Rotation' : 'Resume Rotation'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg">
            <button
              onClick={() => {
                soundEffects.playChirp(900);
                setIsWireframe(!isWireframe);
              }}
              className={`p-2 rounded-lg text-xs font-display flex items-center gap-1 transition-colors cursor-pointer ${
                isWireframe ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Toggle Wireframe CAD Mode"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playChirp(1000);
                const modes = ['sun', 'studio', 'night'];
                const next = modes[(modes.indexOf(lightingMode) + 1) % modes.length];
                setLightingMode(next);
              }}
              className="p-2 rounded-lg text-xs font-display text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Cycle Lighting (Sun / Studio / Deep Space)"
            >
              {lightingMode === 'sun' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : lightingMode === 'studio' ? (
                <Sparkles className="w-4 h-4 text-cyan-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400" />
              )}
              <span className="capitalize hidden sm:inline">{lightingMode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rich, Colorful Hardware Subsystem Telemetry with Click-to-Focus (Only if not full stage) */}
      {!isFullStage && artifact.subsystems && artifact.subsystems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>Interactive Hardware Subsystems (Click to Focus Camera):</span>
            </h3>
            <span className="text-xs text-slate-400 font-body hidden sm:inline">
              Glides camera directly to component
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {artifact.subsystems.map((sub, idx) => {
              const isSelected = selectedSubsystemId === sub.id || activeSubIndex === idx;
              const color = SUBSYSTEM_COLORS[idx % SUBSYSTEM_COLORS.length];

              return (
                <button
                  key={sub.id || idx}
                  onClick={() => focusSubsystem(sub, idx)}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? `${color.bg} ${color.border} ${color.glow} scale-[1.02]`
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 font-display font-bold text-sm sm:text-base text-white truncate">
                      <div className={`w-3 h-3 rounded-full ${color.dot} ${isSelected ? 'animate-ping' : ''} shrink-0`} />
                      <span className="truncate">{sub.name}</span>
                    </div>
                    {isSelected && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border} shrink-0`}>
                        FOCUSED
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                    {sub.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
