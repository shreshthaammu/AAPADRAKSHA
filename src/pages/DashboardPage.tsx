import React from "react";
import {
  CloudRain,
  AlertTriangle,
  ShieldAlert,
  Droplets,
  Wind,
  Gauge,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Navigation,
  Bot,
  Activity,
  Layers
} from "lucide-react";
import { ZoneData, WeatherData, StateProfile, RiskLevel } from "../types";
import { RiskGauge } from "../components/RiskGauge";
import { RiskBadge } from "../components/RiskBadge";

interface DashboardPageProps {
  selectedState: StateProfile;
  selectedDistrict: string;
  selectedZone: ZoneData;
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  weather: WeatherData | null;
  riskIndex: number;
  contributingFactors: any[];
  onNavigateTab: (tab: any) => void;
  isAuthorityMode: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  selectedState,
  selectedDistrict,
  selectedZone,
  zones,
  onSelectZone,
  weather,
  riskIndex,
  contributingFactors,
  onNavigateTab,
  isAuthorityMode
}) => {
  return (
    <div id="dashboard-page-container" className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span className="font-bold text-slate-900 dark:text-white">DATA STATUS</span> · SIMULATED REPRESENTATIVE DATA · Updated for prototype demonstration
      </div>

      {/* Top Welcome & Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isAuthorityMode ? "Disaster Command & Inundation Center" : "Personal Safety & Flood Dashboard"}
            </h1>
            <RiskBadge level={selectedZone.risk} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedZone.name}</span> in {selectedDistrict}, {selectedState.name}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigateTab("live-map")}
            id="dash-open-gis-map-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </button>
          <button
            onClick={() => onNavigateTab("evacuation")}
            id="dash-open-evac-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Safe Evacuation</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid (Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current & Cumulative Rainfall */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rainfall observation
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedZone.rainfall}
            </span>
            <span className="text-sm font-semibold text-slate-500">mm / 24h</span>
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span>Intensity:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedZone.rainfallIntensity}
              </span>
            </div>
            <div className="flex justify-between">
              <span>6h Forecast:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                +{selectedState.next6} mm expected
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Citizen-safe risk summary / Authority probability detail */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isAuthorityMode ? "Flood Probability" : "Current flood risk"}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-500">
              {isAuthorityMode ? `${selectedZone.floodProb}%` : selectedZone.risk === "EMERGENCY" ? "Emergency" : selectedZone.risk === "PREPARE" ? "Prepare to move" : selectedZone.risk === "WATCH" ? "Stay alert" : "Safe"}
            </span>
            <RiskBadge level={selectedZone.risk} size="sm" />
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            {isAuthorityMode ? <>
              <div className="flex justify-between"><span>Estimated Water Depth:</span><span className="font-semibold text-red-600 dark:text-red-400">~{selectedZone.depth} meters</span></div>
              <div className="flex justify-between"><span>Inundation ETA:</span><span className="font-semibold text-slate-800 dark:text-slate-200">{selectedZone.inundationEta}</span></div>
            </> : <div className="font-semibold text-slate-700 dark:text-slate-300">{selectedZone.risk === "EMERGENCY" ? "Move to safety and follow evacuation instructions now." : "Follow local alerts and avoid unsafe roads."}</div>}
          </div>
        </div>

        {/* Metric 3: AI Model Confidence */}
        {isAuthorityMode && <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI / ML Confidence
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {selectedZone.confidence}%
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              High Quality
            </span>
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span>Ensemble Model:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Trained Logistic Risk Classifier
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fused Feeds:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                7 simulated inputs
              </span>
            </div>
          </div>
        </div>}

        {/* Metric 4: Monitored Zone Status */}
        {isAuthorityMode && <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Zone Elevation & Slope
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {selectedZone.elevation || 498}
            </span>
            <span className="text-sm font-semibold text-slate-500">meters (DEM)</span>
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span>Terrain Slope:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedZone.slope || 1.2}° (Flat Basin)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pop. Exposed:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {(selectedZone.populationAtRisk || 142000).toLocaleString()} residents
              </span>
            </div>
          </div>
        </div>}
      </div>

      {/* Main Section: Circular Risk Index + Monitored Zones Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: AAPADRAKSHA Risk Index (Section 10) */}
        {isAuthorityMode && <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  AAPADRAKSHA Risk Index
                </h3>
                <p className="text-xs text-slate-500">Integrated 0-100 Multi-Factor Gauge</p>
              </div>
              <RiskBadge level={selectedZone.risk} />
            </div>

            <div className="py-4">
              <RiskGauge
                score={riskIndex}
                riskLevel={selectedZone.risk}
                contributingFactors={contributingFactors}
                size={210}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab("risk-analysis")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explain Multivariate Weights</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab("what-if")}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Simulate Scenario
            </button>
          </div>
        </div>}

        {/* Right Col: Live Risk Overview - Monitored Zones (Section 9) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Monitored Zones ({selectedDistrict})
                </h3>
                <p className="text-xs text-slate-500">
                  Select a zone to update all hydrological metrics across the dashboard
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                {zones.length} Zones Monitored
              </span>
            </div>

            {/* Zones Grid / Table */}
            <div className="mt-4 space-y-2.5 overflow-x-auto">
              {zones.map(zone => {
                const isSelected = zone.id === selectedZone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    id={`zone-card-${zone.id}`}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-1 ring-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <RiskBadge level={zone.risk} size="sm" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {zone.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Status: <span className="font-medium text-slate-700 dark:text-slate-300">{zone.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Rainfall</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{zone.rainfall} mm</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Flood Prob</div>
                        <div className="font-bold text-rose-600 dark:text-rose-400">{zone.floodProb}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Water Depth</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{zone.depth} m</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">ETA</div>
                        <div className="font-bold text-amber-600 dark:text-amber-400">{zone.inundationEta}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Click any zone above to refocus the risk model, GIS map, and evacuation solver.</span>
            <button
              onClick={() => onNavigateTab("live-map")}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on GIS Map →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Cards for Key Disaster Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Launchpad 1: AI Assistant */}
        <div
          onClick={() => onNavigateTab("ai-assistant")}
          className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white cursor-pointer hover:shadow-lg transition-transform active:scale-98"
        >
          <div className="flex items-center justify-between">
            <Bot className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </div>
          <h4 className="mt-3 font-bold text-base">AI Disaster Assistant</h4>
          <p className="text-xs text-blue-100 mt-1">
            Voice-enabled guidance, grab-bag check, and personalized shelter directions.
          </p>
        </div>

        {/* Launchpad 2: Citizen Reports & CV */}
        <div
          onClick={() => onNavigateTab("citizen-alerts")}
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white cursor-pointer hover:shadow-lg transition-transform active:scale-98"
        >
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </div>
          <h4 className="mt-3 font-bold text-base">Report Inundation</h4>
          <p className="text-xs text-amber-100 mt-1">
            Submit photo with computer vision flood depth detection and blocked road pins.
          </p>
        </div>

        {/* Launchpad 3: Multi-Sensor Data Fusion */}
        {isAuthorityMode && <>
        <div
          onClick={() => onNavigateTab("data-fusion")}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white cursor-pointer hover:shadow-lg transition-transform active:scale-98"
        >
          <div className="flex items-center justify-between">
            <Layers className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </div>
          <h4 className="mt-3 font-bold text-base">Data Fusion Pipeline</h4>
          <p className="text-xs text-emerald-100 mt-1">
            Inspect INSAT-3D satellite, Doppler radar, AWS, and NWP model telemetry streams.
          </p>
        </div>

        {/* Launchpad 4: What-If Simulator */}
        <div
          onClick={() => onNavigateTab("what-if")}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 text-white cursor-pointer hover:shadow-lg transition-transform active:scale-98"
        >
          <div className="flex items-center justify-between">
            <TrendingUp className="w-6 h-6" />
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </div>
          <h4 className="mt-3 font-bold text-base">What-If Simulator</h4>
          <p className="text-xs text-purple-100 mt-1">
            Adjust precipitation sliders and test urban inundation under extreme cloudbursts.
          </p>
        </div></>}
      </div>
    </div>
  );
};
