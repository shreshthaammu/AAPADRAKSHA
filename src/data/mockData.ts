import {
  ZoneData,
  ShelterItem,
  EmergencyServiceItem,
  AlertItem,
  CitizenReportItem,
  WeatherData,
  FamilyMemberItem
} from "../types";

export const DEFAULT_ZONES: ZoneData[] = [
  {
    id: "zone-1",
    name: "Moosarambagh Causeway",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 156,
    cumulativeRainfall: 198,
    rainfallIntensity: "Extreme (34 mm/hr)",
    floodProb: 88,
    risk: "EMERGENCY",
    confidence: 94,
    depth: 1.65,
    inundationEta: "1.5 - 2.5 hours",
    latitude: 17.3715,
    longitude: 78.5085,
    elevation: 492,
    slope: 1.1,
    populationAtRisk: 34000,
    status: "Bridge submerged by 1.2m, traffic diverted"
  },
  {
    id: "zone-2",
    name: "Chaderghat Bridge & Lowlands",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 142,
    cumulativeRainfall: 178,
    rainfallIntensity: "Heavy (28 mm/hr)",
    floodProb: 85,
    risk: "EMERGENCY",
    confidence: 92,
    depth: 1.45,
    inundationEta: "2 - 3 hours",
    latitude: 17.3820,
    longitude: 78.4900,
    elevation: 496,
    slope: 1.3,
    populationAtRisk: 42000,
    status: "River Musi over-topping retaining embankment"
  },
  {
    id: "zone-3",
    name: "Begumpet (Brahmanwadi / Rasoolpura)",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 118,
    cumulativeRainfall: 152,
    rainfallIntensity: "Moderate-Heavy (22 mm/hr)",
    floodProb: 76,
    risk: "PREPARE",
    confidence: 89,
    depth: 0.85,
    inundationEta: "3.5 - 4.5 hours",
    latitude: 17.4440,
    longitude: 78.4680,
    elevation: 512,
    slope: 1.8,
    populationAtRisk: 28000,
    status: "Nala water backflowing into residential lanes"
  },
  {
    id: "zone-4",
    name: "Al Jubail Colony (Falaknuma Basin)",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 164,
    cumulativeRainfall: 210,
    rainfallIntensity: "Extreme (38 mm/hr)",
    floodProb: 92,
    risk: "EMERGENCY",
    confidence: 96,
    depth: 1.95,
    inundationEta: "1 - 2 hours",
    latitude: 17.3325,
    longitude: 78.4682,
    elevation: 488,
    slope: 0.8,
    populationAtRisk: 52000,
    status: "Severe backwater flooding; mandatory evacuation"
  },
  {
    id: "zone-5",
    name: "Nadeem Colony (Tolichowki Basin)",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 124,
    cumulativeRainfall: 160,
    rainfallIntensity: "Heavy (24 mm/hr)",
    floodProb: 78,
    risk: "PREPARE",
    confidence: 90,
    depth: 0.95,
    inundationEta: "3 - 4 hours",
    latitude: 17.3980,
    longitude: 78.4120,
    elevation: 504,
    slope: 1.4,
    populationAtRisk: 29000,
    status: "Shah Hatim lake surplus overflow impacting cellar parking"
  },
  {
    id: "zone-6",
    name: "Amberpet & Ramanthapur",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 96,
    cumulativeRainfall: 122,
    rainfallIntensity: "Moderate (18 mm/hr)",
    floodProb: 64,
    risk: "WATCH",
    confidence: 86,
    depth: 0.45,
    inundationEta: "5 - 6 hours",
    latitude: 17.3910,
    longitude: 78.5280,
    elevation: 510,
    slope: 2.2,
    populationAtRisk: 18000,
    status: "Roadway inundation near municipal sports ground"
  },
  {
    id: "zone-7",
    name: "Musheerabad & Bakaram Nala",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 88,
    cumulativeRainfall: 110,
    rainfallIntensity: "Moderate (15 mm/hr)",
    floodProb: 58,
    risk: "WATCH",
    confidence: 84,
    depth: 0.35,
    inundationEta: "6 - 7 hours",
    latitude: 17.4180,
    longitude: 78.5020,
    elevation: 518,
    slope: 2.5,
    populationAtRisk: 15000,
    status: "Secondary nala at 75% hydraulic capacity"
  },
  {
    id: "zone-8",
    name: "Banjara Hills (Upper Ridge)",
    district: "Hyderabad",
    state: "Telangana",
    rainfall: 72,
    cumulativeRainfall: 90,
    rainfallIntensity: "Light-Moderate (12 mm/hr)",
    floodProb: 18,
    risk: "NORMAL",
    confidence: 95,
    depth: 0.05,
    inundationEta: "No immediate threat",
    latitude: 17.4150,
    longitude: 78.4350,
    elevation: 565,
    slope: 6.8,
    populationAtRisk: 4000,
    status: "High ground topography, rapid surface drainage runoff"
  }
];

export const DEFAULT_WEATHER: WeatherData = {
  temperature: 24.8,
  feelsLike: 26.2,
  humidity: 95,
  windSpeed: 38,
  windDirection: "WSW (240°)",
  pressure: 998.2,
  rainfallCurrent: 34.5,
  rainfallCumulative24h: 156.0,
  rainfallIntensity: "Extreme Torrential",
  visibilityKm: 1.8,
  cloudCoverPct: 100,
  condition: "Heavy Monsoon Rain with Squall",
  uvIndex: 1
};

export const DEFAULT_SHELTERS: ShelterItem[] = [
  {
    id: "shelter-1",
    name: "Amberpet Indoor Municipal Stadium",
    address: "Golnaka, Amberpet High Road, Hyderabad",
    district: "Hyderabad",
    distanceKm: 2.1,
    capacity: 1800,
    currentOccupancy: 640,
    availableSlots: 1160,
    accessibility: "Wheelchair ramp, 24/7 power backup, dry staging area",
    status: "ACTIVE & WELCOMING",
    contact: "+91 40 2345 7891",
    facilities: [
      "Medical Post (3 Doctors)",
      "Continuous Drinking Water",
      "Sanitary Facilities & Showers",
      "Infant Formula & Dry Rations",
      "Power Generators (125kVA)"
    ],
    coordinates: [17.3945, 78.5220]
  },
  {
    id: "shelter-2",
    name: "Malakpet Govt High School & Community Hall",
    address: "Old Malakpet Junction, Near Railway Station",
    district: "Hyderabad",
    distanceKm: 1.8,
    capacity: 950,
    currentOccupancy: 480,
    availableSlots: 470,
    accessibility: "First-floor elevated shelter with ground-floor boat dock",
    status: "ACTIVE & WELCOMING",
    contact: "+91 40 2345 7892",
    facilities: [
      "Emergency Triage Center",
      "Clean Bedding & Blankets",
      "Community Kitchen (Hot Meals)",
      "Mobile Device Charging Station"
    ],
    coordinates: [17.3785, 78.4980]
  },
  {
    id: "shelter-3",
    name: "Osmania Medical College Auditorium",
    address: "Koti, Sultan Bazar, Hyderabad",
    district: "Hyderabad",
    distanceKm: 2.8,
    capacity: 2200,
    currentOccupancy: 810,
    availableSlots: 1390,
    accessibility: "Full hospital grade triage, oxygen manifold, ambulance ramp",
    status: "ACTIVE (MEDICAL PRIORITY)",
    contact: "+91 40 2460 0121",
    facilities: [
      "Full Apex Trauma Care",
      "Dialysis Support",
      "Pediatric ICU Wing",
      "Dedicated Elder Care Ward"
    ],
    coordinates: [17.3875, 78.4820]
  },
  {
    id: "shelter-4",
    name: "Secunderabad Railway Officers Club",
    address: "Maredpally West, Secunderabad",
    district: "Hyderabad",
    distanceKm: 5.4,
    capacity: 1200,
    currentOccupancy: 320,
    availableSlots: 880,
    accessibility: "High plateau elevation (540m MSL), 100% flood safe",
    status: "ACTIVE & WELCOMING",
    contact: "+91 40 2782 1144",
    facilities: [
      "Kitchen Rations for 5 Days",
      "Clean Drinking Water ATM",
      "Security & Civil Defense",
      "Pet Isolation Zone"
    ],
    coordinates: [17.4420, 78.5080]
  }
];

export const DEFAULT_SERVICES: EmergencyServiceItem[] = [
  {
    id: "srv-1",
    name: "National Disaster Response Force (NDRF 10th Bn)",
    phone: "1078 / 011-24363260",
    category: "Search & Water Rescue",
    distance: "15 rescue inflatables deployed",
    status: "ON ACTIVE PATROL"
  },
  {
    id: "srv-2",
    name: "State Disaster Response Force (Telangana SDRF)",
    phone: "112 / 1070",
    category: "Search & Water Rescue",
    distance: "Stationed at Moosarambagh & Chaderghat",
    status: "DISPATCHED"
  },
  {
    id: "srv-3",
    name: "GHMC Central Disaster Control Room",
    phone: "040-21111111",
    category: "Municipal Drainage & Evacuation",
    distance: "Command Center, Tank Bund",
    status: "24x7 EMERGENCY OPS"
  },
  {
    id: "srv-4",
    name: "108 Emergency Medical Ambulance Service",
    phone: "108",
    category: "Medical & Trauma",
    distance: "12 Advanced Life Support rigs standing by",
    status: "HIGH ALERT"
  },
  {
    id: "srv-5",
    name: "Telangana Fire & Emergency Services",
    phone: "101",
    category: "Rescue & De-watering",
    distance: "Stationed at Gowliguda & Malakpet",
    status: "PUMPING OPS ACTIVE"
  },
  {
    id: "srv-6",
    name: "TSSPDCL Electrical Safety & Emergency Helpline",
    phone: "1912",
    category: "Power Grid Isolation",
    distance: "Chaderghat & Amberpet squads",
    status: "ISOLATING LOW TRANSFORMERS"
  }
];

export const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: "ALT-2026-0891",
    title: "RED INUNDATION EMERGENCY: River Musi Surging Past 512.4m",
    category: "RIVER OVERFLOW & FLASH FLOOD",
    severity: "EMERGENCY",
    location: "Moosarambagh, Chaderghat, and Al Jubail Colony Wards",
    time: "12 mins ago",
    description: "Continuous cloudburst rainfall exceeding 34mm/hr coupled with 18,000 cusecs reservoir outflow from Himayat Sagar has caused River Musi to over-top low-level causeways. Water levels are rising at 18 cm/hr.",
    recommendedAction: "Ground-floor residents must evacuate immediately to Amberpet Stadium or designated relief shelters. Avoid causeways and low bridges. Turn off home main circuit breakers.",
    source: "IMD Hyderabad & Central Water Commission (CWC)",
    verificationStatus: "OFFICIAL VERIFIED BULLETIN"
  },
  {
    id: "ALT-2026-0890",
    title: "ORANGE PREPARATION ADVISORY: Urban Nala Surcharge Warning",
    category: "STORM DRAIN BACKFLOW",
    severity: "PREPARE",
    location: "Begumpet (Brahmanwadi), Nadeem Colony, Tolichowki",
    time: "48 mins ago",
    description: "Stormwater secondary drains operating at 110% capacity. Low-lying basements and underground car parks are at severe risk of inundation within the next 3 hours.",
    recommendedAction: "Move motor vehicles to elevated flyovers or designated multi-level parkings. Safeguard emergency grab bags and essential medicines on upper floors.",
    source: "GHMC Disaster Management Cell",
    verificationStatus: "OFFICIAL VERIFIED BULLETIN"
  },
  {
    id: "ALT-2026-0889",
    title: "YELLOW WEATHER WATCH: Squall Line with Lightning & Gusts",
    category: "SEVERE CONVECTIVE STORM",
    severity: "WATCH",
    location: "Hyderabad Metropolitan Region",
    time: "2 hours ago",
    description: "Doppler radar shows intense convective cell tracking East-Northeast at 24 km/h with cloud tops reaching 14 km (-68°C). Gusty winds up to 45 km/h expected.",
    recommendedAction: "Stay indoors. Stay clear of electrical transformers, hoardings, and weak trees.",
    source: "IMD Hyderabad Radar Station",
    verificationStatus: "OFFICIAL VERIFIED BULLETIN"
  }
];

export const DEFAULT_REPORTS: CitizenReportItem[] = [
  {
    id: "REP-401",
    category: "Submerged Road / Underpass",
    location: "Moosarambagh Causeway Approach",
    district: "Hyderabad",
    state: "Telangana",
    severity: "CRITICAL",
    description: "Water has crossed the concrete guard rails by over 1 meter. Two auto-rickshaws were rescued by locals. Road is totally impassable. [CV Verified: 1.25m depth]",
    time: "18 mins ago",
    timestamp: new Date().toISOString(),
    status: "VERIFIED",
    coordinates: [17.3715, 78.5085],
    upvotes: 38,
    verifiedByAuthority: true
  },
  {
    id: "REP-398",
    category: "Severe Waterlogging",
    location: "Chaderghat 132kV Substation Periphery",
    district: "Hyderabad",
    state: "Telangana",
    severity: "CRITICAL",
    description: "Flood water entering transformer plinths. Power company personnel on scene deploying sandbags. [CV Verified: 0.75m depth]",
    time: "32 mins ago",
    timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
    status: "IN_PROGRESS",
    coordinates: [17.3820, 78.4900],
    upvotes: 24,
    verifiedByAuthority: true
  },
  {
    id: "REP-394",
    category: "Citizens Stranded on Ground Floor",
    location: "Al Jubail Colony, Lane 4, Falaknuma",
    district: "Hyderabad",
    state: "Telangana",
    severity: "CRITICAL",
    description: "Elderly family with 2 children trapped on ground floor. Water level is chest high (approx 1.5m). Requires SDRF rubber boat immediately.",
    time: "45 mins ago",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "IN_PROGRESS",
    coordinates: [17.3325, 78.4682],
    upvotes: 56,
    verifiedByAuthority: true
  },
  {
    id: "REP-390",
    category: "Fallen Electric Pole / Wire",
    location: "Begumpet Rasoolpura Main Road",
    district: "Hyderabad",
    state: "Telangana",
    severity: "PREPARE",
    description: "Live wire snapped and sparked into flooded puddle. Area cordoned off with yellow tape by traffic police.",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    status: "RESOLVED",
    coordinates: [17.4440, 78.4680],
    upvotes: 19,
    verifiedByAuthority: true
  }
];

export const DEFAULT_FAMILY_MEMBERS: FamilyMemberItem[] = [
  {
    id: "fam-1",
    name: "Ramesh Rao",
    relationship: "Self",
    ageCategory: "Adult",
    vulnerabilityNeeds: ["First Aider"],
    status: "SAFE",
    location: "Moosarambagh Home (Packing grab-bag)",
    lastCheckIn: "5 mins ago",
    phone: "+91 98490 12345"
  },
  {
    id: "fam-2",
    name: "Sunita Rao",
    relationship: "Spouse",
    ageCategory: "Adult",
    vulnerabilityNeeds: ["Essential Documents Custodian"],
    status: "SAFE",
    location: "Office (Begumpet, Upper Floor)",
    lastCheckIn: "12 mins ago",
    phone: "+91 98490 54321"
  },
  {
    id: "fam-3",
    name: "Venkat Rao",
    relationship: "Father",
    ageCategory: "Elderly",
    vulnerabilityNeeds: ["Hypertension Medication", "Slow Mobility"],
    status: "NEEDS HELP",
    location: "Moosarambagh Home (Ground Floor)",
    lastCheckIn: "25 mins ago",
    phone: "+91 98490 98765"
  },
  {
    id: "fam-4",
    name: "Aarav Rao",
    relationship: "Son (Age 9)",
    ageCategory: "Child",
    vulnerabilityNeeds: ["Accompanied Evacuation Only"],
    status: "SAFE",
    location: "With Mother at Begumpet",
    lastCheckIn: "14 mins ago",
    phone: "N/A"
  }
];
