import React, { useEffect, useRef } from 'react';

// Real-life meteor shower color palette based on mineral/atmospheric composition.
// Head RGB channels + glow RGB — mirrors actual observed streaks:
//   Magnesium → blue-white  |  Sodium → golden-yellow  |  Iron/Nickel → emerald green
//   Calcium   → violet-white|  Nitrogen plasma → pure white  |  Silicate → orange-amber
const METEOR_COLORS = [
  { hr: 200, hg: 230, hb: 255, gr: 100, gg: 180, gb: 255 }, // Magnesium – icy blue-white
  { hr: 255, hg: 240, hb: 100, gr: 255, gg: 200, gb:  40 }, // Sodium    – golden-yellow
  { hr: 100, hg: 255, hb: 160, gr:  20, gg: 220, gb:  80 }, // Iron/Nickel – emerald green
  { hr: 220, hg: 190, hb: 255, gr: 160, gg:  80, gb: 255 }, // Calcium   – violet-white
  { hr: 255, hg: 255, hb: 255, gr: 180, gg: 220, gb: 255 }, // Pure white – nitrogen plasma
  { hr: 255, hg: 200, hb: 100, gr: 255, gg: 120, gb:  30 }, // Silicate  – orange-amber
];

function rand(a, b) {
  return a + Math.random() * (b - a);
}

function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function spawnMeteor(W, H) {
  const angle = rand(0.38, 0.72);         // shallow downward entry angle (22°–41°)
  const speed = rand(14, 36);              // pixels/frame – fast like real meteors
  return {
    x: rand(-W * 0.1, W * 1.1),           // spawn anywhere across the top
    y: rand(-H * 0.08, H * 0.35),         // upper portion of screen
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: rand(100, 280),               // tail length in px
    color: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
    life: 0,
    maxLife: Math.floor(rand(28, 62)),
    flareFrames: Math.floor(rand(3, 9)),   // initial brightness flare duration
  };
}

export default function MeteorOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const meteors = [];
    let frame = 0;
    // Stagger first spawn: 20–80 frames in (≈0.3–1.3s)
    let nextSpawnFrame = Math.floor(rand(20, 80));
    const MAX_SIMULTANEOUS = 3; // at most 3 meteors at once — moderate shower feel

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      // Spawn: every 1.5–4 seconds (90–240 frames @ 60fps), up to MAX_SIMULTANEOUS
      if (frame >= nextSpawnFrame && meteors.length < MAX_SIMULTANEOUS) {
        meteors.push(spawnMeteor(W, H));
        nextSpawnFrame = frame + Math.floor(rand(90, 240));
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        const progress = m.life / m.maxLife;
        const { hr, hg, hb, gr, gg, gb } = m.color;

        // Opacity curve: sharp flare-in → sustained burn → gentle fade
        let opacity;
        if (m.life <= m.flareFrames) {
          opacity = m.life / m.flareFrames;
        } else if (progress < 0.65) {
          opacity = 1.0;
        } else {
          opacity = 1.0 - (progress - 0.65) / 0.35;
        }
        opacity = Math.max(0, Math.min(1, opacity));

        // ── Tail gradient line ──
        const spd = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / spd) * m.length;
        const tailY = m.y - (m.vy / spd) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0,   rgba(hr, hg, hb, 0));                 // fully transparent tail
        grad.addColorStop(0.5, rgba(hr, hg, hb, opacity * 0.5));     // mid half-bright
        grad.addColorStop(1,   rgba(hr, hg, hb, opacity));           // bright head end

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Outer soft glow band
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = grad;
        ctx.shadowColor = rgba(gr, gg, gb, opacity);
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Inner bright core
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();

        // ── Incandescent head point ──
        // Extra large during flare, normal after
        const flareBoost = m.life <= m.flareFrames ? (1 - m.life / m.flareFrames) * 6 : 0;
        const headR = 5 + flareBoost;
        const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, headR * 2.8);
        headGrad.addColorStop(0,   rgba(255, 255, 255, opacity));
        headGrad.addColorStop(0.3, rgba(hr, hg, hb, opacity * 0.9));
        headGrad.addColorStop(0.7, rgba(gr, gg, gb, opacity * 0.4));
        headGrad.addColorStop(1,   rgba(gr, gg, gb, 0));

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, headR * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (m.life >= m.maxLife) meteors.splice(i, 1);
      }

      rafId = requestAnimationFrame(animate);
    };

    let rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
}
