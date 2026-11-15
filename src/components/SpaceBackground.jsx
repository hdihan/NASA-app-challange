import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Mineral trail color palettes for natural meteors with physical compositions
const METEOR_MINERAL_COLORS = [
  { name: 'Magnesium', hex: 0x38bdf8, tailHex: 0x0284c7 }, // Cyan-blue (Magnesium rich)
  { name: 'Nickel',    hex: 0x34d399, tailHex: 0x059669 }, // Emerald-green (Nickel-iron)
  { name: 'Sodium',    hex: 0xfbbf24, tailHex: 0xd97706 }, // Golden-amber (Sodium rich)
  { name: 'Calcium',   hex: 0xe0e7ff, tailHex: 0xa855f7 }  // Violet-white (Calcium / ionized nitrogen)
];

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 4000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040711, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35; // Luminous starlight & vivid Milky Way

    // 1. High-Definition Milky Way Skybox Sphere
    const textureLoader = new THREE.TextureLoader();
    const milkyWayTexture = textureLoader.load(
      '/textures/2k_stars_milky_way.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.mapping = THREE.EquirectangularReflectionMapping;
      },
      undefined,
      (err) => {
        console.warn('Milky Way local texture fallback:', err);
      }
    );

    const skyGeo = new THREE.SphereGeometry(2400, 64, 64);
    const skyMat = new THREE.MeshBasicMaterial({
      map: milkyWayTexture,
      side: THREE.BackSide,
      depthWrite: false,
      transparent: true,
      opacity: 1.0
    });
    const skySphere = new THREE.Mesh(skyGeo, skyMat);
    skySphere.rotation.x = 0.2; // Angle galactic core across viewport
    scene.add(skySphere);

    // 2. Dual-Tier Multi-Magnitude Star Field
    const starColorList = [
      new THREE.Color(0xb5d8ff), // O/B Brilliant Blue-White
      new THREE.Color(0xffffff), // A/F Pure Diamond White
      new THREE.Color(0xfff6ea), // G Solar White-Yellow
      new THREE.Color(0xffdeb8), // K Warm Orange
      new THREE.Color(0xffbaa0)  // M Radiant Red-Orange
    ];

    // Tier A: Dense Background Stellar Dust (6,500 stars)
    const starCountA = 6500;
    const starGeoA = new THREE.BufferGeometry();
    const positionsA = new Float32Array(starCountA * 3);
    const colorsA = new Float32Array(starCountA * 3);

    for (let i = 0; i < starCountA; i++) {
      const radius = 600 + Math.random() * 1500;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positionsA[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positionsA[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positionsA[i * 3 + 2] = radius * Math.cos(phi);

      const color = starColorList[Math.floor(Math.random() * starColorList.length)];
      colorsA[i * 3] = color.r;
      colorsA[i * 3 + 1] = color.g;
      colorsA[i * 3 + 2] = color.b;
    }

    starGeoA.setAttribute('position', new THREE.BufferAttribute(positionsA, 3));
    starGeoA.setAttribute('color', new THREE.BufferAttribute(colorsA, 3));

    const starTexture = createStarCanvasTexture();
    const starMatA = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starFieldA = new THREE.Points(starGeoA, starMatA);
    scene.add(starFieldA);

    // Tier B: Prominent Bright Constellation Stars with Optical Diffraction Halos (450 stars)
    const starCountB = 450;
    const starGeoB = new THREE.BufferGeometry();
    const positionsB = new Float32Array(starCountB * 3);
    const colorsB = new Float32Array(starCountB * 3);

    for (let i = 0; i < starCountB; i++) {
      const radius = 550 + Math.random() * 1200;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positionsB[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positionsB[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positionsB[i * 3 + 2] = radius * Math.cos(phi);

      const color = starColorList[Math.floor(Math.random() * 3)]; // Bias toward brilliant blue-white
      colorsB[i * 3] = color.r * 1.3;
      colorsB[i * 3 + 1] = color.g * 1.3;
      colorsB[i * 3 + 2] = color.b * 1.3;
    }

    starGeoB.setAttribute('position', new THREE.BufferAttribute(positionsB, 3));
    starGeoB.setAttribute('color', new THREE.BufferAttribute(colorsB, 3));

    const brightStarTexture = createBrightStarTexture();
    const starMatB = new THREE.PointsMaterial({
      size: 5.5,
      vertexColors: true,
      map: brightStarTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starFieldB = new THREE.Points(starGeoB, starMatB);
    scene.add(starFieldB);

    // 3. Frequent Mineral-Colored Shooting Meteors (Pool of 8)
    const meteorPoolSize = 8;
    const meteors = [];

    for (let i = 0; i < meteorPoolSize; i++) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(12);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      const mat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 3
      });

      const line = new THREE.Line(geo, mat);
      scene.add(line);

      // Incandescent glowing head point
      const headGeo = new THREE.BufferGeometry();
      headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
      const headMat = new THREE.PointsMaterial({
        size: 9,
        map: starTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const headPoint = new THREE.Points(headGeo, headMat);
      scene.add(headPoint);

      meteors.push({
        line,
        headPoint,
        active: false,
        head: new THREE.Vector3(),
        mid1: new THREE.Vector3(),
        mid2: new THREE.Vector3(),
        tail: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 55
      });
    }

    let nextMeteorTime = performance.now() + 800;

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();

      // Slow majestic celestial drift
      starFieldA.rotation.y += 0.00012;
      starFieldB.rotation.y += 0.00012;
      skySphere.rotation.y += 0.00008;

      // Spawn meteors every 1.5–3.5s
      if (now > nextMeteorTime) {
        const freeMeteor = meteors.find((m) => !m.active);
        if (freeMeteor) {
          freeMeteor.active = true;
          freeMeteor.life = 0;
          freeMeteor.maxLife = 40 + Math.random() * 30;

          // Select mineral color
          const mineral = METEOR_MINERAL_COLORS[Math.floor(Math.random() * METEOR_MINERAL_COLORS.length)];
          freeMeteor.line.material.color.setHex(mineral.hex);
          freeMeteor.headPoint.material.color.setHex(mineral.hex);

          // Random starting coordinates across celestial sphere
          const startX = (Math.random() - 0.5) * 1100;
          const startY = 300 + Math.random() * 400;
          const startZ = -400 - Math.random() * 400;

          freeMeteor.head.set(startX, startY, startZ);
          freeMeteor.mid1.copy(freeMeteor.head);
          freeMeteor.mid2.copy(freeMeteor.head);
          freeMeteor.tail.copy(freeMeteor.head);

          // Realistic entry trajectory
          const speed = 18 + Math.random() * 14;
          const angleX = -(0.7 + Math.random() * 0.5);
          const angleY = -(0.5 + Math.random() * 0.4);
          const angleZ = 0.3 + Math.random() * 0.3;

          freeMeteor.velocity.set(angleX * speed, angleY * speed, angleZ * speed);
        }
        nextMeteorTime = now + 1500 + Math.random() * 2000;
      }

      // Update active meteors
      meteors.forEach((m) => {
        if (!m.active) return;
        m.life++;
        m.head.add(m.velocity);
        m.mid1.lerp(m.head, 0.75);
        m.mid2.lerp(m.mid1, 0.70);
        m.tail.lerp(m.mid2, 0.65);

        const posAttr = m.line.geometry.attributes.position;
        posAttr.setXYZ(0, m.head.x, m.head.y, m.head.z);
        posAttr.setXYZ(1, m.mid1.x, m.mid1.y, m.mid1.z);
        posAttr.setXYZ(2, m.mid2.x, m.mid2.y, m.mid2.z);
        posAttr.setXYZ(3, m.tail.x, m.tail.y, m.tail.z);
        posAttr.needsUpdate = true;

        const headPos = m.headPoint.geometry.attributes.position;
        headPos.setXYZ(0, m.head.x, m.head.y, m.head.z);
        headPos.needsUpdate = true;

        const progress = m.life / m.maxLife;
        const opacity = Math.sin(progress * Math.PI) * 0.95;
        m.line.material.opacity = opacity;
        m.headPoint.material.opacity = opacity;

        if (m.life >= m.maxLife) {
          m.active = false;
          m.line.material.opacity = 0;
          m.headPoint.material.opacity = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starGeoA.dispose();
      starMatA.dispose();
      starGeoB.dispose();
      starMatB.dispose();
      skyGeo.dispose();
      skyMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

function createStarCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(240,250,255,0.95)');
  gradient.addColorStop(0.5, 'rgba(140,190,255,0.4)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  return new THREE.CanvasTexture(canvas);
}

function createBrightStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Luminous radial glow
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.35, 'rgba(180,225,255,0.65)');
  gradient.addColorStop(0.65, 'rgba(100,170,255,0.25)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  // 4-Point Optical Diffraction Spikes (Telescopic starlight flare)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(32, 6);
  ctx.lineTo(32, 58);
  ctx.moveTo(6, 32);
  ctx.lineTo(58, 32);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}
