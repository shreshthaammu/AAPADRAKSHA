import React, { useState, useEffect } from "react";
import { DatasetItem } from "../../types";
import {
  X,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  History,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Trash2,
  Play,
  RotateCcw,
  Layers,
  Database,
  Calendar,
  MapPin,
  Maximize2
} from "lucide-react";
import {
  fetchDatasetPreview,
  validateDataset,
  preprocessDataset,
  toggleDatasetTraining
} from "../../services/api";

interface Props {
  dataset: DatasetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDatasetUpdated: (updated: DatasetItem) => void;
  onDeleteRequest: (id: string) => void;
}

export const DatasetDetailDrawer: React.FC<Props> = ({
  dataset,
  isOpen,
  onClose,
  onDatasetUpdated,
  onDeleteRequest
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "preview" | "validation" | "preprocess" | "versions"
  >("overview");

  // Preview state
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewRowsLimit, setPreviewRowsLimit] = useState(30);

  // Preprocessing state
  const [handleMissingMethod, setHandleMissingMethod] = useState<"median" | "mean" | "forward_fill">("median");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preprocessFeedback, setPreprocessFeedback] = useState<string | null>(null);

  // Validation state
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (dataset && isOpen) {
      loadPreview(dataset.id, previewRowsLimit);
      setPreprocessFeedback(null);
    }
  }, [dataset?.id, isOpen, previewRowsLimit]);

  const loadPreview = async (id: string, rows: number) => {
    setIsLoadingPreview(true);
    try {
      const data = await fetchDatasetPreview(id, rows);
      setPreviewData(data);
    } catch (err) {
      console.error("Preview load error:", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  if (!isOpen || !dataset) return null;

  const handleTriggerValidation = async () => {
    setIsValidating(true);
    try {
      const res = await validateDataset(dataset.id);
      if (res.dataset) {
        onDatasetUpdated(res.dataset);
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRunPreprocessing = async () => {
    setIsProcessing(true);
    setPreprocessFeedback(null);
    try {
      const res = await preprocessDataset(dataset.id, {
        handleMissing: handleMissingMethod,
        removeDuplicates
      });
      if (res.dataset) {
        setPreprocessFeedback("Dataset successfully cleaned and standardized!");
        onDatasetUpdated(res.dataset);
        loadPreview(res.dataset.id, previewRowsLimit);
      }
    } catch (err: any) {
      setPreprocessFeedback(`Error: ${err.message || "Failed to preprocess dataset"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleTraining = async () => {
    try {
      const res = await toggleDatasetTraining(dataset.id, !dataset.trainingSelected);
      if (res.dataset) {
        onDatasetUpdated(res.dataset);
      }
    } catch (err: any) {
      alert(err.message || "Could not update training selection.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded tracking-wide ${
                dataset.status === "OFFICIAL"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : dataset.status === "PROCESSED"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {dataset.status === "DEMO" ? "DEMO / SYNTHETIC DATA" : dataset.status}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {dataset.category}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {dataset.format}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Ver {dataset.version}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate" title={dataset.displayName}>
              {dataset.displayName}
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
              {dataset.filePath} • {dataset.fileSize} • {dataset.records} records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleTraining}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                dataset.trainingSelected
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dataset.trainingSelected ? "In Training Queue" : "Use for ML Training"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Warning if dataset is DEMO */}
        {dataset.status === "DEMO" && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-medium">
              <strong>DEMO DATASET:</strong> Generated/synthetic calibration data. Do not present as verified IMD or government observational measurements.
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-900 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Overview & Metadata</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "preview"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Data Preview & Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("validation")}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "validation"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Schema Validation ({dataset.validation?.score || 100}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preprocess")}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "preprocess"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cleaning & Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("versions")}
            className={`px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "versions"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version History ({dataset.versions?.length || 1})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW & METADATA */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Dataset Description
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {dataset.description || "No specific description provided."}
                </p>
              </div>

              {/* Spatial, Temporal & Sensor Attributes */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Scientific Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      Spatial Coverage
                    </span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {dataset.spatialCoverage || "Catchment Region"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      Temporal Coverage
                    </span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {dataset.temporalCoverage || "Continuous Epoch"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                    <span className="text-slate-500 text-[11px]">Resolution & Cadence</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {dataset.resolution || "Hourly / Point Sample"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                    <span className="text-slate-500 text-[11px]">Measurement Units</span>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {dataset.units || "SI Metric Standard"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source & Provenance */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Provenance & License
                </h3>
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Source Entity:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{dataset.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">License:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{dataset.license || "Open Academic"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Repository Path:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{dataset.filePath}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Registered At:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {new Date(dataset.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Last Audited:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                      {new Date(dataset.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {dataset.notes && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Validation & Operational Notes
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                    {dataset.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DATA PREVIEW & STATS */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tabular Record Preview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing first {previewData?.rows?.length || 0} of {dataset.records} records
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Rows:</span>
                  {[20, 50, 100].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setPreviewRowsLimit(cnt)}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        previewRowsLimit === cnt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric Column Summary Statistics Cards */}
              {previewData?.columnStats && Object.keys(previewData.columnStats).length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                    Attribute Distributions & Statistics
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {Object.entries(previewData.columnStats).map(([col, stats]: [string, any]) => {
                      if (stats.type !== "numeric") return null;
                      return (
                        <div
                          key={col}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px]"
                        >
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block" title={col}>
                            {col}
                          </span>
                          <div className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                            <div className="flex justify-between">
                              <span>Min:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{stats.min}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Max:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{stats.max}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Mean:</span>
                              <span>{stats.mean}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Median:</span>
                              <span>{stats.median}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Raw preview table */}
              {isLoadingPreview ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Parsing and projecting dataset rows...
                </div>
              ) : previewData?.rows && previewData.rows.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-h-[420px]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 z-10">
                      <tr>
                        <th className="p-2.5 border-b border-slate-300 dark:border-slate-700 w-10 text-center text-[10px] text-slate-400">#</th>
                        {previewData.headers?.map((h: string, idx: number) => (
                          <th
                            key={idx}
                            className="p-2.5 border-b border-slate-300 dark:border-slate-700 font-semibold whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {previewData.rows.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="p-2 text-center text-[10px] text-slate-400 border-r border-slate-100 dark:border-slate-800">
                            {rIdx + 1}
                          </td>
                          {previewData.headers?.map((h: string, cIdx: number) => {
                            const val = row[h];
                            const isNull = val === null || val === undefined || val === "";
                            return (
                              <td
                                key={cIdx}
                                className={`p-2 whitespace-nowrap ${
                                  isNull ? "text-amber-500 italic text-[10px]" : "text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                {isNull ? "NaN" : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  {previewData?.message || "No tabular rows available for direct viewing."}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEMA VALIDATION */}
          {activeTab === "validation" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Integrity Audit Status:
                    <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                      dataset.validation?.status === "PASS"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {dataset.validation?.status || "PASS"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Composite Quality Score: <strong className="font-mono text-slate-900 dark:text-white">{dataset.validation?.score || 100} / 100</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerValidation}
                  disabled={isValidating}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isValidating ? "animate-spin" : ""}`} />
                  <span>{isValidating ? "Auditing..." : "Re-Run Audit"}</span>
                </button>
              </div>

              {/* Validation Checks List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  8-Point Scientific Validation Checks
                </span>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  {(dataset.validation?.checks || []).map((chk, i) => (
                    <div key={i} className="p-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {chk.status === "PASS" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : chk.status === "WARNING" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {chk.name}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {chk.message}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        chk.status === "PASS"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : chk.status === "WARNING"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                      }`}>
                        {chk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREPROCESSING & CLEANING */}
          {activeTab === "preprocess" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Automated Preprocessing & Imputation Recipe
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Generate an immutable PROCESSED version while preserving the pristine raw source dataset.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Missing Value Imputation Strategy
                    </label>
                    <select
                      value={handleMissingMethod}
                      onChange={e => setHandleMissingMethod(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="median">Median Imputation (Recommended for rainfall)</option>
                      <option value="mean">Mean Imputation (Atmospheric)</option>
                      <option value="forward_fill">Forward Fill (Temporal gauge series)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="dedup-check"
                      checked={removeDuplicates}
                      onChange={e => setRemoveDuplicates(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dedup-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Deduplicate identical sensor timestamps
                    </label>
                  </div>
                </div>

                {preprocessFeedback && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300">
                    {preprocessFeedback}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRunPreprocessing}
                    disabled={isProcessing}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                    <span>{isProcessing ? "Cleaning Dataset..." : "Execute Preprocessing Pipeline"}</span>
                  </button>
                </div>
              </div>

              {/* Preprocessing history log */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Applied Transformations Log
                </span>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  {(dataset.preprocessing?.steps || ["Raw Ingest"]).map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VERSION HISTORY */}
          {activeTab === "versions" && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Provenance Timeline & Version Archives
              </span>

              <div className="space-y-2">
                {(dataset.versions || []).map((ver, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-[11px]">
                          {ver.version}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(ver.createdAt).toLocaleString()}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {ver.status}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs">
                        {ver.changes}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">
                        Created by: {ver.createdBy} • Records: {ver.records} • Size: {ver.size}
                      </p>
                    </div>

                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
                      Archived
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between shrink-0">
          <div>
            {!dataset.isSystemSample && (
              <button
                type="button"
                onClick={() => onDeleteRequest(dataset.id)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Dataset</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
