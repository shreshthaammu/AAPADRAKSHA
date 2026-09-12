import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Droplets,
  ShieldAlert,
  ArrowRight,
  Waves,
  MapPin,
  Activity,
  Layers
} from "lucide-react";
import { ZoneData, StateProfile } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { fetchForecastTimeline } from "../services/api";

interface FloodForecastPageProps {
  selectedZone: ZoneData;
  selectedState: StateProfile;
  selectedDistrict: string;
  onNavigateTab: (tab: any) => void;
}

export const FloodForecastPage: React.FC<FloodForecastPageProps> = ({
  selectedZone,
  selectedState,
  selectedDistrict,
  onNavigateTab
}) => {
  const [timeline, setTimeline] = useState<any[]>([
    { time: "08:00 (Past)", forecastRainfallMm: 14.2, floodProbabilityPct: 62, waterDepthM: 0.4 },
    { time: "09:00 (Current)", forecastRainfallMm: 22.5, floodProbabilityPct: 76, waterDepthM: 0.8 },
    { time: "10:00 (+1h)", forecastRainfallMm: 28.0, floodProbabilityPct: 82, waterDepthM: 1.1 },
    { time: "12:00 (+3h)", forecastRainfallMm: 34.5, floodProbabilityPct: 88, waterDepthM: 1.45 },
    { time: "15:00 (+6h)", forecastRainfallMm: 20.0, floodProbabilityPct: 84, waterDepthM: 1.3 },
    { time: "21:00 (+12h)", forecastRainfallMm: 9.5, floodProbabilityPct: 68, waterDepthM: 0.9 },
    { time: "09:00 (+24h)", forecastRainfallMm: 4.0, floodProbabilityPct: 45, waterDepthM: 0.3 }
  ]);

  useEffect(() => {
    fetchForecastTimeline().then(res => {
      if (res?.timeline) {
        setTimeline(res.timeline);
      }
    });
  }, []);

  return (
    <div id="flood-forecast-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Hydrodynamic Flood Forecast & Inundation ETA
            </h1>
            <RiskBadge level={selectedZone.risk} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive 2D shallow-water inundation model for {selectedZone.name}, {selectedDistrict}.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab("evacuation")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Open Evacuation Corridor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Critical Inundation Headline Cards (Section 18 & 19) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Peak Risk Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Expected Peak Inundation</span>
            <Clock className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-600 dark:text-red-500">
            14:30 IST (+3.5h)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Confluence of peak cloudburst runoff & river high hydrograph.
          </p>
        </div>

        {/* Card 2: Maximum Water Depth */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Predicted Water Depth</span>
            <Waves className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ~{selectedZone.depth} meters
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
            Submerging road subways & ground floors.
          </p>
        </div>

        {/* Card 3: Inundation Footprint */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Estimated Submerged Extent</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            24.8 km²
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across low-lying drainage corridors and riverfront wards.
          </p>
        </div>

        {/* Card 4: Model Confidence */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Model Confidence</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {selectedZone.confidence}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Based on simulated river and rainfall inputs for prototype demonstration.
          </p>
        </div>
      </div>

      {/* Forecast Graph: Forecast Rainfall vs Flood Probability Timeline (Section 18) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Rainfall Progression vs Inundation Probability
            </h3>
            <p className="text-xs text-slate-500">
              Coordinated temporal curve comparing hourly precipitation volume against hydrodynamic flood likelihood
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Precipitation (mm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Flood Prob (%)</span>
            </div>
          </div>
        </div>

        {/* Timeline Visualization Table / Bar */}
        <div className="space-y-3 pt-2">
          {timeline.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="w-36 shrink-0">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {point.time}
                </span>
                <span className="text-[11px] text-slate-400">
                  Water Depth: ~{point.waterDepthM} m
                </span>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* Rainfall */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Forecast Rain</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {point.forecastRainfallMm} mm
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (point.forecastRainfallMm / 40) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Flood Probability */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Flood Risk</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {point.floodProbabilityPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        point.floodProbabilityPct > 80
                          ? "bg-red-500"
                          : point.floodProbabilityPct > 65
                          ? "bg-orange-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${point.floodProbabilityPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-28 text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    point.floodProbabilityPct > 80
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : point.floodProbabilityPct > 65
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {point.floodProbabilityPct > 80
                    ? "EMERGENCY"
                    : point.floodProbabilityPct > 65
                    ? "PREPARE"
                    : "WATCH"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* River Gauges Danger Level Table (Section 19) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              CWC Telemetric River Stage Stations
            </h3>
            <p className="text-xs text-slate-500">
              Real-time stage heights vs Danger Marks along main drainage basins
            </p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
            2 Gauges Exceeding Danger Mark
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                River Musi — Moosarambagh Gauge
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">
                BREACHED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Level</span>
                <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">512.4 m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Danger Level</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">512.0 m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">HFL (Historic)</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">514.8 m</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Discharge at 34,500 cusecs and rising. Low-lying habitations on river margin in direct flood path.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                River Musi — Chaderghat Causeway Station
              </span>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">
                BREACHED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Level</span>
                <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">509.8 m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Danger Level</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">509.5 m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">HFL (Historic)</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">512.1 m</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Water overtopping causeway road by +0.3m. Traffic barred; municipal police staged at both approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
