import React, { useState } from 'react';
import { Key, X, Check, Mic, Sparkles, Volume2, ShieldCheck, RefreshCw } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export default function KeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState(geminiService.getApiKey());
  const [elevenLabsKey, setElevenLabsKey] = useState(speechService.getElevenLabsApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    geminiService.setApiKey(apiKey);
    speechService.setElevenLabsApiKey(elevenLabsKey);
    soundEffects.playLockChime();
    setSaved(true);
    if (onKeySaved) onKeySaved(Boolean(apiKey.trim() || elevenLabsKey.trim()));
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  const handleReset = () => {
    setApiKey('');
    setElevenLabsKey('');
    geminiService.setApiKey('');
    speechService.setElevenLabsApiKey('');
    if (onKeySaved) onKeySaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950/95 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Team BYTESTAR • AI & Voice Settings
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Configure ElevenLabs Natural Voice & Google Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ElevenLabs Voice Section */}
        <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-display font-bold text-emerald-300 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>ElevenLabs Voice API Key</span>
            </label>
            {speechService.hasElevenLabsKey() ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> CONNECTED
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                BROWSER VOICE ACTIVE
              </span>
            )}
          </div>
          <input
            type="password"
            value={elevenLabsKey}
            onChange={(e) => setElevenLabsKey(e.target.value)}
            placeholder="sk_... (auto-loaded from .env)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
          />
          <p className="text-xs text-slate-400 font-body leading-relaxed">
            Powers the 8 distinct human narrator voices for Apollo Lunar Module, Viking 1, Opportunity, Ingenuity, MGS, Perseverance, MRO, and MAVEN.
          </p>
        </div>

        {/* Gemini AI Section */}
        <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-display font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Google Gemini AI API Key</span>
            </label>
            {geminiService.hasCustomKey() ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> CONNECTED
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                OFFLINE ENGINE ACTIVE
              </span>
            )}
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (auto-loaded from .env)"
            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none transition-colors"
          />
          <p className="text-xs text-slate-400 font-body leading-relaxed">
            Powers live conversational questions with the NASA Space Specialist voice companion.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-display text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {saved ? 'Settings Saved!' : 'Save & Apply Keys'}
          </button>
          <button
            onClick={handleReset}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-display font-medium cursor-pointer transition-colors"
            title="Reset to defaults"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
