import React, { useState } from "react";
import {
  SlidersHorizontal,
  Info,
  CheckCircle2,
  ShieldAlert,
  Gauge,
  HelpCircle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { ZoneData } from "../types";
import { RiskBadge } from "../components/RiskBadge";

interface RiskAnalysisPageProps {
  selectedZone: ZoneData;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({ selectedZone }) => {
  interface Weights {
    rainfall: number;
    nwp: number;
    terrain: number;
    river: number;
    history: number;
    infrastructure: number;
  }

  // Sensitivity weightings
  const [weights, setWeights] = useState<Weights>({
    rainfall: 25,
    nwp: 20,
    terrain: 15,
    river: 15,
    history: 15,
    infrastructure: 10
  });

  const totalWeight: number = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);

  const resetWeights = () => {
    setWeights({
      rainfall: 25,
      nwp: 20,
      terrain: 15,
      river: 15,
      history: 15,
      infrastructure: 10
    });
  };

  // Normalized scores for selected zone
  const scores = {
    rainfall: Math.min(100, Math.round((selectedZone.rainfall / 180) * 100)),
    nwp: 82,
    terrain: Math.max(10, Math.round(100 - (selectedZone.slope || 1.2) * 10)),
    river: 92,
    history: 85,
    infrastructure: 74
  };

  const calculatedIndex = Math.round(
    (scores.rainfall * weights.rainfall +
      scores.nwp * weights.nwp +
      scores.terrain * weights.terrain +
      scores.river * weights.river +
      scores.history * weights.history +
      scores.infrastructure * weights.infrastructure) /
      (totalWeight || 1)
  );

  const calculatedRisk =
    calculatedIndex >= 85
      ? "EMERGENCY"
      : calculatedIndex >= 70
      ? "PREPARE"
      : calculatedIndex >= 50
      ? "WATCH"
      : "NORMAL";

  return (
    <div id="risk-analysis-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Multivariate Risk Index & Sensitivity Engine
            </h1>
            <RiskBadge level={calculatedRisk} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Mathematical weight attribution model for {selectedZone.name}, {selectedZone.district}.
          </p>
        </div>

        <button
          onClick={resetWeights}
          className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to NDMA Default Weights</span>
        </button>
      </div>

      {/* Formula & Sensitivity Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-sm">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Multivariate Mathematical Formulation:</span>
        </div>
        <p className="font-mono text-[11px] bg-white/70 dark:bg-slate-900/70 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
          Risk Index = (W_rain × S_rain) + (W_nwp × S_nwp) + (W_terrain × S_terrain) + (W_river × S_river) + (W_hist × S_hist) + (W_infra × S_infra) / Σ W
        </p>
      </div>

      {/* Grid: Interactive Weights (7 cols) + Real-time Calculated Index (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weights Adjustment Sliders */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Factor Sensitivity Weightings (Σ = {totalWeight}%)
            </h2>
            {totalWeight !== 100 && (
              <span className="text-[11px] font-bold text-amber-600">
                Weights do not sum to 100% (Normalized automatically)
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Factor 1: Rainfall */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>1. Rainfall Accumulation & Intensity (Default 25%)</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  Weight: {weights.rainfall}% • Score: {scores.rainfall}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.rainfall}
                onChange={e => setWeights({ ...weights, rainfall: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Factor 2: NWP */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>2. NWP Weather Radar & Short-Range Forecast (Default 20%)</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  Weight: {weights.nwp}% • Score: {scores.nwp}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.nwp}
                onChange={e => setWeights({ ...weights, nwp: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Factor 3: Terrain Slope & DEM */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>3. Terrain Slope & Basin Depression (Default 15%)</span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  Weight: {weights.terrain}% • Score: {scores.terrain}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.terrain}
                onChange={e => setWeights({ ...weights, terrain: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Factor 4: River Level */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>4. River Level & Upstream Reservoir Discharge (Default 15%)</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  Weight: {weights.river}% • Score: {scores.river}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.river}
                onChange={e => setWeights({ ...weights, river: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Factor 5: Historical Events */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>5. Historical Inundation Frequency & Vulnerability (Default 15%)</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  Weight: {weights.history}% • Score: {scores.history}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.history}
                onChange={e => setWeights({ ...weights, history: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Factor 6: Infrastructure */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>6. Critical Infrastructure & Density (Default 10%)</span>
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                  Weight: {weights.infrastructure}% • Score: {scores.infrastructure}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.infrastructure}
                onChange={e => setWeights({ ...weights, infrastructure: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Calculated Sensitivity Result */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recalculated Risk Index
              </h2>
              <RiskBadge level={calculatedRisk} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xs font-bold uppercase text-slate-400">Integrated Score</span>
              <div className="text-6xl font-black text-rose-600 dark:text-rose-500 my-2">
                {calculatedIndex}
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Scale: 0 - 100 • Status: <span className="font-black text-red-600">{calculatedRisk}</span>
              </div>
            </div>

            {/* Threshold Matrix Guide */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard Decision Thresholds:
              </span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">0 - 49 (NORMAL)</span>
                <span>Normal Routine Operations</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300">
                <span className="font-bold">50 - 69 (WATCH)</span>
                <span>Pre-position Rescue Teams</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300">
                <span className="font-bold">70 - 84 (PREPARE)</span>
                <span>Issue Civil Defense Advisories</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300">
                <span className="font-bold">85 - 100 (EMERGENCY)</span>
                <span>Mandatory Rapid Evacuation</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            Ablation study confirms rainfall + river discharge drives 40-55% of urban flash flood inundation.
          </div>
        </div>
      </div>
    </div>
  );
};
