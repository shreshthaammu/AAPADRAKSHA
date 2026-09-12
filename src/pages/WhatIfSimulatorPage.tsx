import React, { useState } from "react";
import {
  SlidersHorizontal,
  CloudRain,
  Clock,
  Waves,
  Mountain,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  Building,
  ArrowRight
} from "lucide-react";
import { RiskBadge } from "../components/RiskBadge";

export const WhatIfSimulatorPage: React.FC = () => {
  const [rainfall, setRainfall] = useState(140);
  const [duration, setDuration] = useState(4);
  const [riverLevel, setRiverLevel] = useState(512.2);
  const [slope, setSlope] = useState(1.5);
  const [soilSaturation, setSoilSaturation] = useState(85);

  // Dynamic calculations based on simulated physics
  const rainfallRate = Math.round(rainfall / duration);
  const depthEstimate = Number(
    Math.max(
      0.1,
      (rainfall / 100) * 0.75 +
        (riverLevel > 512 ? (riverLevel - 512) * 1.2 : 0) +
        (soilSaturation > 80 ? 0.3 : 0.1) -
        slope * 0.08
    ).toFixed(2)
  );

  const inundatedAreaKm2 = Math.round(depthEstimate * 16.5);
  const exposedPopulation = Math.round(inundatedAreaKm2 * 6800);
  const affectedWards = Math.min(28, Math.max(1, Math.round(depthEstimate * 9)));
  const breachedSubways = depthEstimate > 1.0 ? 4 : depthEstimate > 0.5 ? 2 : 0;

  const simulatedRisk =
    depthEstimate >= 1.2
      ? "EMERGENCY"
      : depthEstimate >= 0.7
      ? "PREPARE"
      : depthEstimate >= 0.3
      ? "WATCH"
      : "NORMAL";

  const applyPreset = (preset: "normal" | "monsoon" | "storm" | "cloudburst") => {
    if (preset === "normal") {
      setRainfall(25);
      setDuration(3);
      setRiverLevel(508.5);
      setSlope(3.5);
      setSoilSaturation(40);
    } else if (preset === "monsoon") {
      setRainfall(85);
      setDuration(6);
      setRiverLevel(510.4);
      setSlope(2.0);
      setSoilSaturation(70);
    } else if (preset === "storm") {
      setRainfall(140);
      setDuration(4);
      setRiverLevel(512.2);
      setSlope(1.5);
      setSoilSaturation(85);
    } else {
      setRainfall(240);
      setDuration(3);
      setRiverLevel(514.5);
      setSlope(1.0);
      setSoilSaturation(96);
    }
  };

  return (
    <div id="what-if-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive "What-If" Scenario Flood Simulator
            </h1>
            <RiskBadge level={simulatedRisk} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate disaster exposure, inundation depths, and infrastructure failure under extreme rainfall scenarios.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <span className="text-slate-400 text-[10px] uppercase px-1 font-bold">Presets:</span>
          <button
            onClick={() => applyPreset("normal")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Normal
          </button>
          <button
            onClick={() => applyPreset("monsoon")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-colors"
          >
            Heavy Monsoon
          </button>
          <button
            onClick={() => applyPreset("storm")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 transition-colors"
          >
            Severe Storm
          </button>
          <button
            onClick={() => applyPreset("cloudburst")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-red-600 dark:text-red-400 font-bold transition-colors"
          >
            Cloudburst
          </button>
        </div>
      </div>

      {/* Grid: Scenario Sliders (7 cols) + Simulated Impact (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Simulated Hydro-Meteorological Forcings
            </h2>
            <button
              onClick={() => applyPreset("storm")}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Scenario</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Rainfall mm */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Total Cumulative Rainfall:</span>
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={rainfall}
                onChange={e => setRainfall(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Storm Duration */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Rainfall Duration & Burst Rate:</span>
                </span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {duration} hours (~{rainfallRate} mm/hr)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* River Level */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-red-500" />
                  <span>River Musi Stage Height:</span>
                </span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  {riverLevel} m (Danger Mark: 512.0m)
                </span>
              </div>
              <input
                type="range"
                min="506"
                max="518"
                step="0.1"
                value={riverLevel}
                onChange={e => setRiverLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Terrain Slope */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-slate-500" />
                  <span>Average Basin Gradient (DEM Slope):</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{slope}°</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.1"
                value={slope}
                onChange={e => setSlope(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
            </div>

            {/* Soil Saturation */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Antecedent Soil Saturation:</span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{soilSaturation}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={soilSaturation}
                onChange={e => setSoilSaturation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Impact Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Disaster Footprint
              </h2>
              <RiskBadge level={simulatedRisk} />
            </div>

            {/* Big Water Depth Display */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xs font-bold uppercase text-slate-400">Peak Inundation Water Depth</span>
              <div className="text-5xl font-black text-blue-600 dark:text-blue-400 my-1">
                ~{depthEstimate} m
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {depthEstimate > 1.2
                  ? "Severe ground-floor inundation. Submerged low-level causeways."
                  : depthEstimate > 0.6
                  ? "Moderate waterlogging. Impassable for light vehicles."
                  : "Localized puddles. Traffic slow, but no major breach."}
              </p>
            </div>

            {/* Secondary Impact Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Submerged Area</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{inundatedAreaKm2} km²</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Population Exposed</span>
                <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                  {exposedPopulation.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Affected Wards</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{affectedWards} Wards</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] font-sans uppercase">Bridges Submerged</span>
                <span className="text-base font-extrabold text-red-600 dark:text-red-400">{breachedSubways} Choke Points</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300">
            <strong>Civil Defense Directive:</strong> Under this scenario, recommend pre-deploying 8 NDRF motorboats and issuing immediate red flash warnings 3 hours prior to peak hydrograph.
          </div>
        </div>
      </div>
    </div>
  );
};
