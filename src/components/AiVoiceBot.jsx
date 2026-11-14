import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, X, Bot, User, Square } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

export default function AiVoiceBot({ activeArtifact, isMuted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings explorer! I am your NASA Mission Companion with Team BYTESTAR. Ask me anything about our abandoned spacecraft on the Moon and Mars, or select any rover, lander, or orbiter to hear its story.",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsListening(state.isListening);
      setIsSpeaking(state.isSpeaking);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (activeArtifact) {
      const greeting = `Transmission open. I am ${activeArtifact.name}, resting at ${activeArtifact.location}. How can I assist your survey of NASA's historic planetary hardware today?`;
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

    try {
      const response = await geminiService.generateResponse({
        prompt: text,
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
            pitch: 1.15,
            rate: 1.05,
            elevenLabsVoiceId: 'XB0fDUnXU5powFXDhCwa',
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
    speechService.stop();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      {/* Minimized Floating Pill Button */}
      {!isOpen ? (
        <button
          onClick={() => {
            soundEffects.playChirp(900);
            setIsOpen(true);
          }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 text-white font-display text-sm font-bold shadow-[0_0_30px_rgba(0,229,255,0.6)] border border-cyan-400/60 cursor-pointer transition-all hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Ask NASA AI Voice Companion</span>
          {isSpeaking && (
            <span className="flex items-center gap-1 ml-1.5">
              <span className="w-1.5 h-3.5 bg-white rounded-full animate-pulse" />
              <span className="w-1.5 h-5 bg-white rounded-full animate-pulse" />
              <span className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
            </span>
          )}
        </button>
      ) : (
        /* Expanded Floating AI Companion Window */
        <div className="w-96 sm:w-[420px] h-[520px] max-h-[82vh] bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-display text-sm font-bold text-white">
                  <span>{activeArtifact ? `${activeArtifact.shortName} AI` : 'NASA Mission Specialist'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    LIVE VOICE
                  </span>
                </div>
                <div className="text-xs font-body text-slate-400">
                  {isSpeaking ? 'Narrating in natural voice...' : isListening ? 'Listening to your microphone...' : 'Grounded in NASA NSSDCA Telemetry'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Stop AI speech"
                >
                  <Square className="w-3 h-3 fill-rose-300" />
                  Stop Voice
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Minimize AI Voice Bot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Speaking Audio Indicator Banner */}
          {isSpeaking && (
            <div className="bg-cyan-950/70 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                ELEVENLABS STREAMING BROADCAST
              </span>
              <button
                onClick={handleStopSpeech}
                className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
              >
                Click to Silence
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-body text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-400">
                  {m.sender === 'user' ? (
                    <>
                      <span>Explorer</span>
                      <User className="w-3 h-3 text-cyan-400" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-emerald-400" />
                      <span>{m.artifactName || 'NASA Specialist'}</span>
                    </>
                  )}
                  <span>• {m.time}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-md font-sans text-sm'
                      : 'bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-md font-sans text-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Formulating telemetry response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/60 flex gap-2 overflow-x-auto">
            {[
              "Why was it left behind?",
              "What did its instruments find?",
              "How did it pave the way?",
              "What will happen to it in the future?"
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="text-xs font-mono px-3 py-1.5 rounded-full bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 border-t border-cyan-500/20 bg-slate-900/95 flex items-center gap-2.5">
            <button
              onClick={handleToggleMic}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isListening ? 'Click to stop listening' : 'Speak via microphone (Speech-to-Text)'}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={activeArtifact ? `Ask ${activeArtifact.shortName}...` : "Ask about abandoned missions..."}
              className="flex-1 bg-slate-950/90 border border-slate-700 focus:border-cyan-400 rounded-2xl px-4 py-2.5 text-sm font-body text-white placeholder-slate-500 outline-none transition-colors"
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold cursor-pointer transition-all shadow-md"
              title="Send question"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
