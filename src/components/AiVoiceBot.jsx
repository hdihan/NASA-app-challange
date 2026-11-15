import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, X, Bot, User, Square, Volume2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export default function AiVoiceBot({
  activePlanetId = 'moon',
  activeArtifact = null,
  focusedHardwarePart = null,
  isDrawerOpen = false,
  isMuted = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings explorer! I am your NASA Mission Companion with Team BYTESTAR. Ask me anything about our abandoned spacecraft on the Moon and Mars, or select any rover, lander, or orbiter to explore its hardware.",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  // Subscribe to speech service states
  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
    });
    return () => unsub();
  }, []);

  // Update greeting when user inspects an artifact
  useEffect(() => {
    if (activeArtifact) {
      const greeting = `Transmission open. I am ${activeArtifact.name}, resting on ${activeArtifact.body} at ${activeArtifact.location}. How can I assist your survey of NASA's historic planetary hardware today?`;
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          artifactName: activeArtifact.shortName
        }
      ]);
    }
  }, [activeArtifact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Build live, real-time appContext object injected into every single message
  const getLiveAppContext = () => {
    const isMoon = activePlanetId === 'moon';
    return {
      currentCelestialBody: isMoon
        ? "Moon (Earth's Natural Satellite, 384,400 km from Earth)"
        : "Mars (The Red Planet, ~225,000,000 km from Earth)",
      currentViewMode: activeArtifact
        ? "3D Equipment Inspection View"
        : "Planet Orbit View",
      selectedEquipment: activeArtifact
        ? `${activeArtifact.name} (${activeArtifact.statusType === 'abandoned' ? 'ABANDONED ARTIFACT' : 'FUTURE MONUMENT'}, located at ${activeArtifact.location})`
        : "None",
      focusedHardwarePart: focusedHardwarePart
        ? `${focusedHardwarePart.name || 'Hardware Part'}: ${focusedHardwarePart.desc || ''}`
        : "None"
    };
  };

  const handleSend = async (queryText) => {
    const text = (queryText || inputText).trim();
    if (!text || isLoading) return;

    soundEffects.playRadioStatic(0.2);
    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const appContext = getLiveAppContext();

    try {
      const response = await geminiService.generateResponse({
        prompt: text,
        appContext,
        activeArtifact
      });

      const aiMsg = {
        sender: 'ai',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        artifactName: activeArtifact?.shortName
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);

      if (!isMuted) {
        speechService.speak(
          response.text,
          activeArtifact?.voiceProfile || {
            pitch: 1.05,
            rate: 1.0,
            elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
            gender: 'female'
          }
        );
      }
    } catch (err) {
      console.warn('AI voice bot query error:', err);
      setIsLoading(false);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopListening();
    } else {
      soundEffects.playChirp(1200);
      speechService.startListening(
        (transcript) => {
          handleSend(transcript);
        },
        (err) => {
          console.warn('Speech recognition err:', err);
        }
      );
    }
  };

  const handleStopSpeech = () => {
    soundEffects.playChirp(800);
    speechService.stop();
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 pointer-events-auto">
      {/* Minimized Floating Pill Button in Bottom-Left Corner */}
      {!isOpen ? (
        <button
          onClick={() => {
            soundEffects.playChirp(900);
            setIsOpen(true);
          }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 text-white font-heading text-sm font-bold shadow-[0_0_25px_rgba(0,229,255,0.5)] border border-cyan-400/60 cursor-pointer transition-all hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Ask NASA AI Companion</span>
          {isSpeaking && (
            <span className="flex items-center gap-1 ml-1.5">
              <span className="w-1.5 h-3.5 bg-cyan-300 rounded-full animate-pulse" />
              <span className="w-1.5 h-5 bg-cyan-200 rounded-full animate-pulse" />
              <span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-pulse" />
            </span>
          )}
        </button>
      ) : (
        /* Expanded Floating AI Companion Window (Docked in Bottom-Left) */
        <div className="w-96 sm:w-[420px] h-[520px] max-h-[82vh] bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-heading text-sm font-bold text-white">
                  <span>{activeArtifact ? `${activeArtifact.shortName} AI` : 'NASA Mission Specialist'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    LIVE
                  </span>
                </div>
                <div className="text-xs font-body text-slate-400">
                  {isSpeaking ? 'Speaking in natural voice...' : isListening ? 'Listening to your microphone...' : 'Grounded in NASA NSSDCA Telemetry'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 cursor-pointer"
                  title="Stop speaking"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={() => {
                  soundEffects.playChirp(700);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-body text-xs sm:text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.artifactName && (
                    <div className="text-[10px] font-mono font-bold text-cyan-400 mb-1">
                      {msg.artifactName}
                    </div>
                  )}
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  <div className="text-[9px] font-mono text-slate-400 text-right mt-1.5 opacity-70">
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2 bg-slate-900/60 rounded-xl w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Interpreting planetary telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Chips */}
          <div className="px-4 py-1.5 bg-slate-900/50 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            <button
              onClick={() => handleSend("What's this planet called that I'm opening right now?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              🌍 What planet is this?
            </button>
            <button
              onClick={() => handleSend("What am I looking at right now?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              🔭 What am I looking at?
            </button>
            <button
              onClick={() => handleSend("Why was this equipment left on the Moon or Mars?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              🏛️ Why was it left?
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-cyan-500/20 flex items-center gap-2">
            <button
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-cyan-400'
              }`}
              title={isListening ? 'Stop microphone' : 'Talk with microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about this mission..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
