import React from "react";
import { Database, ShieldAlert, Radio, FileCode2, CheckCircle2, Cpu, AlertTriangle } from "lucide-react";

interface SummaryData {
  totalDatasets: number;
  officialDatasets: number;
  liveSources: number;
  demoDatasets: number;
  processedDatasets: number;
  validatedDatasets: number;
  trainingReady: number;
  trainingSelected: number;
}

interface Props {
  summary: SummaryData;
  isLoading?: boolean;
}

export const DataOverviewCards: React.FC<Props> = ({ summary, isLoading = false }) => {
  const cards = [
    {
      title: "Total Datasets",
      value: summary.totalDatasets,
      sub: "Registered in repository",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50"
    },
    {
      title: "Official Datasets",
      value: summary.officialDatasets,
      sub: summary.officialDatasets === 0 ? "Official data not connected" : "Verified agency sources",
      icon: ShieldAlert,
      color: summary.officialDatasets > 0 ? "text-emerald-500" : "text-slate-400",
      bg: summary.officialDatasets > 0
        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50"
        : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
      badge: summary.officialDatasets === 0 ? "None Connected" : "Official"
    },
    {
      title: "Live Ingest Feeds",
      value: summary.liveSources,
      sub: summary.liveSources === 0 ? "No active telemetry feeds" : "Streaming telemetry",
      icon: Radio,
      color: summary.liveSources > 0 ? "text-cyan-500" : "text-slate-400",
      bg: summary.liveSources > 0
        ? "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/50"
        : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
      badge: summary.liveSources === 0 ? "0 Feeds" : "Live"
    },
    {
      title: "Imported Sample Data",
      value: summary.demoDatasets,
      sub: "Sample calibration sets",
      icon: FileCode2,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50",
      badge: "Sample"
    },
    {
      title: "Validated Schemas",
      value: summary.validatedDatasets,
      sub: "Passed integrity verification",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50"
    },
    {
      title: "Training Active",
      value: summary.trainingSelected,
      sub: `${summary.trainingReady} datasets pipeline-ready`,
      icon: Cpu,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50"
    }
  ];

  return (
    <section aria-labelledby="data-overview-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="data-overview-heading" className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          Repository & Telemetry Overview
        </h2>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Real-time Catalog Metrics
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${card.bg} relative flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color} shrink-0`} />
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                  {isLoading ? "-" : card.value}
                </span>
                {card.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    card.badge === "Sample"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                      : card.badge === "None Connected"
                      ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                  }`}>
                    {card.badge}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {card.sub}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
