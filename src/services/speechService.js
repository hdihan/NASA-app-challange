/**
 * Centralized Single-Voice Audio Manager & Speech Controller for Team BYTESTAR
 * Supports ElevenLabs Streaming TTS with high-quality Web Speech API fallback
 * Guaranteed ZERO voice overlap: immediately stops, resets, and destroys any active audio
 */

// Premade fallback voice mapping (works across both Free and Paid ElevenLabs accounts)
const PREMADE_VOICE_FALLBACKS = {
  male: 'TxGEqnHWrfWFTfGW9XjX',    // Josh - friendly male
  female: '21m00Tcm4TlvDq8ikWAM'  // Rachel - warm female
};

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isMuted = false;
    this.lastSpokenText = '';
    this.lastVoiceProfile = null;
    this.onStateChangeCallbacks = [];
    this.currentUtterance = null;
    this.cachedVoices = [];
    
    // ElevenLabs state & audio player
    this.currentAudio = null;
    this.audioCache = new Map(); // text+voiceId -> blobUrl for instant repeat play
    this.elevenLabsKey = this.loadElevenLabsKey();

    if (typeof window !== 'undefined' && this.synth) {
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.cachedVoices = this.synth.getVoices();
        };
      }
      this.cachedVoices = this.synth.getVoices();
    }

    this.initRecognition();
  }

  loadElevenLabsKey() {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('echoes_elevenlabs_api_key');
    if (stored && stored.trim()) return stored.trim();
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) {
      return import.meta.env.VITE_ELEVENLABS_API_KEY.trim();
    }
    return '';
  }

  setElevenLabsApiKey(key) {
    const trimmed = (key || '').trim();
    this.elevenLabsKey = trimmed;
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('echoes_elevenlabs_api_key', trimmed);
      } else {
        localStorage.removeItem('echoes_elevenlabs_api_key');
      }
    }
  }

  getElevenLabsApiKey() {
    return this.elevenLabsKey || this.loadElevenLabsKey();
  }

  hasElevenLabsKey() {
    return Boolean(this.getElevenLabsApiKey());
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.onStateChangeCallbacks.forEach((cb) =>
      cb({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking,
        isMuted: this.isMuted,
        hasKey: this.hasElevenLabsKey()
      })
    );
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
    this.notify();
  }

  /**
   * Immediately stops any active audio across both ElevenLabs and Browser synthesis
   * Strictly guarantees ZERO audio overlap
   */
  stop() {
    // 1. Stop any playing HTMLAudioElement
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        console.warn('Audio pause error:', e);
      }
      this.currentAudio = null;
    }

    // 2. Cancel browser speechSynthesis
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Synth cancel error:', e);
      }
    }

    this.currentUtterance = null;
    this.isSpeaking = false;
    this.notify();
  }

  /**
   * Stream / play audio using ElevenLabs API
   */
  async speakWithElevenLabs(text, voiceProfile = {}, onEnd = null) {
    const apiKey = this.getElevenLabsApiKey();
    const voiceId = voiceProfile?.elevenLabsVoiceId || PREMADE_VOICE_FALLBACKS[voiceProfile?.gender || 'male'];
    const cacheKey = `${voiceId}_${text.trim()}`;

    // Clean text for speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Check in-memory audio blob cache
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey);
      this.playAudioUrl(cachedUrl, onEnd);
      return;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.85
          }
        })
      });

      // If library voice requires paid plan, retry with guaranteed premade voice
      if (response.status === 402 || response.status === 400) {
        const errJson = await response.json().catch(() => ({}));
        if (errJson?.detail?.code === 'paid_plan_required' || errJson?.detail?.type === 'payment_required') {
          console.warn(`ElevenLabs voice ${voiceId} requires paid plan, retrying with premade voice...`);
          const fallbackVoiceId = PREMADE_VOICE_FALLBACKS[voiceProfile?.gender || 'male'];
          return this.speakWithElevenLabsFallback(cleanText, fallbackVoiceId, onEnd);
        }
        throw new Error(`ElevenLabs error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`ElevenLabs HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.audioCache.set(cacheKey, blobUrl);
      this.playAudioUrl(blobUrl, onEnd);
    } catch (err) {
      console.warn('ElevenLabs speech failed, gracefully falling back to browser voice:', err);
      this.speakBrowser(text, voiceProfile, onEnd);
    }
  }

  async speakWithElevenLabsFallback(cleanText, fallbackVoiceId, onEnd) {
    const apiKey = this.getElevenLabsApiKey();
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2_5'
        })
      });
      if (!res.ok) throw new Error('Fallback failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.playAudioUrl(blobUrl, onEnd);
    } catch {
      this.speakBrowser(cleanText, this.lastVoiceProfile, onEnd);
    }
  }

  playAudioUrl(audioUrl, onEnd) {
    this.stop(); // zero overlap check
    const audio = new Audio(audioUrl);
    this.currentAudio = audio;
    this.isSpeaking = true;
    this.notify();

    audio.onended = () => {
      this.isSpeaking = false;
      this.currentAudio = null;
      this.notify();
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error:', e);
      this.isSpeaking = false;
      this.currentAudio = null;
      this.notify();
      if (onEnd) onEnd();
    };

    audio.play().catch((err) => {
      console.warn('Audio play promise rejected:', err);
      this.isSpeaking = false;
      this.currentAudio = null;
      this.notify();
      if (onEnd) onEnd();
    });
  }

  /**
   * Browser SpeechSynthesis Fallback
   */
  speakBrowser(text, voiceProfile = { pitch: 1.0, rate: 0.98 }, onEnd = null) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    try {
      const cleanText = text
        .replace(/[*#_`~]/g, '')
        .replace(/CO₂/g, 'carbon dioxide')
        .replace(/O₂/g, 'oxygen');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = voiceProfile?.pitch ?? 1.0;
      utterance.rate = voiceProfile?.rate ?? 0.96;
      utterance.lang = 'en-US';

      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
      if (voices && voices.length > 0) {
        const enVoices = voices.filter((v) => v.lang.startsWith('en'));
        const isFemale = voiceProfile?.gender === 'female';
        
        let matchVoice = enVoices.find((v) => {
          const name = v.name.toLowerCase();
          if (isFemale) {
            return name.includes('natural') || name.includes('aria') || name.includes('jenny') || name.includes('samantha') || name.includes('zira') || name.includes('karen');
          }
          return name.includes('natural') || name.includes('guy') || name.includes('daniel') || name.includes('david') || name.includes('george') || name.includes('adam');
        });

        if (!matchVoice) matchVoice = enVoices[0];
        if (matchVoice) utterance.voice = matchVoice;
      }

      this.currentUtterance = utterance;
      this.isSpeaking = true;
      this.notify();

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notify();
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('SpeechSynthesis error:', e);
        }
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notify();
        if (onEnd) onEnd();
      };

      setTimeout(() => {
        if (this.synth && this.currentUtterance === utterance) {
          this.synth.speak(utterance);
        }
      }, 20);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
      this.isSpeaking = false;
      this.notify();
      if (onEnd) onEnd();
    }
  }

  /**
   * Main Speak Method: Uses ElevenLabs if API key present, else high quality browser voice
   */
  speak(text, voiceProfile = {}, onEnd = null) {
    // Strictly cancel and destroy any existing audio first to guarantee zero overlap
    this.stop();

    if (!text || this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    this.lastSpokenText = text;
    this.lastVoiceProfile = voiceProfile;

    if (this.hasElevenLabsKey()) {
      this.speakWithElevenLabs(text, voiceProfile, onEnd);
    } else {
      this.speakBrowser(text, voiceProfile, onEnd);
    }
  }

  replay() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText, this.lastVoiceProfile);
    }
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }

    this.stop();

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notify();
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      this.notify();
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.notify();
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notify();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      this.notify();
      if (onError) onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
    this.notify();
  }
}

export const speechService = new SpeechService();
