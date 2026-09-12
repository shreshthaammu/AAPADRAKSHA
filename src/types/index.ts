export type RiskLevel = "INFO" | "ADVISORY" | "NORMAL" | "WATCH" | "PREPARE" | "HIGH" | "CRITICAL" | "EMERGENCY";
export type AppMode = "citizen" | "authority";
export type UserRole = "citizen" | "authority";
export type ThemeMode = "light" | "dark" | "system";

export type NavTab =
  | "dashboard"
  | "live-map"
  | "weather"
  | "flood-forecast"
  | "forecast"
  | "risk-analysis"
  | "ai-prediction"
  | "architecture"
  | "model-training"
  | "data-fusion"
  | "data"
  | "alerts"
  | "safety"
  | "authority-alerts"
  | "authority-sources"
  | "infrastructure"
  | "citizen-alerts"
  | "what-if"
  | "analytics"
  | "disaster-reports"
  | "evacuation"
  | "emergency-services"
  | "family-safety"
  | "sos"
  | "assistant"
  | "ai-assistant"
  | "notifications"
  | "settings"
  | "profile";

export interface ZoneData {
  id: string;
  name: string;
  district: string;
  state: string;
  rainfall: number;
  cumulativeRainfall: number;
  rainfallIntensity: string;
  floodProb: number;
  risk: RiskLevel;
  confidence: number;
  depth: number;
  inundationEta: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  slope?: number;
  populationAtRisk?: number;
  status?: string;
  updatedAt?: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  rainfallCurrent: number;
  rainfallCumulative24h: number;
  rainfallIntensity: string;
  visibilityKm: number;
  cloudCoverPct: number;
  condition: string;
  uvIndex?: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainMm: number;
  rainProb: number;
  humidity: number;
}

export interface DailyForecast {
  day: string;
  maxTemp: number;
  minTemp: number;
  rainMm: number;
  condition: string;
}

export interface AlertItem {
  id: string;
  category: string;
  severity: RiskLevel;
  title: string;
  location: string;
  time: string;
  description: string;
  recommendedAction: string;
  source: string;
  verificationStatus: string;
  status?: "Draft" | "Published" | "Paused" | "Withdrawn" | "Resolved" | string;
  alertType?: string;
  district?: string;
  city?: string;
  coordinates?: [number, number];
  affectedZones?: string[];
  startTime?: string;
  expiryTime?: string;
  expectedRainfall?: string;
  floodProbability?: string;
  expectedInundationDepth?: string;
  confidence?: string;
  published?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  createdAt?: string;
  modifiedAt?: string;
  previousSeverity?: string;
  sourceStatus?: string;
}

export interface AuthorityAlertAudit {
  id: string;
  alertId: string;
  createdBy: string;
  createdTime: string;
  modifiedBy: string;
  modifiedTime: string;
  previousSeverity: string;
  newSeverity: string;
  statusChange: string;
  source: string;
  publicationStatus: string;
}

export interface ShelterItem {
  id: string;
  name: string;
  address: string;
  district: string;
  distanceKm: number;
  capacity: number;
  currentOccupancy: number;
  availableSlots: number;
  accessibility: string;
  status: string;
  contact: string;
  facilities: string[];
  coordinates: [number, number];
}

export interface EmergencyServiceItem {
  id: string;
  name: string;
  phone: string;
  category: string;
  distance: string;
  status: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  type: string;
  location: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  floodExposurePct: number;
  status: string;
}

export interface CitizenReportItem {
  id: string;
  category: string;
  location: string;
  district?: string;
  state?: string;
  description: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | "WATCH" | "PREPARE";
  status: "Pending" | "Under Review" | "Verified" | "Resolved" | "VERIFIED" | "IN_PROGRESS" | "RESOLVED" | string;
  timestamp?: string;
  time?: string;
  imageUrl?: string;
  coordinates: [number, number];
  reporterName?: string;
  reporterContact?: string;
  upvotes?: number;
  verifiedByAuthority?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  location: string;
  status: "SAFE" | "NEEDS_HELP" | "IN_TRANSIT" | "OFFLINE" | string;
  lastCheckIn: string;
  vulnerabilities: string[];
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  relationship: string;
  ageCategory: "Child" | "Adult" | "Elderly";
  vulnerabilityNeeds: string[];
  status: "SAFE" | "CHECKED IN" | "NEEDS HELP" | "UNKNOWN";
  location: string;
  lastCheckIn: string;
  phone?: string;
}

export interface DataFusionSource {
  name: string;
  type: string;
  status: "LIVE" | "SIMULATED" | "REFERENCE" | "DEGRADED" | "UNAVAILABLE" | "ONLINE" | "STREAMING" | "STATIC REFERENCE";
  latency: string;
  quality: "HIGH" | "MODERATE" | "LOW";
  contributionPct: number;
  availability: string;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  type: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  rocAuc: string;
  maeDepthM: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "weather" | "flood" | "evacuation" | "report" | "family" | "system";
  severity: RiskLevel;
  timestamp: string;
  read: boolean;
}

export interface StateProfile {
  name: string;
  code: string;
  capital: string;
  districts: string[];
  defaultDistrict: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  next6: number;
  next24: number;
  flood: number;
  risk: RiskLevel;
  inundation: string;
  climate: string;
  annual: string;
  monsoon: string;
  summer: string;
  floodPeriod: string;
  center: [number, number];
  zoom: number;
}

export type DatasetStatus = "DEMO" | "OFFICIAL" | "LIVE" | "PROCESSED";
export type DatasetCategory =
  | "Rainfall"
  | "Weather"
  | "Radar"
  | "Satellite"
  | "Flood"
  | "Elevation"
  | "River"
  | "GIS"
  | "NWP"
  | "Observational";
export type DatasetFormat = "CSV" | "NetCDF" | "GeoTIFF";

export interface ValidationCheck {
  name: string;
  status: "PASS" | "WARNING" | "ERROR";
  message: string;
}

export interface DatasetValidation {
  status: "PASS" | "WARNING" | "ERROR";
  score: number;
  lastValidated: string;
  checks: ValidationCheck[];
  missingCount: number;
  duplicateCount: number;
}

export interface DatasetPreprocessing {
  stage: "Raw" | "Validated" | "Cleaned" | "Normalized" | "Feature Engineered" | "Training Ready";
  isCleaned: boolean;
  isNormalized: boolean;
  isFeatureEngineered: boolean;
  steps: string[];
}

export interface DatasetVersionItem {
  version: string;
  createdAt: string;
  changes: string;
  status: DatasetStatus;
  records: number;
  size: string;
  createdBy: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  displayName: string;
  description: string;
  source: string;
  sourceUrl?: string;
  status: DatasetStatus;
  category: DatasetCategory;
  format: DatasetFormat;
  version: string;
  license?: string;
  createdAt: string;
  updatedAt: string;
  records: number;
  columns: string[];
  columnCount: number;
  fileSize: string;
  filePath: string;
  isSystemSample?: boolean;
  temporalCoverage?: string;
  spatialCoverage?: string;
  resolution?: string;
  units?: string;
  notes?: string;
  validation: DatasetValidation;
  preprocessing: DatasetPreprocessing;
  trainingReady: boolean;
  trainingSelected: boolean;
  versions: DatasetVersionItem[];
}

export interface OfficialDataSource {
  id: string;
  provider: string;
  shortName: string;
  category: string;
  dataTypes: string[];
  status: "NOT CONNECTED" | "CONNECTED" | "AVAILABLE" | "REGISTRATION REQUIRED" | "DEMO";
  connectionState: string;
  officialUrl: string;
  links: { label: string; url: string }[];
  description: string;
  requiresRegistration: boolean;
  authRequirement: string;
  envKeyName?: string;
  spatialCoverage: string;
  latency: string;
}
