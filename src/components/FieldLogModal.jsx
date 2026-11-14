import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, CheckCircle2, Circle, X, Sparkles, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARTIFACTS } from '../data/artifacts';
import { soundEffects } from '../services/soundEffects';

export default function FieldLogModal({
  isOpen,
  onClose,
  recoveredIds = [],
  onSelectArtifact
}) {
  const [userName, setUserName] = useState('Distinguished Space Explorer');
  const [showCertificate, setShowCertificate] = useState(false);
  const canvasRef = useRef(null);

  const totalCount = ARTIFACTS.length;
  const recoveredCount = recoveredIds.length;
  const isAllRecovered = recoveredCount >= totalCount;

  // Trigger confetti when all 8 are collected or certificate is viewed
  useEffect(() => {
    if (showCertificate || isAllRecovered) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [showCertificate, isAllRecovered]);

  // Render High-Res Certificate to HTML5 Canvas
  const drawCertificate = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Deep Navy Void)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#040711');
    bgGrad.addColorStop(0.5, '#0b1329');
    bgGrad.addColorStop(1, '#070d1e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Gold Aerospace Border
    ctx.strokeStyle = '#e5a823';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // NASA Header
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('2026 NASA SPACE APPS CHALLENGE • OFFICIAL ACCREDITATION', width / 2, 110);

    // Certificate Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('NASA PLANETARY ARCHAEOLOGIST', width / 2, 175);

    ctx.fillStyle = '#e5a823';
    ctx.font = '18px monospace';
    ctx.fillText('PROJECT: ECHOES BEYOND EARTH (ABANDONED BUT NOT FORGOTTEN)', width / 2, 215);

    // Decorative Divider Line
    ctx.strokeStyle = '#e5a823';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 240);
    ctx.lineTo(900, 240);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText('This official certificate is proudly conferred upon', width / 2, 300);

    // Explorer Name
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(userName.toUpperCase(), width / 2, 365);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText('for successfully locating, surveying, and operating telemetry simulations for all 8', width / 2, 420);
    ctx.fillText('historic NASA missions stranded across the surfaces of the Moon and Mars.', width / 2, 450);

    // Verified Mission Tags Grid
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('SURVEYED SITES: Apollo 11 • Apollo 15 • Surveyor 3 • Apollo 17 • Opportunity • Spirit • InSight • Ingenuity', width / 2, 510);

    // Verification Seals & Timestamp
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    ctx.textAlign = 'left';
    ctx.font = '16px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`DATE OF COMPLETION: ${dateStr}`, 100, 680);
    ctx.fillText('AUTHORITY: NASA NSSDCA / NASA SCIENCE', 100, 710);

    // Gold Medal Seal
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.arc(width - 200, 680, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#e5a823';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#040711';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('NASA', width - 200, 675);
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SPACE APPS', width - 200, 692);
  };

  useEffect(() => {
    if (showCertificate) {
      setTimeout(drawCertificate, 100);
    }
  }, [showCertificate, userName]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    soundEffects.playLockChime();
    const link = document.createElement('a');
    link.download = `NASA_Planetary_Archaeologist_${userName.replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-mono text-base font-bold text-white">
                Mission Field Log: Planetary Archaeology Archive
              </h3>
              <p className="text-xs text-slate-400">
                Surveyed Sites: {recoveredCount} / {totalCount} Hardware Relics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">Archaeological Telemetry Progress:</span>
            <span className="text-cyan-400 font-bold">{Math.round((recoveredCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(recoveredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* 8 Artifacts Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARTIFACTS.map((item) => {
            const isDone = recoveredIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectArtifact(item);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-900/40'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div className="truncate">
                    <div className="font-bold text-xs text-white truncate">{item.shortName}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">{item.location} ({item.body})</div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-cyan-400 px-2 py-1 rounded bg-slate-950 border border-slate-800 shrink-0">
                  {isDone ? 'SURVEYED' : 'VISIT'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Certificate Section */}
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-mono text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                NASA Planetary Archaeologist Certificate
              </h4>
              <p className="text-xs text-slate-400">
                Awarded for completing all 8 lunar and Martian archaeology surveys.
              </p>
            </div>

            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold cursor-pointer transition-colors shadow-md"
            >
              {showCertificate ? 'Hide Certificate' : 'Preview & Claim Certificate'}
            </button>
          </div>

          {showCertificate && (
            <div className="space-y-4 animate-fade-in bg-slate-900/80 p-4 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-300">Name for Certificate:</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Rendered Canvas Preview */}
              <div className="w-full overflow-hidden rounded-lg border border-amber-500/40 shadow-2xl">
                <canvas ref={canvasRef} className="w-full h-auto block" />
              </div>

              <button
                onClick={handleDownloadPNG}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Official Certificate (High-Res PNG)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
