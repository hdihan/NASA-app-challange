import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, RotateCcw, X, Radio, Sparkles, User, Bot, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export default function VoiceCommsPanel({
  activeArtifact,
  isOpen,
  onClose,
  isMuted,
  onToggleMute
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const lastInputWasVoice = useRef(false);

  // Subscribe to speechService state
  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
    });
    return () => unsubscribe();
  }, []);

  // Update greeting when activeArtifact changes or when first opened
  useEffect(() => {
    if (activeArtifact) {
      const greeting = `Transmission open. I am ${activeArtifact.name}, resting at ${activeArtifact.location}. How can I assist your planetary archaeology survey today?`;
      setMessages([
        {
          sender: 'ai',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      // Speak greeting
      speechService.speak(greeting, activeArtifact.voiceProfile);
    } else {
      const specialistGreeting = "NASA Mission Specialist Link Active. I'm standing by to guide your exploration of discarded lunar and Martian equipment. Where shall we navigate next?";
      setMessages([
        {
          sender: 'ai',
          text: specialistGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speechService.speak(specialistGreeting, { pitch: 1.0, rate: 1.0 });
    }
  }, [activeArtifact]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    // Track whether this send originated from voice or keyboard
    if (typeof textToSend === 'string') {
      lastInputWasVoice.current = true;
    } else {
      lastInputWasVoice.current = false;
    }

    soundEffects.playRadioStatic(0.2);
    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await geminiService.generateResponse({
        prompt: query,
        activeArtifact
      });

      const aiMsg = {
        sender: 'ai',
        text: result.text,
        isFallback: result.isFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);

      // Speak response aloud with spacecraft-specific pitch and rate
      const voiceProfile = activeArtifact ? activeArtifact.voiceProfile : { pitch: 1.0, rate: 1.0 };
      speechService.speak(result.text, voiceProfile, () => {
        // Auto-rearm voice after AI finishes speaking (voice conversation mode)
        if (lastInputWasVoice.current && !speechService.isMuted) {
          setTimeout(() => handleStartListening(), 300);
        }
      });
    } catch (err) {
      console.warn('Comms link error:', err);
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    soundEffects.playChirp(1200);
    lastInputWasVoice.current = true;
    speechService.startListening(
      (transcript) => {
        handleSendMessage(transcript);
      },
      (error) => {
        console.warn('Voice input error:', error);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[85vh] bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-slide-up">
      {/* Header */}
      <div className="p-3.5 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
              <span>{activeArtifact ? activeArtifact.shortName : 'NASA Space Specialist'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {activeArtifact ? 'MODE A' : 'MODE B'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Gemini 2.5 Flash • Zero-Latency Voice Link
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => speechService.replay()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Replay Voice Log"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Close Comms Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Waveform when Speaking / Listening */}
      {(isSpeaking || isListening) && (
        <div className="bg-cyan-950/60 border-b border-cyan-500/30 px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-cyan-300 animate-fade-in">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            {isListening ? 'MICROPHONE ACTIVE (LISTENING)...' : 'AI AUDIO STREAM BROADCASTING...'}
          </span>
          <div className="flex items-center gap-1 h-4">
            <div className="w-1 bg-cyan-400 rounded-full voice-bar-1" />
            <div className="w-1 bg-cyan-400 rounded-full voice-bar-2" />
            <div className="w-1 bg-cyan-400 rounded-full voice-bar-3" />
            <div className="w-1 bg-cyan-400 rounded-full voice-bar-4" />
            <div className="w-1 bg-cyan-400 rounded-full voice-bar-5" />
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
              {msg.sender === 'user' ? (
                <>
                  <span>Explorer</span>
                  <User className="w-3 h-3 text-cyan-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-emerald-400" />
                  <span>{activeArtifact ? activeArtifact.shortName : 'Mission Specialist'}</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}
              {msg.isFallback && (
                <div className="mt-1 pt-1 border-t border-slate-800 text-[9px] font-mono text-slate-400 flex items-center gap-1">
                  <span className="text-emerald-400">✓ NSSDCA Telemetry Log</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Establishing orbital relay link...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Chips */}
      {activeArtifact?.offlineQA && (
        <div className="px-3 py-2 border-t border-slate-800 bg-slate-900/50 flex gap-1.5 overflow-x-auto">
          {activeArtifact.offlineQA.map((qa, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qa.q)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-cyan-950 hover:border-cyan-500/50 border border-slate-700 text-slate-300 hover:text-cyan-300 whitespace-nowrap cursor-pointer transition-colors shrink-0"
            >
              {qa.q.slice(0, 32)}...
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 border-t border-cyan-500/20 bg-slate-900/90 flex items-center gap-2">
        <button
          onMouseDown={handleStartListening}
          onMouseUp={handleStopListening}
          onTouchStart={handleStartListening}
          onTouchEnd={handleStopListening}
          className={`p-2.5 rounded-xl border font-mono transition-all cursor-pointer ${
            isListening
              ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.7)]'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Hold to Speak (Speech-to-Text)"
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={activeArtifact ? `Ask ${activeArtifact.shortName}...` : "Ask NASA Specialist..."}
          className="flex-1 bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-none transition-colors"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold cursor-pointer transition-all shadow-md"
          title="Send Telemetry Query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
