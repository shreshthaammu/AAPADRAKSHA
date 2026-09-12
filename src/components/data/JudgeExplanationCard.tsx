import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert, Award, FileSpreadsheet, Lock } from "lucide-react";

export const JudgeExplanationCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900/40 p-4 transition-all shadow-xs">
      <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Why Data Quality & Provenance Matter in Flood Intelligence
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                Evaluation & Architecture Guide
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Strict boundary separation between official observations, live feeds, and synthetic calibration sets.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Collapse guide" : "Expand guide"}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>1. Synthetic Demo Transparency</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Current bundled sample datasets are explicitly labeled <strong className="text-amber-600 dark:text-amber-400 font-mono">DEMO / SYNTHETIC</strong>. AAPADRAKSHA never disguises mock values as official government data.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>2. Official Institutional Access</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              IMD, CWC, and NASA real-time telemetry APIs require government credentials and institutional tokens. The system defaults to <strong className="font-mono text-slate-800 dark:text-slate-200">NOT CONNECTED</strong> until authenticated.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-500" />
              <span>3. Zero Tolerance for Bad Training Data</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Unvalidated or contaminated datasets produce dangerous false alarms or missed inundation zones. Datasets with critical validation errors are blocked from ML training.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>4. Data Lineage & Provenance</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Every ML prediction result in AAPADRAKSHA is traceable back to its underlying dataset version, timestamp, preprocessing recipe, and validation audit log.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
