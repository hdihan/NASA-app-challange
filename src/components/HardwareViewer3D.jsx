import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

const SUBSYSTEM_COLORS = [
  { border: 'border-cyan-400/80', bg: 'bg-cyan-950/60', text: 'text-cyan-300', dot: 'bg-cyan-400', glow: 'shadow-[0_0_15px_rgba(0,229,255,0.6)]', hex: 0x00e5ff },
  { border: 'border-amber-400/80', bg: 'bg-amber-950/60', text: 'text-amber-300', dot: 'bg-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]', hex: 0xfbbf24 },
  { border: 'border-emerald-400/80', bg: 'bg-emerald-950/60', text: 'text-emerald-300', dot: 'bg-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.6)]', hex: 0x34d399 },
  { border: 'border-purple-400/80', bg: 'bg-purple-950/60', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]', hex: 0xa855f7 },
  { border: 'border-rose-400/80', bg: 'bg-rose-950/60', text: 'text-rose-300', dot: 'bg-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.6)]', hex: 0xf43f5e }
];

export default function HardwareViewer3D({
  artifact,
  selectedSubsystemIndex = null,
  onSelectSubsystem,
  onBackToPlanet
}) {
  const containerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [focusedSubName, setFocusedSubName] = useState(null);

  // References
  const modelGroupRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const markerMeshRef = useRef(null);
  const bboxSizeRef = useRef(new THREE.Vector3(3.2, 2.0, 3.2));
  const groundRef = useRef(null);
  const gridRef = useRef(null);
  const prevSubIndexRef = useRef(null);

  // Target animation state for camera fly-to
  const isTransitioningRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(3.2, 1.9, 3.8));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Toggle user-requested Pause / Resume Rotation directly
  const handleToggleRotation = () => {
    setIsRotating((prev) => {
      const next = !prev;
      soundEffects.playChirp(next ? 1000 : 800);
      return next;
    });
  };

  // Click-to-Focus Subsystem: Exact Part Mapping from Normalized Bounding Box
  const focusSubsystem = useCallback((index) => {
    if (!artifact?.subsystems || index === null || index === undefined || !artifact.subsystems[index]) return;
    const sub = artifact.subsystems[index];

    soundEffects.playLockChime();
    setFocusedSubName(sub.name);

    // Automatically pause rotation during focused inspection
    setIsRotating(false);

    // Map using normalized local ratio from model's actual size
    const size = bboxSizeRef.current || new THREE.Vector3(3.2, 2.0, 3.2);
    const [rx, ry, rz] = sub.ratio || [0, 0, 0];

    const localTarget = new THREE.Vector3(rx * size.x, ry * size.y, rz * size.z);
    const worldTarget = localTarget.clone();

    // Rotate local target to match current model rotation
    if (modelGroupRef.current) {
      worldTarget.applyEuler(modelGroupRef.current.rotation);
    }

    // Update 3D Glowing Subsystem Pulse Marker
    if (markerMeshRef.current) {
      markerMeshRef.current.position.copy(worldTarget);
      markerMeshRef.current.visible = true;
      const col = SUBSYSTEM_COLORS[index % SUBSYSTEM_COLORS.length];
      markerMeshRef.current.material.color.setHex(col.hex);
    }

    // Camera flies to exactly 1.4 units away
    const camDir = new THREE.Vector3(
      worldTarget.x >= 0 ? 0.65 : -0.65,
      0.45,
      worldTarget.z >= 0 ? 0.75 : -0.75
    ).normalize();
    const camPos = worldTarget.clone().add(camDir.multiplyScalar(1.4));

    targetLookAtRef.current.copy(worldTarget);
    targetCamPosRef.current.copy(camPos);
    isTransitioningRef.current = true;
  }, [artifact]);

  // Synchronize ONLY when external selectedSubsystemIndex changes to a DIFFERENT index
  // Prevents camera angle changing when switching story tabs!
  useEffect(() => {
    if (selectedSubsystemIndex === null || selectedSubsystemIndex === undefined || selectedSubsystemIndex < 0) {
      prevSubIndexRef.current = null;
      return;
    }
    if (prevSubIndexRef.current === selectedSubsystemIndex) {
      return;
    }
    prevSubIndexRef.current = selectedSubsystemIndex;
    focusSubsystem(selectedSubsystemIndex);
  }, [selectedSubsystemIndex, focusSubsystem]);

  // Reset Full Model View to Heroic 3/4 Perspective
  const resetCameraView = () => {
    soundEffects.playFlyWhoosh();
    setFocusedSubName(null);
    prevSubIndexRef.current = null;
    targetLookAtRef.current.set(0, 0, 0);
    targetCamPosRef.current.set(3.2, 1.9, 3.8);
    isTransitioningRef.current = true;
    if (markerMeshRef.current) {
      markerMeshRef.current.visible = false;
    }
    if (onSelectSubsystem) {
      onSelectSubsystem(null, null);
    }
  };

  // Primary Three.js Setup & GLB Loading
  useEffect(() => {
    if (!containerRef.current || !artifact) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    setIsLoading(true);
    setLoadingProgress(15);
    setFocusedSubName(null);
    prevSubIndexRef.current = null;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isMars = artifact.body === 'Mars';
    scene.background = new THREE.Color(isMars ? 0x080404 : 0x030611);

    // Initial inspection camera: Heroic 3/4 front-angle position [3.2, 1.9, 3.8], target [0, 0, 0]
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 1.9, 3.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 0.7;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Automatically pause auto-rotation when user drags with mouse/touch
    controls.addEventListener('start', () => {
      setIsRotating(false);
    });

    // 3-Point Studio + Directional Key/Rim Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    // Directional Key Light (Hero light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Directional Rim Light (Atmospheric planet-colored edge glow)
    const rimLight = new THREE.DirectionalLight(isMars ? 0xf97316 : 0x00e5ff, 1.8);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Front-Left Fill Light
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.4);
    fillLight.position.set(-4, 6, 4);
    scene.add(fillLight);

    // Top Overhead Light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 9, 0);
    scene.add(topLight);

    // Ground Environment Disc & Grid Floor
    const isOrbital = artifact.group === 'orbiter' || artifact.id === 'apollo-17';
    const groundGeo = new THREE.CylinderGeometry(6.5, 6.5, 0.15, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isMars ? 0x5a1e12 : 0x334155,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    ground.visible = !isOrbital;
    scene.add(ground);
    groundRef.current = ground;

    const gridColor = isMars ? 0xf97316 : 0x00e5ff;
    const gridHelper = new THREE.GridHelper(12, 20, gridColor, 0x1e293b);
    gridHelper.position.y = -1.12;
    gridHelper.visible = !isOrbital;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // Subsystem 3D Glowing Pulsing Highlight Marker
    const markerGeo = new THREE.RingGeometry(0.08, 0.14, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.rotation.x = Math.PI / 2;
    markerMesh.visible = false;
    scene.add(markerMesh);
    markerMeshRef.current = markerMesh;

    // Dedicated Group for Turntable Rotation
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

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

          // Apollo 17 Challenger: Isolate the Ascent Stage (matching 2nd attached image)
          if (artifact.id === 'apollo-17') {
            const toRemove = [];
            model.traverse((child) => {
              if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const b = child.geometry.boundingBox;
                if (b && b.max.y < 2.25) {
                  toRemove.push(child);
                }
              }
            });
            toRemove.forEach((child) => {
              if (child.parent) child.parent.remove(child);
            });
          }

          // 1. Initial bounding box measurement
          const initialBox = new THREE.Box3().setFromObject(model);
          const initialSize = initialBox.getSize(new THREE.Vector3());
          const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z);

          // 2. Normalize largest dimension to 3.2 world units
          const normScale = maxDim > 0 ? 3.2 / maxDim : 1;
          model.scale.setScalar(normScale);

          // 3. Center cleanly at [0, 0, 0]
          const scaledBox = new THREE.Box3().setFromObject(model);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
          model.position.sub(scaledCenter);

          // Calculate final normalized bounding dimensions
          const finalBox = new THREE.Box3().setFromObject(model);
          const finalSize = finalBox.getSize(new THREE.Vector3());
          bboxSizeRef.current = finalSize;

          // Position ground platform right below the spacecraft's lowest contact point (if grounded)
          if (!isOrbital) {
            if (groundRef.current) {
              groundRef.current.position.y = finalBox.min.y - 0.08;
            }
            if (gridRef.current) {
              gridRef.current.position.y = finalBox.min.y - 0.01;
            }
          }

          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                if (child.material.metalness !== undefined) {
                  child.material.roughness = Math.min(child.material.roughness || 0.5, 0.6);
                }
              }
            }
          });

          modelGroup.add(model);
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
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle Turntable Rotation (0.08 rad/s)
      if (isRotating && modelGroupRef.current && !isTransitioningRef.current) {
        modelGroupRef.current.rotation.y += delta * 0.08;
      }

      // Smooth camera gliding interpolation toward target
      if (isTransitioningRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.08);
        controls.target.lerp(targetLookAtRef.current, 0.08);
        if (
          camera.position.distanceTo(targetCamPosRef.current) < 0.015 &&
          controls.target.distanceTo(targetLookAtRef.current) < 0.015
        ) {
          isTransitioningRef.current = false;
        }
      }

      // Animate pulsing 3D subsystem marker
      if (markerMesh.visible) {
        pulseAngle += 0.06;
        const s = 1.0 + Math.sin(pulseAngle) * 0.25;
        markerMesh.scale.set(s, s, s);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [artifact]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <div className="font-heading font-bold text-sm tracking-wider text-cyan-300">
            MOUNTING 3D SPACECRAFT CAD... {loadingProgress}%
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top-Left Sleek Status Pill: Spinning BYTESTAR Emblem + Active Telemetry */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-xl border border-cyan-500/40 px-3.5 py-2 rounded-2xl shadow-xl">
          {/* Spinning Emblem */}
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400 animate-spin-slow" />
            <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.8)] rotate-45">
              <Sparkles className="w-2.5 h-2.5 text-white -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xs tracking-wider text-white truncate max-w-[180px] sm:max-w-[280px]">
                {artifact.name}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shrink-0">
                {artifact.body}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              NSSDCA: {artifact.nssdcaId} {focusedSubName && `• FOCUSED: ${focusedSubName}`}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom-Center Tidy Viewport Control Bar */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 p-2 rounded-2xl shadow-2xl pointer-events-auto">
          {/* Stop / Resume Rotation Button */}
          <button
            onClick={handleToggleRotation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer shadow-md ${
              isRotating
                ? 'bg-amber-950/90 hover:bg-amber-900 border border-amber-500/70 text-amber-200'
                : 'bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/70 text-emerald-200'
            }`}
            title={isRotating ? 'Pause Turntable Rotation' : 'Resume Turntable Rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRotating ? 'Stop Rotation' : 'Resume Rotation'}</span>
          </button>

          {/* Reset Full Model View Button */}
          <button
            onClick={resetCameraView}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-white font-heading text-xs font-bold transition-all cursor-pointer shadow-md"
            title="Reset Camera to Heroic 3/4 Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View</span>
          </button>

          {/* Back to Planet Orbit View Button */}
          {onBackToPlanet && (
            <button
              onClick={() => {
                soundEffects.playFlyWhoosh();
                onBackToPlanet();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 border border-blue-400/50 text-white font-heading text-xs font-bold transition-all cursor-pointer shadow-md"
              title="Return to Planetary Orbit Globe"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Planet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
