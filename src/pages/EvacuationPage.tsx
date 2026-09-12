import React, { useState } from "react";
import {
  Navigation,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Building,
  Filter,
  ArrowRight,
  Footprints,
  Car
} from "lucide-react";
import { ShelterItem, ZoneData } from "../types";

interface EvacuationPageProps {
  shelters: ShelterItem[];
  selectedZone: ZoneData;
  onOpenSOS: () => void;
}

export const EvacuationPage: React.FC<EvacuationPageProps> = ({
  shelters,
  selectedZone,
  onOpenSOS
}) => {
  const [selectedShelterId, setSelectedShelterId] = useState<string>(shelters[0]?.id || "SH-01");
  const [filterType, setFilterType] = useState<"ALL" | "AVAILABLE" | "ACCESSIBLE">("ALL");

  const activeShelter = shelters.find(s => s.id === selectedShelterId) || shelters[0];

  const filteredShelters = shelters.filter(s => {
    if (filterType === "AVAILABLE") return s.availableSlots > 200;
    if (filterType === "ACCESSIBLE") return s.accessibility.toLowerCase().includes("accessible") || s.accessibility.toLowerCase().includes("ramp");
    return true;
  });

  const turnSteps = [
    { instruction: "Head north on Chaderghat High Road toward MGBS Elevated Corridor", distance: "300 m", safe: true },
    { instruction: "WARNING: DO NOT turn left onto the causeway (Road underwater >1.2m)", distance: "0 m", safe: false, alert: true },
    { instruction: "Continue straight over the elevated bridge bypass", distance: "450 m", safe: true },
    { instruction: "Turn right onto Victory Playground Approach Way", distance: "250 m", safe: true },
    { instruction: "Arrive at GHMC Indoor Stadium & Relief Hub Entrance on the right", distance: "100 m", safe: true }
  ];

  return (
    <div id="evacuation-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Evacuation & High-Ground Shelters
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Corridor Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated evacuation solver avoiding inundated subways, causeways, and active river surge corridors.
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Need Rescue (SOS)</span>
        </button>
      </div>

      {/* Route Summary Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider opacity-80">
              Optimal Safe Evacuation Path
            </div>
            <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <span>{selectedZone.name}</span>
              <ArrowRight className="w-5 h-5" />
              <span>{activeShelter.name}</span>
            </h3>
            <p className="text-xs opacity-90">
              Bypasses Chaderghat causeway and Moosarambagh flash flood choke points.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-xs p-3 rounded-xl shrink-0 text-center font-mono">
            <div>
              <span className="text-[10px] uppercase opacity-70 block">Distance</span>
              <span className="text-xl font-black">{activeShelter.distanceKm} km</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] uppercase opacity-70 block">Walking Time</span>
              <span className="text-xl font-black flex items-center gap-1 justify-center">
                <Footprints className="w-4 h-4" />
                <span>16m</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <span className="text-[10px] uppercase opacity-70 block">Vehicle</span>
              <span className="text-xl font-black flex items-center gap-1 justify-center">
                <Car className="w-4 h-4" />
                <span>6m</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Turn-by-Turn Steps (5 cols) + Shelter Selection Cards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Turn-by-Turn Steps */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Safe Navigation Steps</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              VERIFIED SAFE
            </span>
          </div>

          <div className="space-y-3">
            {turnSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  step.alert
                    ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 text-red-800 dark:text-red-300 font-bold"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200"
                }`}
              >
                {step.alert ? (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                )}
                <div className="flex-1">
                  <div>{step.instruction}</div>
                  {step.distance !== "0 m" && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Distance: {step.distance}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Flooded Road Alert Box */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Closed Roads to Strictly Avoid:</span>
            </div>
            <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
              <li>Chaderghat Causeway (Submerged 1.45m)</li>
              <li>Moosarambagh Low-Level Bridge (Police Barricaded)</li>
              <li>Begumpet Subway (Electrical feeder shut down)</li>
            </ul>
          </div>
        </div>

        {/* Shelter Selection List */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Relief Shelters in {selectedZone.district}
              </h3>
              <p className="text-xs text-slate-500">Equipped with dry rations, medical desks, and backup power</p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "ALL"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("AVAILABLE")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "AVAILABLE"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                High Slots
              </button>
              <button
                onClick={() => setFilterType("ACCESSIBLE")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterType === "ACCESSIBLE"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Accessible
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredShelters.map(shelter => {
              const isSelected = shelter.id === selectedShelterId;
              const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);

              return (
                <div
                  key={shelter.id}
                  onClick={() => setSelectedShelterId(shelter.id)}
                  id={`shelter-card-${shelter.id}`}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {shelter.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white font-bold">
                            SELECTED DESTINATION
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {shelter.address} • <span className="font-semibold text-emerald-600 dark:text-emerald-400">{shelter.distanceKm} km away</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${shelter.contact}`}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-200 shrink-0 self-start"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{shelter.contact}</span>
                    </a>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Occupancy: {shelter.currentOccupancy} / {shelter.capacity} people</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{shelter.availableSlots} Slots Open</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occupancyPct > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Chips */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {shelter.facilities.map((fac, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
