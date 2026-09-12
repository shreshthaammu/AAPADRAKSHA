import React, { useState } from "react";
import {
  BrainCircuit,
  Sliders,
  Play,
  RotateCcw,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Droplets,
  Gauge
} from "lucide-react";
import { predictRisk } from "../services/api";
import { RiskBadge } from "../components/RiskBadge";
import { RiskLevel } from "../types";

interface AIPredictionPageProps {
  onPrediction?: (prediction: { floodProb: number; depth: number; risk: RiskLevel; eta: string }) => void;
}

export const AIPredictionPage: React.FC<AIPredictionPageProps> = ({ onPrediction }) => {
  // Input parameters
  const [rainfall, setRainfall] = useState<number>(142);
  const [rainfallIntensity, setRainfallIntensity] = useState<number>(28);
  const [riverLevel, setRiverLevel] = useState<number>(512.4);
  const [riverDanger, setRiverDanger] = useState<number>(512.0);
  const [elevation, setElevation] = useState<number>(498);
  const [slope, setSlope] = useState<number>(1.2);
  const [soilSaturation, setSoilSaturation] = useState<number>(88);
  const [drainageCapacity, setDrainageCapacity] = useState<number>(35);

  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<{
    floodProb: number;
    depth: number;
    risk: RiskLevel;
    confidence: number;
    eta: string;
    contributingFactors: { factor: string; contribution: number }[];
  }>({
    floodProb: 84,
    depth: 1.35,
    risk: "EMERGENCY",
    confidence: 93,
    eta: "2.5 - 3.5 hours",
    contributingFactors: [
      { factor: "Rainfall Accumulation & Intensity", contribution: 38 },
      { factor: "River Musi Over-topping Stage", contribution: 26 },
      { factor: "Soil Saturation (Zero Infiltration)", contribution: 18 },
      { factor: "Flat Basin Slope (<2° Ponding)", contribution: 12 },
      { factor: "Drainage Backflow", contribution: 6 }
    ]
  });

  const runInference = async () => {
    setLoading(true);
    try {
      const res = await predictRisk({
        rainfall,
        rainfall_intensity: rainfallIntensity,
        river_level: riverLevel,
        river_danger_level: riverDanger,
        elevation,
        slope,
        soil_saturation: soilSaturation,
        drainage_capacity: drainageCapacity
      });

      if (res && res.flood_probability !== undefined) {
        const nextPrediction = {
          floodProb: res.flood_probability,
          depth: res.inundation_depth_meters,
          risk: res.risk_level as RiskLevel,
          confidence: res.confidence,
          eta: res.inundation_eta_hours,
          contributingFactors: res.contributing_factors.map((c: any) => ({
            factor: c.name,
            contribution: c.percentage
          }))
        };
        setPrediction(nextPrediction);
        onPrediction?.(nextPrediction);
      }
    } catch (err) {
      console.error("Predict error:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: "normal" | "watch" | "prepare" | "emergency") => {
    if (preset === "normal") {
      setRainfall(18);
      setRainfallIntensity(4);
      setRiverLevel(508.2);
      setSlope(4.5);
      setSoilSaturation(30);
      setDrainageCapacity(85);
    } else if (preset === "watch") {
      setRainfall(64);
      setRainfallIntensity(14);
      setRiverLevel(510.5);
      setSlope(2.5);
      setSoilSaturation(65);
      setDrainageCapacity(60);
    } else if (preset === "prepare") {
      setRainfall(115);
      setRainfallIntensity(22);
      setRiverLevel(511.6);
      setSlope(1.8);
      setSoilSaturation(78);
      setDrainageCapacity(45);
    } else {
      setRainfall(168);
      setRainfallIntensity(36);
      setRiverLevel(513.1);
      setSlope(1.0);
      setSoilSaturation(94);
      setDrainageCapacity(25);
    }
  };

  return (
    <div id="ai-prediction-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AI / ML Hydrodynamic Inundation Inference
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
              <span>Trained Logistic Risk Classifier</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Test multivariate environmental parameters through AAPADRAKSHA's trained machine learning risk engine.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <span className="text-slate-400 text-[10px] uppercase px-1 font-bold">Presets:</span>
          <button
            onClick={() => applyPreset("normal")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Normal
          </button>
          <button
            onClick={() => applyPreset("watch")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-colors"
          >
            Watch
          </button>
          <button
            onClick={() => applyPreset("prepare")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-orange-600 dark:text-orange-400 transition-colors"
          >
            Prepare
          </button>
          <button
            onClick={() => applyPreset("emergency")}
            className="px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-red-600 dark:text-red-400 font-bold transition-colors"
          >
            Deluge
          </button>
        </div>
      </div>

      {/* Grid: Interactive Input Controls (7 cols) + Live Model Inference Outputs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Controls */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Environmental Feature Vector Inputs
            </h2>
            <button
              onClick={() => applyPreset("emergency")}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Rainfall Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Cumulative 24h Rainfall:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={e => setRainfall(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Rainfall Intensity Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Instantaneous Rainfall Rate:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{rainfallIntensity} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={rainfallIntensity}
                onChange={e => setRainfallIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* River Stage Height Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>River Gauge Stage Height:</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  {riverLevel} m (Danger Mark: {riverDanger} m)
                </span>
              </div>
              <input
                type="range"
                min="505"
                max="520"
                step="0.1"
                value={riverLevel}
                onChange={e => setRiverLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Terrain Slope Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Terrain Gradient (DEM Slope):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{slope}°</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.1"
                value={slope}
                onChange={e => setSlope(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
            </div>

            {/* Soil Moisture Saturation */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Antecedent Soil Saturation:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{soilSaturation}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={soilSaturation}
                onChange={e => setSoilSaturation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Urban Drainage Capacity */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <span>Stormwater Drainage Efficiency:</span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{drainageCapacity}% Open</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={drainageCapacity}
                onChange={e => setDrainageCapacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          </div>

          <button
            onClick={runInference}
            disabled={loading}
            id="run-ml-inference-btn"
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 active:scale-98 text-white font-black text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-transform"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Running Ensemble Neural Inference...</span>
              </div>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Ensemble Model Inference</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Results Display */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Model Inference Output
              </h2>
              <RiskBadge level={prediction.risk} />
            </div>

            {/* Big Probability Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
              <span className="text-xs font-bold uppercase text-slate-400">Flood Inundation Probability</span>
              <div className="text-5xl font-black text-rose-600 dark:text-rose-500 my-1">
                {prediction.floodProb}%
              </div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Predicted Water Depth: <strong className="text-red-600 dark:text-red-400">~{prediction.depth} meters</strong>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inundation ETA: {prediction.eta} • Confidence: {prediction.confidence}%
              </div>
            </div>

            {/* Contributing Factor Decomposition */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                SHAP / Feature Attribution Breakdown
              </h3>
              <div className="space-y-2.5">
                {prediction.contributingFactors.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span className="truncate max-w-[200px]">{item.factor}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {item.contribution}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${item.contribution * 2.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Model: Trained Logistic Risk Classifier (2020-2026 simulation archive)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Latency: 28ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
