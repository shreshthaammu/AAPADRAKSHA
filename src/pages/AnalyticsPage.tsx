import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  History,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Award,
  Calendar,
  Layers
} from "lucide-react";
import { fetchAnalyticsData } from "../services/api";

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any | null>(null);

  useEffect(() => {
    fetchAnalyticsData().then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

  const historicalEvents = analytics?.historicalComparison || [];
  const leadTimeImprovements = [
    { label: "Alert Dispatch Latency", before: "Not measured", after: "Unavailable", improvement: "Needs stored alert timestamps" },
    { label: "Inundation Prediction Lead Time", before: "Not measured", after: "Unavailable", improvement: "Needs validated event timestamps" },
    { label: "False Alarm Ratio", before: "Not calculated", after: "Unavailable", improvement: "Needs ground-truth labels" },
    { label: "Population Exposure", before: "Unavailable", after: "Unavailable", improvement: "Not present in archive" }
  ];

  return (
    <div id="analytics-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Historical Disaster Analytics & Response Benchmarks
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {analytics?.connectedDataset ? `${analytics.connectedDataset.totalRows.toLocaleString()} archive rows` : "Loading archive metrics"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Retrospective validation of AAPADRAKSHA against catastrophic Indian monsoon deluges.
          </p>
        </div>
      </div>

      {/* Key Lead Time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leadTimeImprovements.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
              {m.label}
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {m.after}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {m.improvement}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Traditional Systems: <span className="line-through">{m.before}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Retrospective Catastrophic Event Comparison Matrix */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Historical Deluge Benchmark Replay</span>
            </h3>
            <p className="text-xs text-slate-500">
              Calculated from the connected historical archive. Operational lead-time and accuracy metrics require validated event timestamps.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {historicalEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {evt.event}
                  </span>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Mean 24h precipitation: <strong className="text-blue-600 dark:text-blue-400">{evt.rainfall24h} mm</strong> • Maximum depth: <strong className="text-red-600">{evt.maxDepth} m</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Traditional Lead Time</span>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Not measured</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">AAPADRAKSHA Warning</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Archive aggregate</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-[11px] border-t border-slate-200 dark:border-slate-700/60 pt-2 leading-relaxed">
                <strong>Archive-derived impact proxy:</strong> {evt.affectedLakhs === undefined ? "Population exposure data unavailable in current dataset." : `${evt.affectedLakhs} exposure index units; this is not a population count.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
