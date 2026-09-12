import React, { useState, useEffect } from "react";
import { DatasetItem, OfficialDataSource } from "../types";
import {
  fetchDatasets,
  fetchDataSources,
  toggleDatasetTraining,
  deleteDatasetApi
} from "../services/api";
import { DataOverviewCards } from "../components/data/DataOverviewCards";
import { DataSourcesGrid } from "../components/data/DataSourcesGrid";
import { DatasetLibraryTable } from "../components/data/DatasetLibraryTable";
import { DatasetUploadModal } from "../components/data/DatasetUploadModal";
import { DatasetDetailDrawer } from "../components/data/DatasetDetailDrawer";
import { DataPipelineFlow } from "../components/data/DataPipelineFlow";
import { JudgeExplanationCard } from "../components/data/JudgeExplanationCard";
import {
  Database,
  UploadCloud,
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

export const DataPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [sources, setSources] = useState<OfficialDataSource[]>([]);
  const [summary, setSummary] = useState({
    totalDatasets: 0,
    officialDatasets: 0,
    liveSources: 0,
    demoDatasets: 0,
    processedDatasets: 0,
    validatedDatasets: 0,
    trainingReady: 0,
    trainingSelected: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspectedDataset, setInspectedDataset] = useState<DatasetItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Deletion confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Active section view filter
  const [activeSection, setActiveSection] = useState<"all" | "library" | "sources" | "pipeline">("all");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [dsData, srcData] = await Promise.all([
        fetchDatasets(),
        fetchDataSources()
      ]);

      if (dsData?.datasets) {
        setDatasets(dsData.datasets);
      }
      if (dsData?.summary) {
        setSummary(dsData.summary);
      }
      if (srcData?.sources) {
        setSources(srcData.sources);
      }
    } catch (err) {
      console.error("Error loading data console state:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  const handleInspectDataset = (dataset: DatasetItem) => {
    setInspectedDataset(dataset);
    setIsDrawerOpen(true);
  };

  const handleToggleTraining = async (id: string, current: boolean) => {
    try {
      const res = await toggleDatasetTraining(id, !current);
      if (res.dataset) {
        setDatasets(prev => prev.map(d => (d.id === id ? res.dataset : d)));
        setSummary(prev => ({
          ...prev,
          trainingSelected: prev.trainingSelected + (!current ? 1 : -1)
        }));
      }
    } catch (err: any) {
      alert(err.message || "Failed to update training selection.");
    }
  };

  const handlePreprocessRequest = (dataset: DatasetItem) => {
    setInspectedDataset(dataset);
    setIsDrawerOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDatasetApi(deleteConfirmId);
      setDatasets(prev => prev.filter(d => d.id !== deleteConfirmId));
      if (inspectedDataset?.id === deleteConfirmId) {
        setIsDrawerOpen(false);
        setInspectedDataset(null);
      }
      setDeleteConfirmId(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || "Failed to delete dataset.");
    }
  };

  const handleDatasetUpdated = (updated: DatasetItem) => {
    setDatasets(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    setInspectedDataset(updated);
  };

  const handleUploadSuccess = (newDataset: DatasetItem) => {
    setDatasets(prev => [newDataset, ...prev]);
    loadAllData();
    setInspectedDataset(newDataset);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Banner: Clear separation of connected and unavailable sources */}
      <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Data integration status
              </h1>
              <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                Official feeds not connected
              </span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-1 leading-relaxed max-w-3xl">
              Official telemetry feeds (IMD, NASA GPM, ISRO Bhuvan, CWC) require agency credentials and remain explicitly <strong>NOT CONNECTED</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Dataset</span>
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            Dataset & Telemetry Management Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized repository for meteorological series, radar rasters, DEM elevation, and ML training pipelines.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setActiveSection("all")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSection === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Views
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("library")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSection === "library"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Dataset Library ({datasets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("sources")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSection === "sources"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Official Sources (8)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("pipeline")}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSection === "pipeline"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Pipeline Flow
          </button>
        </div>
      </div>

      {/* 1. Repository Metrics Overview Cards */}
      {(activeSection === "all" || activeSection === "library") && (
        <DataOverviewCards summary={summary} isLoading={isLoading} />
      )}

      {/* 2. Educational / Judge Architecture Card */}
      {activeSection === "all" && <JudgeExplanationCard />}

      {/* 3. Pipeline Flow Visualization */}
      {(activeSection === "all" || activeSection === "pipeline") && (
        <DataPipelineFlow />
      )}

      {/* 4. Dataset Library Section */}
      {(activeSection === "all" || activeSection === "library") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-500" />
              Repository Datasets
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {datasets.length} files cataloged
            </span>
          </div>

          <DatasetLibraryTable
            datasets={datasets}
            onInspect={handleInspectDataset}
            onToggleTraining={handleToggleTraining}
            onPreprocessRequest={handlePreprocessRequest}
            onDeleteRequest={id => setDeleteConfirmId(id)}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        </div>
      )}

      {/* 5. Official Earth Observation & Meteorological Sources Section */}
      {(activeSection === "all" || activeSection === "sources") && (
        <DataSourcesGrid sources={sources} />
      )}

      {/* Upload Modal */}
      <DatasetUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Details & Preview Drawer */}
      <DatasetDetailDrawer
        dataset={inspectedDataset}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDatasetUpdated={handleDatasetUpdated}
        onDeleteRequest={id => setDeleteConfirmId(id)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/50">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove this dataset from the repository? Associated validation audits and versions will be removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
