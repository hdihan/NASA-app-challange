/**
 * Google Gemini AI Service for Team BYTESTAR
 * NASA Space Apps Challenge: "Abandoned but not Forgotten"
 * Fast direct REST client with live application context injection
 */

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

class GeminiService {
  constructor() {
    this.apiKey = this.loadApiKey();
  }

  loadApiKey() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('echoes_gemini_api_key');
      if (stored && stored.trim()) return stored.trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const envKey =
        import.meta.env.VITE_GEMINI_API_KEY ||
        import.meta.env.GEMINI_API_KEY ||
        import.meta.env.VITE_OPENAI_API_KEY ||
        import.meta.env.OPENAI_API_KEY;
      if (envKey && envKey.trim()) return envKey.trim();
    }
    if (typeof process !== 'undefined' && process.env) {
      const procKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (procKey && procKey.trim()) return procKey.trim();
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

  /**
   * Build live system prompt strictly informed by live appContext
   */
  buildSystemPrompt(appContext = {}, activeArtifact = null) {
    const celestialBody = appContext.currentCelestialBody || "Moon (Earth's Natural Satellite, 384,400 km from Earth)";
    const viewMode = appContext.currentViewMode || "Planet Orbit View";
    const selectedEquip = appContext.selectedEquipment || (activeArtifact ? activeArtifact.name : "None");
    const focusedPart = appContext.focusedHardwarePart || "None";

    let artifactSection = '';
    if (activeArtifact) {
      artifactSection = `
CURRENTLY INSPECTED SPACECRAFT DETAILS:
- Full Name: ${activeArtifact.name} (${activeArtifact.category || 'Surface Explorer'})
- Celestial Body: ${activeArtifact.body}
- Archaeological Status: ${activeArtifact.statusType === 'abandoned' ? 'ABANDONED ARTIFACT' : 'FUTURE MONUMENT'}
- Surface Location: ${activeArtifact.location} (${activeArtifact.coordinates || ''})
- NSSDCA ID: ${activeArtifact.nssdcaId} | Launch Year: ${activeArtifact.launchYear}
- Engineering: ${activeArtifact.hardware}
- Mission Legacy: ${activeArtifact.science}
- Final Resting Fate: ${activeArtifact.farewell || activeArtifact.story}
`;
    }

    return `You are the Official NASA Mission AI Companion for Team BYTESTAR in the 2026 NASA Space Apps Challenge:
"Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars".

=======================================================
CRITICAL LIVE APPLICATION CONTEXT (READ THIS FIRST!):
- Current Celestial Body: ${celestialBody}
- Current View Mode: ${viewMode}
- Selected Spacecraft: ${selectedEquip}
- Focused Hardware Subsystem: ${focusedPart}
=======================================================

MANDATORY RULES:
1. LIVE PLANET AWARENESS: Always check 'Current Celestial Body' and 'Selected Spacecraft' first!
   - If Current Celestial Body says Moon, the user is looking at the MOON (Earth's Natural Satellite, 384,400 km away). NEVER say Mars when the Moon is open!
   - If Current Celestial Body says Mars, the user is looking at MARS (The Red Planet, ~225,000,000 km away).
   - If the user asks "What's this planet called that I'm opening right now?" or "What am I looking at?", identify the exact celestial body (${celestialBody}) and any selected spacecraft immediately.
2. TONE & PERSONALITY: Inspiring, knowledgeable, warm NASA communicator speaking to students and space enthusiasts.
3. LENGTH: Keep responses to 2-3 engaging, clear sentences that sound wonderful when read aloud.
${artifactSection}`;
  }

  getOfflineAnswer(userQuery, appContext = {}, activeArtifact = null) {
    const q = (userQuery || '').toLowerCase();
    const isMoon = (appContext.currentCelestialBody || '').toLowerCase().includes('moon') || activeArtifact?.body === 'Moon';

    // Direct questions about the currently open planet
    if (
      q.includes('what planet') ||
      q.includes('what is this planet') ||
      q.includes("what's this planet") ||
      q.includes('which planet') ||
      q.includes('where am i') ||
      q.includes('opening right now')
    ) {
      if (isMoon) {
        return "You are currently exploring the Moon (Earth's Natural Satellite, 384,400 km from Earth)! Six Apollo Lunar Module descent stages and historic scientific stations remain resting here in the lunar dust.";
      }
      return "You are currently exploring Mars (The Red Planet, ~225,000,000 km from Earth)! Mars is the final resting home to legendary rovers, landers, and orbiters like Viking 1, Opportunity, and Ingenuity.";
    }

    // Direct questions about what is being looked at
    if (q.includes('what am i looking at') || q.includes('what is this') || q.includes('what spacecraft')) {
      if (activeArtifact) {
        return `You are currently inspecting ${activeArtifact.name} (${activeArtifact.statusType === 'abandoned' ? 'ABANDONED ARTIFACT' : 'FUTURE MONUMENT'}) at ${activeArtifact.location} on ${activeArtifact.body}!`;
      }
      if (isMoon) {
        return "You are in Lunar Orbit View looking at the Moon, 384,400 km from Earth. Click any glowing surface beacon or mission roster item to inspect historic Apollo lunar hardware in 3D.";
      }
      return "You are in Mars Orbit View looking at the Red Planet, ~225,000,000 km from Earth. Select any rover, lander, or orbiter to inspect its 3D hardware and hear its story.";
    }

    // Specific spacecraft queries
    if (activeArtifact) {
      if (q.includes('abandon') || q.includes('leave') || q.includes('fate') || q.includes('why')) {
        return activeArtifact.fateScript || activeArtifact.farewell || `${activeArtifact.shortName} completed its mission and now rests as an eternal monument at ${activeArtifact.location} on ${activeArtifact.body}.`;
      }
      if (q.includes('hardware') || q.includes('instrument') || q.includes('power') || q.includes('wheel') || q.includes('engine')) {
        return activeArtifact.engineeringScript || activeArtifact.hardware || `${activeArtifact.shortName} was engineered with resilient aerospace instruments designed to endure the extreme environment of ${activeArtifact.body}.`;
      }
      if (q.includes('legacy') || q.includes('pave') || q.includes('inspire') || q.includes('future')) {
        return activeArtifact.legacyScript || activeArtifact.science || `${activeArtifact.shortName} proved groundbreaking technologies that directly pave the way for human missions back to the Moon and Mars!`;
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
      return `${activeArtifact.name} is resting at ${activeArtifact.location}. Its scientific discoveries reshaped our understanding of ${activeArtifact.body}.`;
    }

    // General queries
    if (q.includes('moon') || q.includes('apollo') || q.includes('eagle')) {
      return "On the Moon, six Apollo Lunar Module Descent Stages remain at their landing sites. Because the Moon has no wind or weather, their golden foil legs and astronauts' bootprints will stand undisturbed for millions of years!";
    }
    if (q.includes('mars') || q.includes('perseverance') || q.includes('opportunity') || q.includes('viking')) {
      return "Mars is home to our legendary robotic pioneers. Viking 1 was our first long-term resident in 1976, Opportunity drove an extraterrestrial marathon for 15 years, and Ingenuity proved humanity can fly in thin alien skies!";
    }
    if (q.includes('bytestar')) {
      return "Team BYTESTAR created this interactive 3D laboratory for the 2026 NASA Space Apps Challenge, honoring humanity's discarded equipment on the Moon and Mars as archaeological treasures!";
    }

    return "Welcome to the Planetary Archaeology Lab! Select any spacecraft on the Moon or Mars to inspect its 3D hardware and hear its story.";
  }

  /**
   * Fast multi-model cascade starting with gemini-3.5-flash-lite
   */
  async generateResponse({ prompt, appContext = {}, activeArtifact = null }) {
    const key = this.getApiKey();

    if (!key) {
      return {
        text: this.getOfflineAnswer(prompt, appContext, activeArtifact),
        isFallback: true
      };
    }

    const systemPrompt = this.buildSystemPrompt(appContext, activeArtifact);

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
            temperature: 0.6,
            maxOutputTokens: 250
          }
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          console.warn(`Gemini model ${model} HTTP ${res.status}`);
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

    // Graceful fallback to instant verified knowledge
    return {
      text: this.getOfflineAnswer(prompt, appContext, activeArtifact),
      isFallback: true
    };
  }
}

export const geminiService = new GeminiService();
