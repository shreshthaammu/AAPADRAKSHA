import React, { useEffect, useState } from "react";
import {
  Cpu,
  Database,
  Award,
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Code2,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { fetchModelBenchmarks } from "../services/api";

export const ModelArchitecturePage: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    fetchModelBenchmarks().then(setModels).catch(() => setModels([]));
  }, []);

  const datasets = [
    {
      file: "flood_history_2020_2026.csv",
      path: "/api/datasets/connected.csv",
      description: "Connected representative historical archive used by the active classifier.",
      records: "50,000 rows",
      features: "timestamp, rainfall_24h_mm, river_level_m, temperature_c, humidity_pct, flood_probability_pct, water_depth_m"
    }
  ];

  return (
    <div id="model-architecture-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Machine Learning Architecture & Benchmark Results
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Core ML Architecture
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Metrics loaded from the active model registry and held-out evaluation artifact.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Active registry:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
            {models[0]?.status || "Loading model registry"}
          </span>
        </div>
      </div>

      {/* Benchmark Models Comparison Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Model Performance Benchmarking Matrix
            </h3>
            <p className="text-xs text-slate-500">Metrics are calculated from the persisted time-aware validation/test split.</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
            {models.length ? "Registry loaded" : "Loading"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3 pl-2">Model Architecture</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Precision</th>
                <th className="pb-3">Recall</th>
                <th className="pb-3">F1 Score</th>
                <th className="pb-3">ROC-AUC</th>
                <th className="pb-3">Water Depth MAE</th>
                <th className="pb-3 pr-2">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {models.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    m.best ? "bg-purple-50/50 dark:bg-purple-950/20 font-bold" : ""
                  }`}
                >
                  <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {m.best && <Award className="w-4 h-4 text-purple-600 shrink-0" />}
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3 text-slate-500">{m.type}</td>
                  <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{m.testMetrics?.accuracy ? `${(m.testMetrics.accuracy * 100).toFixed(1)}%` : "Not evaluated"}</td>
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-400">{m.testMetrics?.precision ? `${(m.testMetrics.precision * 100).toFixed(1)}%` : "N/A"}</td>
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-400">{m.testMetrics?.recall ? `${(m.testMetrics.recall * 100).toFixed(1)}%` : "N/A"}</td>
                  <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{m.testMetrics?.f1 ? `${(m.testMetrics.f1 * 100).toFixed(1)}%` : "N/A"}</td>
                  <td className="py-3 font-mono font-bold text-purple-600 dark:text-purple-400">Not calculated</td>
                  <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400">Separated depth approximation</td>
                  <td className="py-3 pr-2 font-mono text-slate-500">Runtime measured per request</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Innovation Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Active Logistic Risk Classifier
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Trained on the connected historical archive using normalized rainfall, forecast, river, terrain, soil, and drainage features.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Separate inundation approximation
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Water depth is estimated separately from rainfall excess, terrain concentration, and river overflow. A full 2D hydrodynamic solver is not connected.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 w-fit">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Explicit fallback path
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            If the trained artifact cannot load, the deterministic risk engine is used and the response labels that fallback explicitly.
          </p>
        </div>
      </div>

      {/* Standardized Datasets Cards (Section 17 & 48) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Standardized Project Datasets (/data/)</span>
            </h3>
            <p className="text-xs text-slate-500">Open training files and evaluation metrics for the prediction pipeline</p>
          </div>
          <span className="text-xs font-mono text-slate-400">6 Standardized Files</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {datasets.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {d.file}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono font-bold">
                  {d.records}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                {d.description}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 truncate">
                Features: {d.features}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
