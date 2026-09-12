import React from "react";
import { ZoneData, ShelterItem, CitizenReportItem, StateProfile } from "../types";
import { LiveMap } from "../components/LiveMap";
import { RiskBadge } from "../components/RiskBadge";
import { MapPin, Navigation, AlertTriangle, ShieldCheck, PhoneCall, Info } from "lucide-react";

interface LiveMapPageProps {
  selectedState: StateProfile;
  selectedDistrict: string;
  selectedZone: ZoneData;
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  shelters: ShelterItem[];
  reports: CitizenReportItem[];
  onNavigateTab: (tab: any) => void;
  onOpenSOS: () => void;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({
  selectedState,
  selectedDistrict,
  selectedZone,
  zones,
  onSelectZone,
  shelters,
  reports,
  onNavigateTab,
  onOpenSOS
}) => {
  return (
    <div id="live-map-page" className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Inundation GIS Map
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Multi-Layer Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time geospatial fusion of radar cloud cores, inundation footprints, relief shelters, and crowdsourced hazards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab("evacuation")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Evacuation Routes</span>
          </button>
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map (8 cols) + Zone Details & Actions (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-14rem)] min-h-[580px]">
        {/* Left: GIS Map View */}
        <div className="lg:col-span-8 h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <LiveMap
            center={selectedState.center}
            zoom={selectedState.zoom}
            zones={zones}
            selectedZoneId={selectedZone.id}
            onSelectZone={onSelectZone}
            shelters={shelters}
            reports={reports}
            showRoute={true}
          />
        </div>

        {/* Right: Selected Zone Inspector & Critical Actions */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Zone Inspector
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedZone.name}
                </h3>
              </div>
              <RiskBadge level={selectedZone.risk} />
            </div>

            {/* Critical Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Rainfall Accumulation</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedZone.rainfall} mm
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 block mt-0.5 font-medium">
                  {selectedZone.rainfallIntensity}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Flood Probability</span>
                <span className="text-base font-extrabold text-rose-600 dark:text-rose-500">
                  {selectedZone.floodProb}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  AI Conf: {selectedZone.confidence}%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Predicted Water Depth</span>
                <span className="text-base font-extrabold text-red-600 dark:text-red-400">
                  ~{selectedZone.depth} m
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Inundation ETA: {selectedZone.inundationEta}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Elevation (DEM)</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedZone.elevation || 498} m
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Slope: {selectedZone.slope || 1.2}°
                </span>
              </div>
            </div>

            {/* Evacuation Alert Card */}
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs">
              <div className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Immediate Safety Advisory</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedZone.risk === "EMERGENCY"
                  ? "Water logging exceeds 1.2m across major road subways. Evacuate to high ground immediately via the highlighted green corridor."
                  : "Monitor official advisories. Avoid low-lying stormwater drains and keep battery-powered lights ready."}
              </p>
            </div>

            {/* Nearest Shelter Quick Info */}
            {shelters.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Nearest Safe Shelter:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {shelters[0].distanceKm} km away
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white mt-1">
                  {shelters[0].name}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Available Slots: {shelters[0].availableSlots} / {shelters[0].capacity}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab("evacuation")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate Safe Evacuation Route</span>
            </button>
            <button
              onClick={() => onNavigateTab("citizen-alerts")}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Report Local Flood Hazard at this Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
