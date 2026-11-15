/**
 * Centralized Single-Voice Audio Manager & Speech Controller for Team BYTESTAR
 * NASA Space Apps Challenge 2026: "Abandoned but not Forgotten"
 * 
 * High-definition ElevenLabs Human Voice Engine with expressive speech settings
 * Supports eleven_v3 with cascading fallbacks to eleven_multilingual_v2 and eleven_turbo_v2_5
 * Natural Kid-Friendly Storytelling with zero voice overlap
 */

// Voice fallbacks per gender for standard accounts
const PREMADE_VOICE_FALLBACKS = {
  male: 'TxGEqnHWrfWFTfGW9XjX',    // Josh - friendly warm male
  female: '21m00Tcm4TlvDq8ikWAM'  // Rachel - warm expressive female
};

const ELEVEN_MODELS = [
  'eleven_v3',
  'eleven_multilingual_v2',
  'eleven_turbo_v2_5'
];

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
    this.audioCache = new Map(); // cacheKey -> blobUrl for instant replay
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
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('echoes_elevenlabs_api_key');
      if (stored && stored.trim()) return stored.trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const envKey =
        import.meta.env.VITE_ELEVENLABS_API_KEY ||
        import.meta.env.ELEVENLABS_API_KEY;
      if (envKey && envKey.trim()) return envKey.trim();
    }
    if (typeof process !== 'undefined' && process.env) {
      const procKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
      if (procKey && procKey.trim()) return procKey.trim();
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
    this.notify();
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
   * Stream / play audio using ElevenLabs REST API with expressive settings
   */
  async speakWithElevenLabs(text, voiceProfile = {}, onEnd = null) {
    const apiKey = this.getElevenLabsApiKey();
    const voiceId = voiceProfile?.elevenLabsVoiceId || PREMADE_VOICE_FALLBACKS[voiceProfile?.gender || 'female'];
    const cacheKey = `${voiceId}_${text.trim()}`;

    // Clean text for speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Check in-memory audio blob cache for instant replay
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey);
      this.playAudioUrl(cachedUrl, onEnd);
      return;
    }

    // Try eleven_v3 first, then fallback models
    for (const modelId of ELEVEN_MODELS) {
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
            model_id: modelId,
            voice_settings: {
              stability: 0.30,
              similarity_boost: 0.82,
              style: 0.72,
              use_speaker_boost: true
            }
          })
        });

        if (response.status === 402 || response.status === 400) {
          const errJson = await response.json().catch(() => ({}));
          // If custom voice requires paid plan, try premade fallback voice
          if (errJson?.detail?.code === 'paid_plan_required' || errJson?.detail?.type === 'payment_required') {
            const fallbackVoiceId = PREMADE_VOICE_FALLBACKS[voiceProfile?.gender || 'female'];
            return this.speakWithElevenLabsFallback(cleanText, fallbackVoiceId, onEnd);
          }
          // Continue to next model if model_id not supported
          continue;
        }

        if (!response.ok) {
          console.warn(`ElevenLabs HTTP ${response.status} with model ${modelId}`);
          continue;
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, blobUrl);
        this.playAudioUrl(blobUrl, onEnd);
        return;
      } catch (err) {
        console.warn(`ElevenLabs error with ${modelId}:`, err);
      }
    }

    // If all ElevenLabs attempts fail, gracefully fallback to browser voice
    this.speakBrowser(text, voiceProfile, onEnd);
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
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.80
          }
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
    this.stop(); // Zero overlap guarantee
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

  speakBrowser(text, voiceProfile = {}, onEnd = null) {
    if (!this.synth || this.isMuted) return;
    this.stop();

    const cleanText = text
      .replace(/\[chuckles\]/gi, '')
      .replace(/[*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = voiceProfile?.rate || 1.0;
    utterance.pitch = voiceProfile?.pitch || 1.05;

    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    const isFemale = voiceProfile?.gender === 'female';

    const preferredVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      if (isFemale) {
        return (
          (name.includes('female') ||
            name.includes('zira') ||
            name.includes('samantha') ||
            name.includes('victoria') ||
            name.includes('karen') ||
            name.includes('google us english') ||
            name.includes('natural')) &&
          v.lang.startsWith('en')
        );
      }
      return (
        (name.includes('david') ||
          name.includes('george') ||
          name.includes('male') ||
          name.includes('guy')) &&
        v.lang.startsWith('en')
      );
    });

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speak(text, voiceProfile = {}, onEnd = null) {
    if (this.isMuted || !text) return;

    this.lastSpokenText = text;
    this.lastVoiceProfile = voiceProfile;

    // Use ElevenLabs if API key is present
    if (this.hasElevenLabsKey()) {
      this.speakWithElevenLabs(text, voiceProfile, onEnd);
    } else {
      this.speakBrowser(text, voiceProfile, onEnd);
    }
  }

  startListening(onResult, onError) {
    if (!this.recognition) return;
    this.stop();

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notify();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && onResult) {
        onResult(transcript);
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
      console.warn('Recognition start error:', e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    this.isListening = false;
    this.notify();
  }
}

export const speechService = new SpeechService();
