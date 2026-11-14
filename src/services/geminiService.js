/**
 * Google Gemini AI Service for Team BYTESTAR
 * Resilient multi-model cascade with instant NASA knowledge fallback
 * Tested with latest Gemini API endpoints
 */

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash'
];

class GeminiService {
  constructor() {
    this.apiKey = this.loadApiKey();
  }

  loadApiKey() {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('echoes_gemini_api_key');
    if (stored && stored.trim()) return stored.trim();
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
    return '';
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (typeof window !== 'undefined') {
      if (this.apiKey) {
        localStorage.setItem('echoes_gemini_api_key', this.apiKey);
      } else {
        localStorage.removeItem('echoes_gemini_api_key');
      }
    }
  }

  getApiKey() {
    return this.apiKey || this.loadApiKey();
  }

  hasCustomKey() {
    return Boolean(this.getApiKey());
  }

  buildSystemPrompt(activeArtifact) {
    if (activeArtifact) {
      return `You are ${activeArtifact.name} (${activeArtifact.category}) currently on ${activeArtifact.body} at ${activeArtifact.location}.
You are speaking as part of the 2026 NASA Space Apps Challenge project 'Echoes Beyond Earth' by Team BYTESTAR.
Personality: Warm, passionate robotic explorer speaking to school-age students and space lovers.
Key Facts: NSSDCA ID ${activeArtifact.nssdcaId}, launched in ${activeArtifact.launchYear}.
Hardware: ${activeArtifact.hardware}.
Mission legacy: ${activeArtifact.science}.
Current status & fate: ${activeArtifact.statusBadge}.
Always reply in 2-3 engaging, conversational sentences that sound natural when spoken aloud.`;
    }

    return `You are a NASA Goddard & JPL Senior Mission Specialist assisting Team BYTESTAR for the 2026 NASA Space Apps Challenge: 'Abandoned but not Forgotten: Storytelling about NASA\'s Discarded Equipment on the Moon and Mars'.
Personality: Enthusiastic, brilliant, inspiring space explorer.
Knowledge: Apollo Lunar Modules (Eagle, Challenger), Viking 1 Lander, Opportunity Rover (MER-B), Ingenuity Helicopter, Mars Global Surveyor, MRO, MAVEN, Perseverance.
Always reply in 2-3 exciting, clear sentences suitable for audio narration.`;
  }

  getOfflineAnswer(userQuery, activeArtifact) {
    const q = (userQuery || '').toLowerCase();

    // Check specific equipment
    if (activeArtifact) {
      if (q.includes('abandon') || q.includes('leave') || q.includes('fate') || q.includes('why')) {
        return activeArtifact.fateScript || activeArtifact.farewell || `${activeArtifact.shortName} fulfilled its mission objectives and now rests permanently as a historic monument on ${activeArtifact.body}.`;
      }
      if (q.includes('hardware') || q.includes('instrument') || q.includes('power') || q.includes('wheel') || q.includes('engine')) {
        return activeArtifact.engineeringScript || `${activeArtifact.shortName} carried specialized NASA instruments that endured the extreme space environment to gather unprecedented scientific data.`;
      }
      if (q.includes('legacy') || q.includes('pave') || q.includes('inspire') || q.includes('future')) {
        return activeArtifact.legacyScript || `${activeArtifact.shortName} proved critical technologies that directly paved the way for modern missions and future human exploration.`;
      }
      if (q.includes('story') || q.includes('history') || q.includes('land') || q.includes('fly')) {
        return activeArtifact.narrationScript || activeArtifact.story;
      }
      if (activeArtifact.offlineQA) {
        const found = activeArtifact.offlineQA.find(item => {
          const words = item.q.toLowerCase().split(' ').filter(w => w.length > 3);
          return words.some(w => q.includes(w));
        });
        if (found) return found.a;
      }
      return `${activeArtifact.name} here at ${activeArtifact.location}. My hardware recorded milestones that rewritten planetary science, paving the way for humanity's next giant leap.`;
    }

    // General queries
    if (q.includes('moon') || q.includes('apollo') || q.includes('eagle')) {
      return "On the Moon, six Apollo Lunar Module Descent Stages remain at their landing sites. Because the Moon has no wind or weather, their golden foil legs and the astronauts' bootprints will stand undisturbed for millions of years!";
    }
    if (q.includes('mars') || q.includes('perseverance') || q.includes('opportunity') || q.includes('viking')) {
      return "Mars is home to our legendary robotic pioneers. Viking 1 was our first long-term resident in 1976, Opportunity drove an extraterrestrial marathon for 15 years, and Ingenuity proved humanity can fly in thin alien skies!";
    }
    if (q.includes('bytestar')) {
      return "Team BYTESTAR engineered this interactive 3D laboratory for the 2026 NASA Space Apps Challenge, bringing silent monuments on the Moon and Mars back to life with authentic storytelling!";
    }

    return "Welcome to the Planetary Archaeology Lab! Click on any spacecraft on the Moon or Mars to inspect its 3D hardware, drive it across the surface, and hear its story narrated aloud.";
  }

  async generateResponse({ prompt, activeArtifact }) {
    const key = this.getApiKey();

    if (!key) {
      return {
        text: this.getOfflineAnswer(prompt, activeArtifact),
        isFallback: true
      };
    }

    const systemPrompt = this.buildSystemPrompt(activeArtifact);

    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const body = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          console.warn(`Model ${model} returned ${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { text, isFallback: false, model };
        }
      } catch (err) {
        console.warn(`Error querying ${model}:`, err.message);
      }
    }

    return {
      text: this.getOfflineAnswer(prompt, activeArtifact),
      isFallback: true
    };
  }
}

export const geminiService = new GeminiService();
