import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Cpu, X, FileText } from 'lucide-react';
import { NASA_CITATIONS, AI_DISCLOSURE } from '../data/citations';

export default function CitationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-mono text-base font-bold text-white">
                Official NASA Citations & AI Transparency Disclosure
              </h3>
              <p className="text-xs text-slate-400">
                Section 06 Master Compliance • Verified Planetary Data Registry
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

        {/* AI Transparency & Grounding Policy Banner */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            AI ARCHITECTURE & SCIENTIFIC INTEGRITY GUARDRAIL
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {AI_DISCLOSURE.groundingPolicy}
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1 flex flex-wrap gap-4 border-t border-slate-800">
            <span>Model: <strong>Google Gemini 2.5 Flash</strong></span>
            <span>Audio: <strong>Browser Web Speech API</strong></span>
            <span>Coordinates: <strong>DE421 Ephemeris / GISS Mars24</strong></span>
          </div>
        </div>

        {/* Citation Registry Cards */}
        <div className="space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
            NASA Resource Authority Registry (6 Primary Repositories)
          </h4>

          {NASA_CITATIONS.map((cit, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {cit.authority}
                  </h5>
                  <span className="text-[11px] text-cyan-300 block">{cit.role}</span>
                </div>
                <a
                  href={cit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700 transition-colors shrink-0"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cit.dataset}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {cit.verifiedRecords.map((rec, i) => (
                  <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-slate-800">
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
