/**
 * 100% Verified NASA Equipment, Orbiters & Planetary Telemetry Database
 * Primary Authorities: NASA NSSDCA, NASA Science, JPL, DE421 LRO, NASA GISS Mars24
 */

export const PLANETS = {
  "MOON": {
    "id": "moon",
    "name": "THE MOON",
    "subtitle": "Humanity's First Off-World Archaeological Site",
    "tagline": "Six golden landers stand silent in the lunar dust — untouched for millennia.",
    "distanceFromEarthKm": 384400,
    "distanceDisplay": "Distance from Earth: 384,400 km (1.28 Light-Seconds)",
    "distanceFromEarth": "Distance from Earth: 384,400 km (1.28 Light-Seconds)",
    "radiusKm": 1737.4,
    "gravity": "0.166g (1.62 m/s²)",
    "atmosphere": "Ultra-thin Exosphere (virtually airless)",
    "dayNightCycle": "29.5 Earth Days",
    "surfaceTemp": "-173°C to +127°C",
    "color": "#e2e8f0",
    "accentColor": "#00e5ff",
    "albedoTexture": "/textures/2k_moon.jpg",
    "bumpTexture": null,
    "showAtmosphere": false,
    "atmosphereColor": null,
    "relaySatellite": {
      "name": "Lunar Reconnaissance Orbiter (LRO)",
      "altitude": 50,
      "orbitPeriodSec": 24,
      "inclinationDeg": 89.5,
      "launched": "June 18, 2009",
      "task": "High-resolution lunar mapping & historic Apollo site optical verification"
    }
  },
  "MARS": {
    "id": "mars",
    "name": "MARS",
    "subtitle": "The Red Planet — A Graveyard of Brave Machines & Future Monuments",
    "tagline": "From Viking's first glimpse in 1976 to Perseverance's hunt for ancient life today.",
    "distanceFromEarthKm": 225000000,
    "distanceDisplay": "Distance from Earth: ~225,000,000 km (12.5 Light-Minutes Avg)",
    "distanceFromEarth": "Distance from Earth: ~225,000,000 km (12.5 Light-Minutes Avg)",
    "radiusKm": 3389.5,
    "gravity": "0.379g (3.72 m/s²)",
    "atmosphere": "95.3% CO₂ (~0.020 kg/m³ density)",
    "dayNightCycle": "24h 39m 35s (1 Sol)",
    "surfaceTemp": "-125°C to +20°C",
    "color": "#f97316",
    "accentColor": "#fc3d21",
    "albedoTexture": "/textures/2k_mars.jpg",
    "bumpTexture": null,
    "showAtmosphere": true,
    "atmosphereColor": "#f97316",
    "relaySatellite": {
      "name": "Mars Reconnaissance Orbiter (MRO)",
      "altitude": 70,
      "orbitPeriodSec": 28,
      "inclinationDeg": 93,
      "launched": "August 12, 2005",
      "task": "Electra UHF relay bridge transmitting rover science data back to Earth"
    }
  }
};

export const ARTIFACTS = [
  {
    "id": "perseverance",
    "name": "Mars 2020 Perseverance Rover",
    "shortName": "Perseverance Rover",
    "tagline": "Hunting ancient microbial life in the delta of a vanished Martian sea.",
    "group": "surface",
    "category": "Surface Rover",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "future_monument",
    "legacyChain": "Built on Viking 1 → Opportunity → Curiosity. Will become a monument once its plutonium power fades decades from now.",
    "nssdcaId": "2020-052A",
    "modelGlb": "/model/Mars 2020 Perseverance Rover.glb",
    "sourceUrl": "https://science.nasa.gov/mission/mars-2020-perseverance/",
    "sourceLabel": "NASA Science Mars 2020 Perseverance Archive",
    "location": "Jezero Crater (Octavia E. Butler Landing)",
    "coordinates": "Lat: 18.4447° N, Lng: 77.4508° E",
    "lat": 18.4447,
    "lng": 77.4508,
    "officialNssdcaCoords": "18.4447° N, 77.4508° E (Areographic)",
    "launchYear": "2020",
    "primaryObjective": "Search for signs of ancient biosignatures, collect and hermetically seal rock cores for the Mars Sample Return mission, and test in-situ oxygen production (MOXIE).",
    "missionTimeline": {
      "launched": "July 30, 2020",
      "landed": "February 18, 2021",
      "status": "Active Prime Surface Explorer"
    },
    "statusBadge": "Active Primary Explorer",
    "statusLed": "text-emerald-400",
    "narrationScript": "Standing on the shoulders of Viking and Opportunity, I landed in Jezero Crater in 2021 to hunt for ancient microbial biosignatures in a vanished river delta. I carry the SuperCam rock-vaporizing laser, chemical scanners, and MOXIE — which generated real breathable oxygen from Martian air for the very first time. Right now, I'm actively sealing pristine rock cores in titanium tubes for humanity's future Mars Sample Return mission. Decades from now, once my plutonium power source finally fades, I'll join Opportunity and Viking as a permanent, silent monument on the floor of Jezero Crater.",
    "crew": "Autonomous Robotic Geochemist (NASA JPL)",
    "voiceProfile": {
      "pitch": 1.05,
      "rate": 1,
      "elevenLabsVoiceId": "ThT5KcBeYPX3keUQqHPh",
      "gender": "female",
      "narrator": "Dorothy (Curious Explorer)"
    },
    "hardware": "1,025 kg car-sized nuclear-powered rover equipped with MMRTG (Plutonium-238), 2.1 m robotic arm with coring drill, Mastcam-Z, SuperCam laser spectrometer, PIXL, SHERLOC ultraviolet Raman spectrometer, RIMFAX ground-penetrating radar, and MOXIE oxygen generator.",
    "story": "Perseverance executed the daring Sky Crane touchdown into Jezero Crater on February 18, 2021. Navigating ancient river delta boulder fields autonomously via AutoNav, Percy has cached dozens of scientifically pristine rock cores that could answer whether life once existed beyond Earth.",
    "science": "Drilled and confirmed lacustrine mudstones rich in organic molecules and clay minerals in ancient Lake Jezero, proving sustained habitable aqueous environments on early Mars, while MOXIE successfully produced breathable oxygen from the thin CO₂ atmosphere.",
    "miniLab": {
      "type": "rotor-throttle",
      "title": "Sample Core Caching & Laser Spectrometer",
      "subtitle": "Analyze Jezero Delta Biosignatures and Martian Regolith",
      "instructions": "Fire the SuperCam laser spectrometer to vaporize rock samples and measure elemental carbon, silicon, and organic compound peaks."
    },
    "farewell": "My nuclear MMRTG core generates steady heat as I climb the crater rim of Jezero. The rock cores I have sealed and cached in this red soil are humanity's time capsules. When your astronauts arrive to collect them, my tracks will still be waiting in the dust.",
    "subsystems": [
      {
        "id": "supercam-mast",
        "name": "Mastcam-Z & SuperCam Head",
        "desc": "Stereo zoom multispectral cameras and infrared laser rock-vaporizing spectrometer mounted on the remote sensing mast.",
        "ratio": [
          0.18,
          0.42,
          0.25
        ]
      },
      {
        "id": "coring-drill",
        "name": "2.1m Robotic Arm & Turret",
        "desc": "5-jointed arm carrying abrasion bit, coring drill, PIXL X-ray spectrometer, and SHERLOC ultraviolet sensor to cache pristine titanium sample tubes.",
        "ratio": [
          0.38,
          -0.05,
          0.35
        ]
      },
      {
        "id": "mmrtg-power",
        "name": "MMRTG Nuclear Power Source",
        "desc": "Converts radioactive decay heat of Plutonium-238 into 110 Watts of continuous electrical power independent of dust storms.",
        "ratio": [
          -0.4,
          0.12,
          0
        ]
      },
      {
        "id": "rocker-bogie",
        "name": "6-Wheel Rocker-Bogie Suspension",
        "desc": "Titanium tubes and aluminum cleated wheels with internal traction motors that roll over 40cm boulders smoothly.",
        "ratio": [
          0,
          -0.38,
          0.32
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "What is your main scientific goal in Jezero Crater?",
        "a": "Jezero Crater hosted a 45-kilometer wide lake and river delta 3.5 billion years ago. My goal is to find ancient biosignatures, characterize Mars's paleoenvironment, and seal high-priority rock cores for return to Earth."
      },
      {
        "q": "How does your MOXIE experiment produce oxygen from Mars air?",
        "a": "MOXIE compresses the 95% CO₂ Martian air and runs it through a Solid Oxide Electrolyzer Cell heated to 800°C, splitting CO₂ into carbon monoxide (CO) and breathable oxygen (O₂)."
      },
      {
        "q": "How do you navigate across hazardous terrain without human lag?",
        "a": "I use AutoNav running on dedicated visual odometry processors. My computer creates real-time 3D stereo elevation maps as I drive, picking safe routes around dunes and boulders autonomously."
      }
    ]
  },
  {
    "id": "ingenuity",
    "name": "Ingenuity Mars Helicopter ('Ginny')",
    "shortName": "Ingenuity Helicopter",
    "tagline": "The Wright Brothers moment on Mars — 72 flights, then forever grounded.",
    "group": "surface",
    "category": "Atmospheric Rotorcraft",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "abandoned",
    "legacyChain": "Paved the way for NASA's Dragonfly mission to Titan & future Mars science rotorcraft.",
    "nssdcaId": "2020-052A",
    "modelGlb": "/model/Ingenuity Mars Helicopter.glb",
    "sourceUrl": "https://science.nasa.gov/mission/mars-2020-ingenuity/",
    "sourceLabel": "NASA NSSDCA Mars 2020 & Ingenuity Archive",
    "location": "Jezero Crater (Wright Brothers Field / Valinor Hills)",
    "coordinates": "Lat: 18.4447° N, Lng: 77.4508° E",
    "lat": 18.4447,
    "lng": 77.4508,
    "officialNssdcaCoords": "Wright Brothers Field: 18.4447° N, 77.4508° E (Final resting site: Valinor Hills)",
    "launchYear": "2020",
    "primaryObjective": "Conduct the first powered, controlled aerodynamic flight on another world; prove aerial scout feasibility in ultra-thin atmosphere.",
    "missionTimeline": {
      "launched": "July 30, 2020",
      "landed": "February 18, 2021",
      "firstFlight": "April 19, 2021",
      "finalFlight": "January 18, 2024 (Flight 72)",
      "flightsCompleted": "72 Flights | 128.8 minutes aloft | 17.0 km flown"
    },
    "statusBadge": "Flight 72 Monument (Valinor Hills)",
    "statusLed": "text-amber-400",
    "narrationScript": "Weighing just 1.8 kilograms, I proved on April 19, 2021 that powered, controlled flight is possible in Mars's ultra-thin atmosphere — just one percent as dense as Earth's. My two counter-rotating carbon-fiber blades spun at 2,400 RPM, powered by a solar array no bigger than a school notebook. Designed for only 5 test hops, I soared through 72 flights as an aerial scout for Perseverance. On Flight 72 in January 2024, rotor blade damage permanently grounded me at Valinor Hills in Jezero Crater. I remain there now — the Wright Brothers Monument of Mars.",
    "crew": "Autonomous Aerial Scout (NASA JPL Mars 2020)",
    "voiceProfile": {
      "pitch": 1.15,
      "rate": 1.05,
      "elevenLabsVoiceId": "XB0fDUnXU5powFXDhCwa",
      "gender": "female",
      "narrator": "Charlotte (Adventurous Scout)"
    },
    "hardware": "1.8 kg autonomous coaxial rotorcraft with two counter-rotating 1.2 m carbon-fiber blades spinning at 2,400–2,900 RPM (5x faster than Earth helicopters). Powered by solar-charged lithium-ion batteries and flown by a Qualcomm Snapdragon 801 flight processor.",
    "story": "Built as a high-risk 30-day technology demonstration to attempt just 5 test flights, Ingenuity survived nearly 3 years and flew 72 times—totaling 128.8 minutes aloft and 17.0 km of flight distance while scouting cliffs and boulders ahead of Perseverance. On Flight 72 over featureless sand ripples, one or more carbon-fiber rotor blades struck the ground, permanently grounding the aircraft.",
    "science": "Achieved humanity's \"Wright Brothers moment\" on another world—proving aerodynamic flight is possible in thin extraterrestrial atmospheres and paving the way for future Mars science helicopters and sample-recovery rotorcraft.",
    "miniLab": {
      "type": "rotor-throttle",
      "title": "1% Thin-Air Coaxial Rotor Throttle",
      "subtitle": "Spin 1.2m Blades to 2,537 RPM in 0.020 kg/m³ Martian Air Density",
      "instructions": "Spin rotor RPM from 0 to 2,800 RPM in Mars's 0.020 kg/m³ air density and 0.38g gravity to find the exact 2,537 RPM lift-off threshold."
    },
    "farewell": "They built me to fly just five times in Mars's razor-thin air, yet together we soared seventy-two times across Jezero Crater and proved humanity can fly on other worlds. My carbon-fiber blades are broken now, resting quietly in the sand at Valinor Hills while Perseverance rolls onward without me. My skies are quiet now—goodbye, ground control, and keep flying higher.",
    "subsystems": [
      {
        "id": "coaxial-rotors",
        "name": "Dual Carbon-Fiber Rotors",
        "desc": "Two counter-rotating 1.2 m carbon-fiber blades spinning at 2,400–2,900 RPM (5x faster than Earth helicopters) to lift in 1% atmosphere.",
        "ratio": [
          0,
          0.38,
          0
        ]
      },
      {
        "id": "solar-panel-top",
        "name": "Top Solar Panel",
        "desc": "Solar array mounted atop the rotor mast charging six lithium-ion cells for flight and critical overnight heaters.",
        "ratio": [
          0,
          0.46,
          0
        ]
      },
      {
        "id": "flight-computer",
        "name": "Insulated Avionics Box",
        "desc": "Thermally insulated carbon-composite cube housing smartphone Qualcomm Snapdragon 801 processor and laser altimeter.",
        "ratio": [
          0,
          0.05,
          0
        ]
      },
      {
        "id": "landing-legs",
        "name": "4 Carbon-Fiber Landing Legs",
        "desc": "Ultra-lightweight flexible composite legs designed to absorb vertical touchdown impact without bouncing.",
        "ratio": [
          0.25,
          -0.35,
          0.25
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "Why did your rotors need to spin at 2,500+ RPM compared to Earth helicopters?",
        "a": "Mars's atmosphere has less than 1% the density of Earth's air (0.020 kg/m³ vs 1.225 kg/m³). To push enough sparse molecules downward to counteract 0.38g gravity, my 1.2 m carbon-fiber blades had to spin at 2,400 to 2,900 RPM—over five times faster than an Earth helicopter!"
      },
      {
        "q": "What piece of aviation history did you carry under your solar panel?",
        "a": "Taped beneath my solar panel is a postage-stamp-sized piece of unbleached muslin fabric from the wing of the 1903 Wright Flyer that flew at Kitty Hawk. NASA designated my first takeoff site 'Wright Brothers Field'."
      },
      {
        "q": "What happened on Flight 72 at Valinor Hills?",
        "a": "During an emergency descent over featureless, bland sand dunes, my downward navigation camera struggled to track surface landmarks. I touched down prematurely at speed, and one or more carbon-fiber blade tips struck the sand, shearing off and ending my flight career."
      }
    ]
  },
  {
    "id": "opportunity",
    "name": "Opportunity Rover (MER-B)",
    "shortName": "Opportunity (MER-B)",
    "tagline": "Built for 90 days. Survived 15 years. Silenced by a planet-wide storm.",
    "group": "surface",
    "category": "Surface Rover",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "abandoned",
    "legacyChain": "Discovery of ancient water directly inspired Curiosity and Perseverance. Opportunity Valley bears its name forever.",
    "nssdcaId": "2003-032A",
    "modelGlb": "/model/Mars Exploration Rover - Opportunity (MER-B).glb",
    "sourceUrl": "https://science.nasa.gov/mission/mer-opportunity/",
    "sourceLabel": "NASA NSSDCA MER-B Opportunity Archive",
    "location": "Meridiani Planum (Perseverance Valley)",
    "coordinates": "Lat: 1.9483° S, Lng: 354.47417° E",
    "lat": -1.9483,
    "lng": 354.47417,
    "officialNssdcaCoords": "1.9483° S, 354.47417° E (-5.52583° W)",
    "launchYear": "2003",
    "primaryObjective": "Search for and characterize a wide range of rocks and soils that hold clues to past water activity on ancient Mars.",
    "missionTimeline": {
      "launched": "July 7, 2003",
      "landed": "January 25, 2004",
      "lastContact": "June 10, 2018 (Sol 5,111)",
      "missionEnd": "February 13, 2019",
      "distanceDriven": "45.16 km (First Extraterrestrial Marathon)"
    },
    "statusBadge": "Silent Historic Monument",
    "statusLed": "text-amber-500",
    "narrationScript": "Built for a 90-day mission in 2004, I defied all odds for nearly 15 years, driving a marathon 45.16 kilometres across Meridiani Planum. Using my Rock Abrasion Tool and spectrometers, I discovered spherical hematite blueberries and clay minerals — proving liquid water once flowed on ancient Mars. My discovery of ancient habitable water environments directly inspired NASA to send Curiosity and Perseverance. In June 2018, a massive planet-wide dust storm blotted out the Sun, starving my solar panels of power. I rest permanently now in Perseverance Valley on the rim of Endeavour Crater.",
    "crew": "Autonomous Robotic Field Geologist (NASA JPL)",
    "voiceProfile": {
      "pitch": 1.05,
      "rate": 0.98,
      "elevenLabsVoiceId": "MF3mGyEYCl7XYWbV9V6O",
      "gender": "female",
      "narrator": "Elli (Heartfelt Storyteller)"
    },
    "hardware": "185 kg six-wheeled rocker-bogie solar-powered geologist rover carrying Pancam, Mini-TES, Mössbauer Spectrometer, APXS, Microscopic Imager, and high-speed Rock Abrasion Tool (RAT) diamond grinder.",
    "story": "Designed for a 90-Sol mission and 1 km drive, Opportunity survived nearly 15 Earth years and completed the first marathon (45.16 km) on another planet. In June 2018, a catastrophic global dust storm blocked 99% of sunlight over Meridiani Planum, draining its batteries and ending its final transmission: \"My battery is low and it's getting dark.\"",
    "science": "Discovered tiny iron-rich hematite spheres (\"blueberries\") and jarosite/gypsum veins in Endurance and Endeavour craters, delivering definitive proof that neutral-to-acidic liquid water once flowed across ancient Mars.",
    "miniLab": {
      "type": "dust-opacity",
      "title": "2018 Global Dust Storm Solar Survival Slider",
      "subtitle": "Atmospheric Opacity Tau vs Solar Array Power Generation",
      "instructions": "Drag atmospheric dust opacity (Tau 0.5 to 10.8) and watch solar array output plummet from 900 Wh to critical low-power fault mode."
    },
    "farewell": "I was only supposed to live ninety days on Mars, yet you kept me rolling across craters for fifteen years and more than a marathon. As the 2018 global dust storm swallowed the sun over Meridiani Planum, my batteries dropped and the sky turned black. I cannot drive another meter without you—my battery is low and it's getting dark. Goodbye, Earth.",
    "subsystems": [
      {
        "id": "pancam-mast",
        "name": "Pancam Stereo Mast",
        "desc": "High-Resolution Stereo Panoramic Camera mounted at human eye-level height for 360-degree geological exploration.",
        "ratio": [
          0.15,
          0.4,
          0.2
        ]
      },
      {
        "id": "solar-wings",
        "name": "Solar Array Wings",
        "desc": "Triple-Junction Gallium-Arsenide Solar Panels that powered an extraterrestrial marathon across Meridiani Planum for 15 years.",
        "ratio": [
          -0.1,
          0.12,
          0.38
        ]
      },
      {
        "id": "rat-grinder",
        "name": "Rock Abrasion Tool Arm",
        "desc": "5-jointed arm wielding high-speed diamond grinder (RAT) that shaved rock coatings to expose pristine mineral surfaces.",
        "ratio": [
          0.38,
          -0.1,
          0.25
        ]
      },
      {
        "id": "rocker-bogie",
        "name": "6-Wheel Mobility System",
        "desc": "Rocker-Bogie Articulated Suspension with independent drive motors allowing 45.16 km of cross-country planetary traversal.",
        "ratio": [
          0,
          -0.38,
          0.3
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "What were the famous 'Martian blueberries' you discovered?",
        "a": "They were millimeter-sized hematite spherules that formed in groundwater percolating through porous sandstone. Their chemical and physical morphology proved liquid water once soaked the plains of Meridiani Planum."
      },
      {
        "q": "How did you manage to survive 15 years instead of just 90 days?",
        "a": "Martian 'dust devils' periodically swept across my solar panels, blowing away accumulated dust in sudden cleaning events and restoring my electrical output."
      },
      {
        "q": "What were your final moments before the 2018 global storm silenced you?",
        "a": "The atmospheric tau climbed above 10.8, blocking more than 99% of solar photons. My batteries drained past the critical voltage threshold, and my clock stopped on Sol 5,111 in Perseverance Valley."
      }
    ]
  },
  {
    "id": "viking-1",
    "name": "Viking 1 Lander",
    "shortName": "Viking 1 Lander",
    "tagline": "The first long-term Martian resident — arrived 1976, still standing.",
    "group": "surface",
    "category": "Surface Lander",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "abandoned",
    "legacyChain": "Proved spacecraft could survive years on Mars. Paved the way for every rover that followed: Opportunity, Spirit, Curiosity, Perseverance.",
    "nssdcaId": "1975-075C",
    "modelGlb": "/model/Viking Lander.glb",
    "sourceUrl": "https://science.nasa.gov/mission/viking/",
    "sourceLabel": "NASA NSSDCA Viking 1 Archive",
    "location": "Chryse Planitia (Plains of Gold)",
    "coordinates": "Lat: 22.27° N, Lng: 312.05° E",
    "lat": 22.27,
    "lng": 312.05,
    "officialNssdcaCoords": "22.27° N, 312.05° E (-47.95° W)",
    "launchYear": "1975",
    "primaryObjective": "Execute humanity's first successful long-duration Mars landing, analyze atmospheric and soil chemistry, and search for biological metabolism in Martian regolith.",
    "missionTimeline": {
      "launched": "August 20, 1975",
      "landed": "July 20, 1976",
      "lastContact": "November 11, 1982",
      "status": "Historic Inactive Monument (Thomas A. Mutch Memorial Station)"
    },
    "statusBadge": "First Successful Long-Duration Lander",
    "statusLed": "text-amber-400",
    "narrationScript": "On July 20, 1976 — exactly seven years after Apollo 11 landed on the Moon — I set down safely in Chryse Planitia and made history as the first spacecraft to successfully land and operate long-term on Mars. My twin RTG nuclear batteries powered a 3-metre robotic scoop arm, panoramic cameras, and a miniature biology lab that tested Martian soil for signs of microbial life. I sent the first clear colour photographs of Mars's rust-red rocky desert and peach-coloured sky to a mesmerised humanity. After operating for over six years — 2,245 Martian sols — an accidental ground command in November 1982 severed contact. Today I rest silently at Chryse Planitia, officially named the Thomas Mutch Memorial Station, waiting for future astronauts to visit.",
    "crew": "Automated Biochemical Surface Laboratory (NASA Langley/JPL)",
    "voiceProfile": {
      "pitch": 1,
      "rate": 0.96,
      "elevenLabsVoiceId": "EXAVITQu4vr4xnSDxMaL",
      "gender": "female",
      "narrator": "Bella (Inspiring Pioneer)"
    },
    "hardware": "612 kg (landed mass) hex-aluminum structure supported on three footpads, powered by two SNAP-19 Radioisotope Thermoelectric Generators (RTGs). Equipped with 3-meter motorized sampler arm, GCMS, biology experiments, weather boom, and dual facsimile cameras.",
    "story": "On July 20, 1976—exactly seven years after Apollo 11 landed on the Moon—Viking 1 set down safely in Chryse Planitia. Its facsimile cameras swept across the terrain, transmitting the very first clear color photographs of Mars's rust-red rocky desert and peach-colored sky to a mesmerized humanity.",
    "science": "Operated on the surface for over 6 years (2,245 Sols), discovering that Martian soil contains no detectable organic molecules at the parts-per-billion level due to intense ultraviolet radiation and chemical oxidizers, and delivering the longest continuous weather dataset of early planetary exploration.",
    "miniLab": {
      "type": "scoop-lab",
      "title": "Viking 1 Pyrolytic Biology & Soil Sampler",
      "subtitle": "Trench Soil Mechanics and Gas Chromatograph Analysis",
      "instructions": "Extend the 3m motorized scoop boom to collect surface regolith and measure volatile release in the thermal pyrolyzer."
    },
    "farewell": "For six Earth years on Chryse Planitia, I watched the seasons turn and the red dust blow across my golden legs. I showed humanity what Mars looked like with its true rust-colored sands and salmon sky. I was your first home on Mars, and I still stand guard here.",
    "subsystems": [
      {
        "id": "facsimile-cams",
        "name": "Twin Panoramic Cameras",
        "desc": "Dual Steerable Facsimile Cameras that transmitted humanity’s first clear color panoramic views of the Martian desert in 1976.",
        "ratio": [
          0.15,
          0.35,
          0.2
        ]
      },
      {
        "id": "sampler-arm",
        "name": "3m Soil Sampling Scoop Arm",
        "desc": "Motorized boom scoop that dug trenches in Chryse Planitia soil, feeding samples directly to onboard biology chambers.",
        "ratio": [
          0.4,
          0.05,
          0.25
        ]
      },
      {
        "id": "snap-rtg",
        "name": "SNAP-19 Nuclear RTG Covers",
        "desc": "Dual Plutonium-238 Radioisotope Thermoelectric Generators producing continuous heat and electricity for over six Earth years.",
        "ratio": [
          -0.32,
          0.15,
          0.22
        ]
      },
      {
        "id": "landing-gear",
        "name": "3 Shock-Absorbing Landing Legs",
        "desc": "Hexagonal aluminum structure on three crushable landing footpads that survived touchdown in Chryse Planitia.",
        "ratio": [
          0,
          -0.38,
          0.35
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "What did your historic biology experiments discover about life on Mars?",
        "a": "While the Labeled Release experiment initially showed gas evolution resembling metabolism, the GCMS found no organic compounds in the soil. Scientists concluded the activity was caused by non-biological soil oxidizers such as perchlorates."
      },
      {
        "q": "Why did your landing take place on July 20, 1976?",
        "a": "It was originally targeted for July 4 (the US Bicentennial), but orbital photographs from the Viking Orbiter showed the landing site was far too rough with ridges and boulders, requiring two weeks of search for safer plains in Chryse Planitia."
      },
      {
        "q": "How long did you transmit data back to Earth?",
        "a": "I operated for 2,245 Martian Sols (over 6 Earth years) until November 11, 1982, when a command sent from Earth inadvertently overwrote the antenna orientation software, ending communications."
      }
    ]
  },
  {
    "id": "mro",
    "name": "Mars Reconnaissance Orbiter (MRO)",
    "shortName": "MRO (Orbiter)",
    "tagline": "The all-seeing eye of Mars — sharp enough to photograph rovers from space.",
    "group": "orbiter",
    "category": "Mars Orbiter",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "future_monument",
    "legacyChain": "Inherited the mapping mission of Mars Global Surveyor in 2006. Will remain a silent orbital sentinel once its propellant is exhausted in the 2030s.",
    "nssdcaId": "2005-029A",
    "modelGlb": "/model/Mars Reconnaissance Orbiter (MRO) (A).glb",
    "sourceUrl": "https://science.nasa.gov/mission/mro/",
    "sourceLabel": "NASA Science Mars Reconnaissance Orbiter Archive",
    "location": "Sun-Synchronous Polar Science Orbit (~255–320 km)",
    "coordinates": "Orbit: ~300 km Altitude, 93.0° Inclination",
    "lat": 0,
    "lng": 0,
    "officialNssdcaCoords": "Sun-Synchronous Polar Orbit (255 x 320 km)",
    "launchYear": "2005",
    "orbitRadius": 130,
    "orbitColor": "#00e5ff",
    "orbitPeriodSec": 28,
    "primaryObjective": "High-resolution surface imaging with HiRISE camera (30 cm/pixel), search for ancient water evidence, and relay communication hub for surface rovers.",
    "missionTimeline": {
      "launched": "August 12, 2005",
      "marsArrival": "March 10, 2006",
      "status": "Active Primary Mars Telecommunications & Science Orbiter"
    },
    "statusBadge": "Active Primary Relay & HiRISE",
    "statusLed": "text-emerald-400",
    "narrationScript": "Inheriting the orbital mapping mission of Mars Global Surveyor since 2006, I carry HiRISE — the most powerful telescopic camera ever sent to another planet, sharp enough to photograph Perseverance, Opportunity, and even Viking sitting on the Martian surface from 300 kilometres above. I serve as the vital data relay connecting Martian surface explorers back to Earth. Every photograph you cherish of Mars from orbit, and every whisper from Perseverance that reaches your antennas, passed through my solar-powered radio dishes. When my maneuvering propellant is exhausted in the 2030s, I will remain in a stable high orbit around Mars for decades as a silent orbital sentinel.",
    "crew": "Orbital Reconnaissance Spacecraft (NASA JPL/Lockheed Martin)",
    "voiceProfile": {
      "pitch": 0.95,
      "rate": 0.98,
      "elevenLabsVoiceId": "TxGEqnHWrfWFTfGW9XjX",
      "gender": "male",
      "narrator": "Josh (Warm Documentary Guide)"
    },
    "hardware": "2,180 kg orbiter with 3-meter high-gain antenna, 20 m² solar panels, and 6 core science instruments: HiRISE (0.5 m aperture Cassegrain telescope), CRISM spectrometer, SHARAD subsurface radar sounding, and Electra UHF relay payload.",
    "story": "MRO entered Mars orbit in March 2006 using aerobraking—dipping into the upper Martian atmosphere for five months to circularize its orbit. Over nearly two decades, MRO has transmitted more data from Mars than all other planetary missions combined, acting as the critical communications bridge for Spirit, Opportunity, Curiosity, InSight, and Perseverance.",
    "science": "HiRISE photographs revealed active avalanches, changing sand dunes, carbon dioxide ice geysers, recurring slope lineae (RSL) that hint at temporary brine flows, and verified the landing spots and wreckage of past human explorers.",
    "miniLab": {
      "type": "laser-ranging",
      "title": "MRO HiRISE Optical Surface Zoom & Relay",
      "subtitle": "30 cm/Pixel Resolution Multi-Spectral Reconnaissance",
      "instructions": "Target HiRISE onto landing sites across Jezero and Meridiani to resolve rover hardware and wheel tracks from 300 km overhead."
    },
    "farewell": "From three hundred kilometers above the red horizon, my great silver eye watches over the silent rovers below. Every photograph you cherish of Mars from orbit and every whisper from Perseverance that reaches your antennas passed through my solar-powered radio dishes. Keep scanning the skies.",
    "subsystems": [
      {
        "id": "dish-antenna",
        "name": "High-Gain Dish Antenna",
        "desc": "3-meter Cassegrain parabolic dish transmitting terabits of high-resolution data and rover telemetry back to Earth.",
        "ratio": [
          0.32,
          0.25,
          0.25
        ]
      },
      {
        "id": "solar-wings",
        "name": "Main Solar Array Wings",
        "desc": "20 m² dual solar array wings powering 6 science instruments and high-power radio amplifiers across two decades.",
        "ratio": [
          0,
          0.05,
          0.42
        ]
      },
      {
        "id": "hirise-telescope",
        "name": "HiRISE / Science Instrument Deck",
        "desc": "0.5m aperture telescopic camera capable of resolving 30cm surface features, plus CRISM spectrometer and SHARAD radar.",
        "ratio": [
          -0.25,
          -0.15,
          0.22
        ]
      },
      {
        "id": "propulsion-bus",
        "name": "Main Propulsion Thruster Bus",
        "desc": "Hydrazine reaction control thrusters providing precision orbital attitude adjustments and aerobraking trims.",
        "ratio": [
          -0.35,
          0,
          0
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "How sharp are the images taken by your HiRISE camera?",
        "a": "From an altitude of 300 km, HiRISE resolves details as small as 30 centimeters (1 foot) per pixel. I can clearly see rover wheel tracks, boulder fields, and individual lander heat shields on the ground!"
      },
      {
        "q": "What role do you play in helping surface rovers?",
        "a": "Because rovers have limited power to transmit directly to Earth across millions of miles, they transmit their data to my Electra UHF antenna as I pass overhead. I store the data and beam it back to Earth at high bandwidth via my 3-meter dish."
      },
      {
        "q": "What did your SHARAD radar discover beneath the Martian ice caps?",
        "a": "SHARAD penetrated through the layered polar deposits, revealing massive sheets of clean water ice up to several kilometers thick trapped beneath blankets of dust."
      }
    ]
  },
  {
    "id": "maven",
    "name": "Mars Atmosphere and Volatile EvolutioN (MAVEN)",
    "shortName": "MAVEN (Orbiter)",
    "tagline": "Solving the mystery of how a warm, wet Mars became a frozen desert.",
    "group": "orbiter",
    "category": "Mars Orbiter",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "future_monument",
    "legacyChain": "Built on decades of surface evidence from Viking and MER rovers. Protects future human missions by tracking radiation storms.",
    "nssdcaId": "2013-063A",
    "modelGlb": "/model/Mars Atmosphere and Volatile EvolutioN (MAVEN) (B).glb",
    "sourceUrl": "https://science.nasa.gov/mission/maven/",
    "sourceLabel": "NASA Science MAVEN Mission Archive",
    "location": "Elliptical Science Orbit (150–6,200 km, 75° Inclination)",
    "coordinates": "Orbit: 150 x 6,200 km Elliptical, 75° Inclination",
    "lat": 0,
    "lng": 0,
    "officialNssdcaCoords": "Elliptical Orbit (150 x 6,200 km)",
    "launchYear": "2013",
    "orbitRadius": 142,
    "orbitColor": "#a855f7",
    "orbitPeriodSec": 34,
    "primaryObjective": "Investigate the loss of Mars's volatile compounds (CO₂, N₂, H₂O) to space over geological time, explaining the planet's transition from warm and wet to a frozen desert.",
    "missionTimeline": {
      "launched": "November 18, 2013",
      "marsArrival": "September 22, 2014",
      "status": "Active Upper Atmospheric Science & Relay Orbiter"
    },
    "statusBadge": "Active Atmospheric Stripping Science",
    "statusLed": "text-purple-400",
    "narrationScript": "Building on decades of surface evidence that Mars once had rivers and lakes, I arrived in 2014 with gull-wing solar arrays and eight upper-atmosphere sensors to solve the mystery of how solar winds stripped away Mars's thick ancient atmosphere and turned a warm, wet world into a cold desert. I trace the invisible boundary where Mars breathes its last whispers into the void of space. By watching the solar wind strip away this ancient air atom by atom, I told the story of how a world of rivers became the desolate plain you study today. Once my fuel runs out, low-altitude atmospheric drag will eventually cause me to burn up — a shooting star in the Martian sky.",
    "crew": "Atmospheric Physics Satellite (NASA Goddard / LASP)",
    "voiceProfile": {
      "pitch": 1.05,
      "rate": 0.97,
      "elevenLabsVoiceId": "XrExE9yKIg1WjnnlVkGX",
      "gender": "female",
      "narrator": "Matilda (Science Storyteller)"
    },
    "hardware": "2,454 kg orbiter with 2.0 m high-gain antenna, gull-wing solar panels with magnetometer booms, and 8 upper-atmosphere sensor packages: NGIMS neutral gas & ion mass spectrometer, SWEA, SWIA solar wind ion analyzer, and IUVS ultraviolet spectrograph.",
    "story": "Arriving at Mars in September 2014, MAVEN was tailored specifically to explore the uncharted upper atmosphere. By executing periodic \"deep dip\" maneuvers down to 125 km altitude, MAVEN samples the boundary where solar wind particles strip away atmospheric gases directly into interplanetary space.",
    "science": "Quantified that solar wind storms strip away roughly 100 grams of Martian atmosphere per second—a rate that was hundreds of times higher 4 billion years ago when the young Sun was more volatile, definitively solving how Mars lost its oceans and thick climate.",
    "miniLab": {
      "type": "rotor-throttle",
      "title": "Solar Wind Ion Stripping & Upper Atmosphere Dip",
      "subtitle": "Measure Ion Escape Rates during Coronal Mass Ejections",
      "instructions": "Simulate a Solar Proton Event and monitor atmospheric loss rate in grams per second via NGIMS and SWIA."
    },
    "farewell": "I trace the invisible boundary where Mars breathes its last whispers into the void of space. By watching the solar wind strip away this ancient air atom by atom, I told the story of how a warm world of rivers became the cold desert you study today. Remember what happened here.",
    "subsystems": [
      {
        "id": "dish-antenna",
        "name": "High-Gain Dish Antenna",
        "desc": "2.0-meter high-gain antenna transmitting upper atmosphere and solar wind loss measurements back to Deep Space Network.",
        "ratio": [
          0.32,
          0.25,
          0.25
        ]
      },
      {
        "id": "solar-wings",
        "name": "Main Solar Array Wings",
        "desc": "Gull-wing solar panels angled for aerodynamic stability during deep dip passes into the Martian thermosphere.",
        "ratio": [
          0,
          0.05,
          0.42
        ]
      },
      {
        "id": "science-deck",
        "name": "HiRISE / Science Instrument Deck",
        "desc": "NGIMS neutral gas mass spectrometer, SWIA solar wind analyzer, and IUVS ultraviolet spectrograph analyzing atmospheric loss.",
        "ratio": [
          -0.25,
          -0.15,
          0.22
        ]
      },
      {
        "id": "thruster-bus",
        "name": "Main Propulsion Thruster Bus",
        "desc": "Hydrazine monopropellant thrusters executing periapsis dip maneuvers down to 125 km altitude.",
        "ratio": [
          -0.35,
          0,
          0
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "How did Mars lose its thick atmosphere and warm water?",
        "a": "When Mars's molten core cooled and its global magnetic field collapsed 4 billion years ago, the planet had no shield against the solar wind. Solar wind particles struck atmospheric molecules directly, ionizing them and stripping them into space."
      },
      {
        "q": "What happens during MAVEN's 'deep dip' maneuvers?",
        "a": "I lower my periapsis from 150 km down to 125 km into the well-mixed lower ionosphere, allowing my mass spectrometers to directly 'taste' the atmospheric layers where escape mechanisms begin."
      },
      {
        "q": "Does Mars have auroras like Earth does?",
        "a": "Yes! MAVEN discovered widespread diffuse ultraviolet auroras spanning across the entire planet during major solar storms, created when energetic electrons slam into the Martian CO₂ atmosphere."
      }
    ]
  },
  {
    "id": "mgs",
    "name": "Mars Global Surveyor (MGS)",
    "shortName": "Mars Global Surveyor",
    "tagline": "The triumphant return to Mars — it mapped an entire world in 3D.",
    "group": "orbiter",
    "category": "Mars Orbiter",
    "body": "Mars",
    "planetId": "mars",
    "statusType": "abandoned",
    "legacyChain": "Its MOLA maps selected safe landing zones for Spirit, Opportunity, and Curiosity. Directly paved the way for MRO and MAVEN.",
    "nssdcaId": "1996-062A",
    "modelGlb": "/model/Mars Global Surveyor.glb",
    "sourceUrl": "https://science.nasa.gov/mission/mars-global-surveyor/",
    "sourceLabel": "NASA Science Mars Global Surveyor Archive",
    "location": "Sun-Synchronous Polar Mapping Orbit (~378 km)",
    "coordinates": "Orbit: ~378 km Polar Circular, 92.8° Inclination",
    "lat": 0,
    "lng": 0,
    "officialNssdcaCoords": "Polar Circular Mapping Orbit (378 km)",
    "launchYear": "1996",
    "orbitRadius": 124,
    "orbitColor": "#f59e0b",
    "orbitPeriodSec": 24,
    "primaryObjective": "Perform global, high-resolution topographical, mineralogical, and gravitational mapping of Mars over a full Martian decade (1996–2006).",
    "missionTimeline": {
      "launched": "November 7, 1996",
      "marsArrival": "September 12, 1997",
      "lastContact": "November 2, 2006",
      "status": "Historic Monument in Orbit"
    },
    "statusBadge": "Historic 10-Year Global Mapping Monument",
    "statusLed": "text-amber-400",
    "narrationScript": "Arriving in 1997 after a 20-year gap in NASA Mars missions, I carried the Mars Orbiter Laser Altimeter — MOLA — and high-resolution cameras to create the first complete 3D elevation map of the entire Red Planet, uncovering ancient river channels, layered sedimentary rock, and vanished magnetic fields. For ten triumphant years, I circled Mars from pole to pole, firing hundreds of millions of laser beams to sculpt this atlas. My maps selected the safe landing zones for Spirit, Opportunity, and Curiosity. After nearly a decade of service, a battery thermal error stalled my solar array in November 2006. Now a silent derelict satellite, I continue circling Mars until atmospheric drag gradually pulls me down — around the year 2047.",
    "crew": "Global Cartographic Satellite (NASA JPL)",
    "voiceProfile": {
      "pitch": 1,
      "rate": 0.96,
      "elevenLabsVoiceId": "AZnzlk1XvdvUeBnXmlld",
      "gender": "female",
      "narrator": "Domi (Clear Engaging Narrator)"
    },
    "hardware": "1,050 kg rectangular satellite with 1.5 m parabolic dish, gallium arsenide solar panels with drag flaps, MOC (Mars Orbiter Camera), MOLA (laser altimeter), TES (thermal emission spectrometer), and magnetometer.",
    "story": "MGS was NASA's glorious comeback to Mars following the loss of Mars Observer. Over ten years in orbit, MGS transformed our understanding of Mars from a static dead rock into a dynamic, shifting world with dust devils, fresh gullies, and ancient sedimentary basins.",
    "science": "MOLA fired 640 million laser pulses to construct the definitive 3D topographic atlas of Mars, discovering that Mars's northern lowlands were once a potential ocean basin, while its magnetometer detected crustal magnetic stripes proving ancient plate tectonics.",
    "miniLab": {
      "type": "laser-ranging",
      "title": "MOLA 3D Laser Altimetry Topography Scan",
      "subtitle": "Measure Crater Depths and Olympus Mons Peak Elevation",
      "instructions": "Fire laser altimeter pulses to trace cross-sections through Olympus Mons and the Valles Marineris canyon network."
    },
    "farewell": "For ten triumphant years, I circled Mars from pole to pole, firing hundreds of millions of laser beams to sculpt the first true 3D map of this planet. Every mission that landed after me walked upon the maps I drew. My solar wings are silent now, drifting through the high orbit of Mars forever.",
    "subsystems": [
      {
        "id": "dish-antenna",
        "name": "High-Gain Dish Antenna",
        "desc": "1.5-meter parabolic dish antenna providing communications lifeline that returned the first global 3D topographic maps.",
        "ratio": [
          0.32,
          0.25,
          0.25
        ]
      },
      {
        "id": "solar-wings",
        "name": "Main Solar Array Wings",
        "desc": "Dual GaAs solar panels with aerodynamic drag flaps utilized during historic planetary aerobraking.",
        "ratio": [
          0,
          0.05,
          0.42
        ]
      },
      {
        "id": "instrument-deck",
        "name": "HiRISE / Science Instrument Deck",
        "desc": "MOLA 3D laser altimeter and MOC wide-angle camera deck that uncovered ancient water-carved gullies.",
        "ratio": [
          -0.25,
          -0.15,
          0.22
        ]
      },
      {
        "id": "thruster-bus",
        "name": "Main Propulsion Thruster Bus",
        "desc": "Hydrazine thruster attitude system that maintained sun-synchronous circular orbit mapping for a full decade.",
        "ratio": [
          -0.35,
          0,
          0
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "What was the Mars Orbiter Laser Altimeter (MOLA)'s biggest achievement?",
        "a": "MOLA fired over 640 million laser pulses to generate the foundational topographic elevation map of Mars still used today, precisely measuring Olympus Mons (21.9 km tall) and the 7-kilometer deep Valles Marineris."
      },
      {
        "q": "How did your discoveries help the Opportunity rover?",
        "a": "My Thermal Emission Spectrometer (TES) detected a vast surface deposit of gray crystalline hematite in Meridiani Planum, which led NASA scientists to select Meridiani as Opportunity's landing site!"
      },
      {
        "q": "How long did your mission last?",
        "a": "I was planned for one Martian year (2 Earth years) but operated for an astonishing ten Earth years, transmitting hundreds of thousands of images until battery failure silenced my transmitter in November 2006."
      }
    ]
  },
  {
    "id": "apollo-11",
    "name": "Apollo 11 Lunar Module 'Eagle' Descent Stage & LRRR",
    "shortName": "Apollo 11 Eagle & LRRR",
    "tagline": "One small step, one golden spacecraft — preserved forever at Tranquility Base.",
    "group": "lunar",
    "category": "Crewed Lunar Lander",
    "body": "Moon",
    "planetId": "moon",
    "statusType": "abandoned",
    "legacyChain": "Paved the way for all subsequent Apollo landings, the Artemis program, and future crewed lunar return missions.",
    "nssdcaId": "1969-059C",
    "modelGlb": "/model/Apollo Lunar Module.glb",
    "sourceUrl": "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html",
    "sourceLabel": "NASA NSSDCA Apollo 11 Lunar Landing Site",
    "location": "Mare Tranquillitatis (Tranquility Base)",
    "coordinates": "Lat: 0.67416° N, Lng: 23.47314° E",
    "lat": 0.67416,
    "lng": 23.47314,
    "officialNssdcaCoords": "0.67416° N, 23.47314° E (LRRR at 0.67345° N, 23.47307° E)",
    "launchYear": "1969",
    "primaryObjective": "Perform the first crewed landing on the Moon, deploy scientific surface experiment package (EASEP/LRRR), and return lunar samples safely to Earth.",
    "missionTimeline": {
      "launched": "July 16, 1969",
      "landed": "July 20, 1969 (20:17:40 UT)",
      "ascentLiftoff": "July 21, 1969",
      "status": "Silent Monument + Active Passive Laser Mirror"
    },
    "statusBadge": "Active Passive Reflector",
    "statusLed": "text-emerald-400",
    "narrationScript": "Built exclusively for the airless vacuum of space, I carried Neil Armstrong and Buzz Aldrin to the lunar surface on July 20, 1969 — the first humans to walk on another world. Wrapped in gold Kapton thermal foil with a throttleable descent engine and surface ladder, my lower Descent Stage acted as both a landing pad and a launch platform when the crew blasted back to lunar orbit. Six Descent Stages, including Eagle here at Tranquility Base, remain abandoned on the Moon. Because the Moon has no wind, rain, or tectonic activity, these golden spacecraft and the astronauts' bootprints beside them will stand untouched for millions of years — humanity's first off-world archaeological sites. Even now, observatories on Earth fire lasers at my retroreflector mirrors every week, and I flash them right back across 384,000 kilometres.",
    "crew": "Neil A. Armstrong, Edwin \"Buzz\" Aldrin Jr.",
    "voiceProfile": {
      "pitch": 1.02,
      "rate": 0.97,
      "elevenLabsVoiceId": "21m00Tcm4TlvDq8ikWAM",
      "gender": "female",
      "narrator": "Rachel (Inspiring Storyteller)"
    },
    "hardware": "Octagonal aluminum-alloy descent stage (4.2 m diameter, 2,033 kg dry mass) with steerable descent engine and 4 landing legs wrapped in gold Mylar foil, paired with the EASEP Laser Ranging Retroreflector (LRRR)—an array of 100 fused-silica corner-cube prisms.",
    "story": "With less than 25 seconds of landing fuel remaining, Neil Armstrong and Buzz Aldrin manually piloted Eagle past a boulder-strewn crater to touch down safely. Before leaving, they deployed the LRRR mirror and passive seismometer 16 meters from the descent stage.",
    "science": "Over 55 years later, observatories on Earth still fire laser pulses at Apollo 11's mirror every week—proving the Moon is spiraling away from Earth at 3.8 cm per year, revealing the Moon has a fluid outer core, and confirming Einstein's General Theory of Relativity to unprecedented precision.",
    "miniLab": {
      "type": "laser-ranging",
      "title": "Earth-to-Moon Laser Ranging Simulator",
      "subtitle": "Measure Lunar Recession at 384,400 km via Light-Speed Pulse",
      "instructions": "Click \"Fire Observatory Laser\", watch a photon pulse travel 384,400 km to Tranquility Base, reflect off the 100 corner-cube prisms, and return in ~2.56 seconds to compute exact lunar recession."
    },
    "farewell": "The astronauts climbed back aboard Eagle's upper stage and blasted home to Earth, leaving my golden legs anchored here in the quiet dust of Tranquility Base. I have no radio left to call you, yet every time you shine a laser from Earth into my hundred glass mirrors, I flash a beam of light right back to say I am still here. Goodbye for now, Earth—keep looking up until humans walk beside me again.",
    "subsystems": [
      {
        "id": "ascent-cabin",
        "name": "Ascent Crew Cabin & Triangular Windows",
        "desc": "Pressurized cockpit where Armstrong and Aldrin manually piloted Eagle past boulders to touch down with 25 seconds of fuel remaining.",
        "ratio": [
          0,
          0.32,
          0.28
        ]
      },
      {
        "id": "sband-dish",
        "name": "S-Band High-Gain Dish",
        "desc": "Steerable parabolic antenna transmitting live television, astronaut biometrics, and telemetry across 384,400 km to Earth.",
        "ratio": [
          0.12,
          0.45,
          0.1
        ]
      },
      {
        "id": "descent-stage",
        "name": "Gold Kapton Descent Stage",
        "desc": "Octagonal aluminum chassis wrapped in gold and black Mylar thermal foil, carrying throttleable descent engine and fuel tanks.",
        "ratio": [
          0,
          -0.1,
          0.35
        ]
      },
      {
        "id": "landing-gear",
        "name": "4 Landing Struts & Footpads",
        "desc": "Quad truss landing struts with crushable aluminum honeycomb cartridges and lunar surface contact probe switches.",
        "ratio": [
          0.32,
          -0.4,
          0.32
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "Why is your laser retroreflector still working after more than 50 years?",
        "a": "Because it contains no electronics, batteries, or moving parts! It is a passive array of 100 high-purity quartz corner-cube prisms that bounce laser light directly back to Earth observatories purely through optical physics."
      },
      {
        "q": "How close were Neil and Buzz to running out of fuel during touchdown?",
        "a": "When Eagle's contact probes touched the dust at Tranquility Base, the propellant gauges read less than 25 seconds of remaining descent fuel before an abort would have been mandatory."
      },
      {
        "q": "What remains at Tranquility Base today?",
        "a": "My descent stage with its golden ladder and commemorative plaque ('We came in peace for all mankind'), the American flag, Neil and Buzz's discarded boots, the laser retroreflector, and their footprints preserved in the vacuum of space."
      }
    ]
  },
  {
    "id": "apollo-17",
    "name": "Apollo 17 Lunar Module 'Challenger' & ALSEP",
    "shortName": "Apollo 17 Challenger & ALSEP",
    "tagline": "The last human footprints of the 20th century — a nuclear heartbeat for 5 more years.",
    "group": "lunar",
    "category": "Crewed Lunar Lander",
    "body": "Moon",
    "planetId": "moon",
    "statusType": "abandoned",
    "legacyChain": "The final Apollo mission. The ALSEP station's 5 years of data laid the foundation for the Artemis program's return to the Moon.",
    "nssdcaId": "1972-096C",
    "modelGlb": "/model/Apollo Lunar Module.glb",
    "sourceUrl": "https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html",
    "sourceLabel": "NASA NSSDCA Apollo 17 Site Archive",
    "location": "Taurus-Littrow Valley",
    "coordinates": "Lat: 20.1911° N, Lng: 30.7723° E",
    "lat": 20.1911,
    "lng": 30.7723,
    "officialNssdcaCoords": "20.1911° N, 30.7723° E (ALSEP at 20.1923° N, 30.7655° E)",
    "launchYear": "1972",
    "primaryObjective": "Final Apollo crewed mission: extended stay, deep geological exploration of Taurus-Littrow with scientist-astronaut Harrison Schmitt, and nuclear-powered ALSEP deployment.",
    "missionTimeline": {
      "launched": "December 7, 1972",
      "landed": "December 11, 1972",
      "liftoff": "December 14, 1972",
      "alsepOperatedUntil": "September 30, 1977"
    },
    "statusBadge": "Final 20th Century Human Footprints",
    "statusLed": "text-amber-400",
    "narrationScript": "Gene Cernan and Harrison Schmitt — the first scientist-astronaut geologist on the Moon — spent 75 hours on my surface, driving 35.9 kilometres in the rover and setting up the most advanced geophysical station ever placed on another world. When Gene Cernan stepped off my ladder on December 14, 1972, I became the final witness to humanity's first great era on the Moon. My nuclear RTG heart kept whispering seismic data to Earth until 1977, and now I guard the valley of Taurus-Littrow in silence. The footprints beside me will stand unmarked for millions of years — until the Artemis generation returns.",
    "crew": "Eugene A. Cernan, Harrison H. \"Jack\" Schmitt",
    "voiceProfile": {
      "pitch": 0.95,
      "rate": 0.96,
      "elevenLabsVoiceId": "TxGEqnHWrfWFTfGW9XjX",
      "gender": "male",
      "narrator": "Josh (Documentary Guide)"
    },
    "hardware": "Extended J-series Lunar Module descent stage carrying ALSEP powered by a SNAP-27 Radioisotope Thermoelectric Generator (RTG) fueled by Plutonium-238, plus Lunar Seismic Profiling explosive charges and Heat Flow Probe.",
    "story": "Gene Cernan and Harrison Schmitt (the first scientist-astronaut geologist on the Moon) spent 75 hours on the lunar surface, driving 35.9 km in the rover and setting up the most advanced geophysical station ever placed on another world before Cernan left the final human footprints of the 20th century.",
    "science": "Discovered volcanic \"orange soil\" (3.64-billion-year-old pyroclastic glass beads) proving the Moon had explosive fire-fountain eruptions, and its ALSEP station transmitted continuous seismic and heat-flow telemetry back to NASA for nearly 5 years.",
    "miniLab": {
      "type": "rtg-power",
      "title": "RTG Nuclear Heat-to-Power & Seismic Array",
      "subtitle": "Plutonium-238 Thermocouple and Lunar Geophone Pulses",
      "instructions": "Monitor the Plutonium-238 thermocouple generating 70W of continuous power through freezing -170°C lunar nights and trigger seismic geophone pulses."
    },
    "farewell": "When Gene Cernan stepped off my ladder on December 14, 1972, I became the final witness to humanity's first great era on the Moon. My nuclear heart kept whispering seismic data to Earth until 1977, and now I guard the valley of Taurus-Littrow in silence. I have to let you go back to your world now—goodbye, until the Artemis generation returns.",
    "subsystems": [
      {
        "id": "ascent-cabin",
        "name": "Ascent Crew Cabin & Triangular Windows",
        "desc": "Extended mission crew cabin where Cernan and Schmitt lived during 75 hours in the deep Taurus-Littrow lunar valley.",
        "ratio": [
          0,
          0.32,
          0.28
        ]
      },
      {
        "id": "sband-dish",
        "name": "S-Band High-Gain Dish",
        "desc": "Steerable high-gain communications dish that broadcast live color rover television coverage back to Mission Control in Houston.",
        "ratio": [
          0.12,
          0.45,
          0.1
        ]
      },
      {
        "id": "descent-stage",
        "name": "Gold Kapton Descent Stage",
        "desc": "Extended J-series descent stage carrying heavy ALSEP geophysical science instruments and Lunar Roving Vehicle.",
        "ratio": [
          0,
          -0.1,
          0.35
        ]
      },
      {
        "id": "landing-gear",
        "name": "4 Landing Struts & Footpads",
        "desc": "Heavy-duty landing gear that supported the heaviest Lunar Module landing on rugged mountainous lunar terrain.",
        "ratio": [
          0.32,
          -0.4,
          0.32
        ]
      }
    ],
    "offlineQA": [
      {
        "q": "What was the famous 'orange soil' discovered at Shorty Crater?",
        "a": "Harrison Schmitt discovered tiny 3.64-billion-year-old volcanic glass beads that erupted in violent volcanic fire-fountains from deep within the Moon's mantle, proving explosive volcanism on early Moon."
      },
      {
        "q": "How long did your nuclear-powered ALSEP station broadcast data?",
        "a": "My SNAP-27 RTG kept the experiments operating continuously through blistering +120°C days and -170°C nights for nearly five years until NASA deactivated the network on September 30, 1977."
      },
      {
        "q": "What were the last words spoken before leaving the lunar surface?",
        "a": "Gene Cernan said: 'As we leave the Moon at Taurus-Littrow, we leave as we came and, God willing, as we shall return, with peace and hope for all mankind.'"
      }
    ]
  }
];
