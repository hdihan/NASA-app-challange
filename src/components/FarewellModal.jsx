import React, { useEffect, useState } from 'react';
import { Radio, Volume2, X, Heart, Award } from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export default function FarewellModal({
  artifact,
  isOpen,
  onClose
}) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isOpen || !artifact) {
      setDisplayedText('');
      return;
    }

    // Play radio burst effect
    soundEffects.playRadioStatic(0.6);

    // Speak the emotional farewell aloud with custom spacecraft voice parameters
    speechService.speak(artifact.farewell, artifact.voiceProfile);

    // Typewriter effect for subtitles
    let charIndex = 0;
    const fullText = artifact.farewell;
    setDisplayedText('');

    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 28);

    return () => {
      clearInterval(interval);
      speechService.stop();
    };
  }, [isOpen, artifact]);

  if (!isOpen || !artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-950/95 border-2 border-rose-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex flex-col gap-4 text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-rose-400 font-bold">
              Final Telemetry Sign-Off Protocol
            </span>
          </div>

          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Spacecraft Identification */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-bold text-lg shadow-lg">
            🚀
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{artifact.name}</h3>
            <div className="text-xs font-mono text-rose-300/80">
              Resting at {artifact.location} ({artifact.coordinates.split(',')[0]})
            </div>
          </div>
        </div>

        {/* Cinematic Subtitles Quote Box */}
        <div className="bg-black/70 border border-rose-500/30 rounded-xl p-5 min-h-[140px] flex items-center justify-center text-center shadow-inner">
          <p className="font-mono text-sm sm:text-base text-rose-100/95 leading-relaxed tracking-wide italic">
            "{displayedText}"
            <span className="inline-block w-2 h-4 bg-rose-400 ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* Mission Archaeology Status */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Award className="w-4 h-4" /> Telemetry Logged to Planetary Archive
          </span>
          <span className="text-slate-500">COSPAR: {artifact.nssdcaId}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            speechService.stop();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-mono text-xs uppercase tracking-wider font-bold text-white shadow-lg cursor-pointer transition-all"
        >
          Sign Off Transmission & Return to Orbit
        </button>
      </div>
    </div>
  );
}
