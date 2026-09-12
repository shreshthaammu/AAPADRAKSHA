import React from "react";
import { GitBranch, ShieldCheck, CheckCircle2, Sparkles, Cpu, Radio, AlertOctagon, ArrowRight } from "lucide-react";

export const DataPipelineFlow: React.FC = () => {
  const stages = [
    {
      step: 1,
      title: "Data Acquisition",
      desc: "API / File Ingest",
      status: "ACTIVE (DEMO + UPLOAD)",
      implemented: true,
      note: "CSV/NetCDF/GeoTIFF upload & local sample sets",
      icon: GitBranch
    },
    {
      step: 2,
      title: "Schema Validation",
      desc: "Integrity & Range Audit",
      status: "ACTIVE (8 CHECKS)",
      implemented: true,
      note: "Coordinates, timestamp, headers & outlier bounds",
      icon: ShieldCheck
    },
    {
      step: 3,
      title: "Cleaning & Impute",
      desc: "Automated Preprocessing",
      status: "ACTIVE",
      implemented: true,
      note: "Median/mean imputation & duplicate deduplication",
      icon: Sparkles
    },
    {
      step: 4,
      title: "Feature Engineering",
      desc: "Hydrological Indices",
      status: "ACTIVE",
      implemented: true,
      note: "API index, rolling 3h/6h/24h intensity & TWI",
      icon: CheckCircle2
    },
    {
      step: 5,
      title: "Model Training",
      desc: "Trained logistic classifier & fallback risk engine",
      status: "TRAINING READY",
      implemented: true,
      note: "Curated dataset partitioning (70% train / 15% val / 15% test)",
      icon: Cpu
    },
    {
      step: 6,
      title: "Early Warning",
      desc: "Inundation Inference",
      status: "ACTIVE ENGINE",
      implemented: true,
      note: "Real-time flood depth prediction & evacuation alerts",
      icon: AlertOctagon
    }
  ];

  return (
    <section aria-labelledby="pipeline-flow-heading" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 id="pipeline-flow-heading" className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-500" />
            End-to-End Hydrological Data Pipeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pipeline architecture ensuring data traceability from raw telemetry to civil protection warnings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational Pipeline Active
          </span>
        </div>
      </div>

      {/* Grid of pipeline stages */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="relative p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    STAGE 0{stage.step}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </div>

                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                  {stage.title}
                </h4>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
                  {stage.desc}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200/80 dark:border-slate-800 leading-tight">
                  {stage.note}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    {stage.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
