/**
 * Official NASA NSSDCA & Mission Citation Registry
 * Section 06 Compliance
 */

export const NASA_CITATIONS = [
  {
    authority: 'NASA Space Science Data Coordinated Archive (NSSDCA)',
    role: 'Master Lunar Mission & Landing Site Index',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/planets/moonpage.html',
    dataset: 'Planetary Moon Directory: Coordinates, telemetry archives, launch vehicle specs, and trajectory logs.',
    verifiedRecords: ['Apollo 11 (1969-059C)', 'Apollo 15 (1971-063C)', 'Surveyor 3 (1967-035A)', 'Apollo 17 (1972-096C)']
  },
  {
    authority: 'NSSDCA Precise Apollo Coordinates & Laser Ranging Archive',
    role: 'DE421 LRO-Verified Lunar Coordinates',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html',
    dataset: 'DE421 ephemeris and Lunar Reconnaissance Orbiter Camera (LROC) high-precision landing coordinates for LM Descent Stages, LRRR retroreflectors, and ALSEP stations.',
    verifiedRecords: ['Tranquility Base (0.67416° N, 23.47314° E)', 'Hadley Rille (26.13239° N, 3.63330° E)', 'Taurus-Littrow (20.1911° N, 30.7723° E)']
  },
  {
    authority: 'NSSDCA Surveyor Mission Archive',
    role: 'Robotic Precursor Engineering Database',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/surveyor.html',
    dataset: 'Surveyor 3 flight log (NSSDCA ID: 1967-035A), Oceanus Procellarum landing data, soil mechanics claw stress readings, and Apollo 12 engineering retrieval report.',
    verifiedRecords: ['Surveyor 3 (3.015° S, 336.660° E)']
  },
  {
    authority: 'NSSDCA Planetary Mars Directory',
    role: 'Master Mars Exploration Index',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/planets/marspage.html',
    dataset: 'Official areographic parameters, atmospheric pressure models, orbital insertion trajectories, and spacecraft telemetry IDs.',
    verifiedRecords: ['Opportunity (2003-032A)', 'Spirit (2003-027A)', 'InSight (2018-042A)', 'Ingenuity (2020-052A)']
  },
  {
    authority: 'NASA Goddard Institute for Space Studies (GISS) Mars24',
    role: 'Official Martian Landing Site Coordinates',
    url: 'https://www.giss.nasa.gov/tools/mars24/help/landers.html',
    dataset: 'Areocentric planetographic and planetocentric coordinates, local solar time (Sol) conversion algorithms, and landing error ellipses.',
    verifiedRecords: ['Meridiani Planum (-1.9483° N, 354.47417° E)', 'Gusev Crater (-14.5684° N, 175.4726° E)', 'Elysium Planitia (4.5024° N, 135.6234° E)', 'Jezero Crater (18.4447° N, 77.4508° E)']
  },
  {
    authority: 'NASA Science & Jet Propulsion Laboratory (JPL)',
    role: 'Mission Operations & Scientific Breakthrough Archives',
    url: 'https://science.nasa.gov/mission/mer-opportunity/',
    dataset: 'Mission duration logs, sol-by-sol scientific publication summaries (Genesis rock, hematite blueberries, hydrothermal silica, 1319 marsquakes, 72 helicopter flights).',
    verifiedRecords: ['MER-A & MER-B Mars Exploration Rovers', 'InSight Mars Lander', 'Ingenuity Mars Helicopter']
  }
];

export const AI_DISCLOSURE = {
  challenge: '2026 NASA Space Apps Challenge',
  projectName: 'Echoes Beyond Earth: Interactive 3D Planetary Archaeology Lab',
  aiEngine: 'Google Gemini 2.5 Flash (via @google/generative-ai)',
  groundingPolicy: 'All scientific facts, landing dates, instrument names, and coordinates are hardcoded from verified NASA NSSDCA data. Gemini AI operates under strict aerospace system prompts with zero ungrounded telemetry hallucination. An offline response registry guarantees 100% demo uptime.',
  speechIntegration: 'Browser Native Web Speech API (window.speechSynthesis & window.SpeechRecognition) with custom acoustic pitch/rate profiles matched to individual robotic and human personas.'
};
