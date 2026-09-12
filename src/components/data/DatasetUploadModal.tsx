import React, { useState, useRef } from "react";
import { DatasetCategory, DatasetFormat } from "../../types";
import { UploadCloud, FileText, AlertTriangle, CheckCircle2, X, FileCode, Layers, Info } from "lucide-react";
import { uploadDataset } from "../../services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDataset: any) => void;
}

export const DatasetUploadModal: React.FC<Props> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [detectedRowCount, setDetectedRowCount] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Metadata form
  const [displayName, setDisplayName] = useState("");
  const [category, setCategory] = useState<DatasetCategory>("Rainfall");
  const [description, setDescription] = useState("");
  const [sourceOrg, setSourceOrg] = useState("Local User Ingest / Institution");
  const [sourceUrl, setSourceUrl] = useState("");
  const [license, setLicense] = useState("Research / Educational Test License");
  const [temporalCoverage, setTemporalCoverage] = useState("2026 Monsoon Period");
  const [spatialCoverage, setSpatialCoverage] = useState("Catchment Area / Local Basin");
  const [resolution, setResolution] = useState("Hourly / Point Telemetry");
  const [units, setUnits] = useState("Metric (mm, m, °C, hPa)");
  const [notes, setNotes] = useState("Imported for local calibration and verification.");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setFileError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "nc", "tif", "tiff"].includes(ext)) {
      setFileError("Invalid format. Only .csv, .nc, .tif, and .tiff are accepted for scientific ingestion.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError("File exceeds 25MB safety boundary limit.");
      return;
    }

    setSelectedFile(file);
    if (!displayName) {
      setDisplayName(file.name.replace(/\.[^/.]+$/, ""));
    }

    // Auto categorize based on filename hints
    const lower = file.name.toLowerCase();
    if (lower.includes("rain") || lower.includes("precip")) setCategory("Rainfall");
    else if (lower.includes("weather") || lower.includes("meteo") || lower.includes("temp")) setCategory("Weather");
    else if (lower.includes("river") || lower.includes("gauge") || lower.includes("discharge")) setCategory("River");
    else if (lower.includes("dem") || lower.includes("elevation") || lower.includes("terrain") || lower.includes("slope")) setCategory("Elevation");
    else if (lower.includes("flood") || lower.includes("deluge")) setCategory("Flood");
    else if (lower.includes("radar")) setCategory("Radar");
    else if (lower.includes("satellite")) setCategory("Satellite");

    // Read content for CSV inspection
    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = e => {
        const text = (e.target?.result as string) || "";
        setFileContent(text);
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length > 0) {
          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
          setDetectedColumns(headers);
          setDetectedRowCount(Math.max(0, lines.length - 1));
        }
      };
      reader.readAsText(file);
    } else {
      // Binary raster NetCDF / GeoTIFF
      const reader = new FileReader();
      reader.onload = e => {
        const bin = (e.target?.result as string) || "";
        setFileContent(bin);
        setDetectedColumns(["Band 1 (Primary Raster)", "Bounding Box Metadata", "Coordinate Reference System"]);
        setDetectedRowCount(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !fileContent) {
      setFileError("Please select a valid dataset file.");
      return;
    }

    setIsUploading(true);
    setFileError(null);

    try {
      const metadata = {
        displayName: displayName.trim() || selectedFile.name,
        description: description.trim(),
        category,
        source: sourceOrg.trim(),
        sourceUrl: sourceUrl.trim(),
        license: license.trim(),
        temporalCoverage: temporalCoverage.trim(),
        spatialCoverage: spatialCoverage.trim(),
        resolution: resolution.trim(),
        units: units.trim(),
        notes: notes.trim()
      };

      const res = await uploadDataset(selectedFile.name, fileContent, metadata);
      if (res.dataset) {
        onUploadSuccess(res.dataset);
        onClose();
      }
    } catch (err: any) {
      setFileError(err.message || "Failed to upload and register dataset.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              Dataset Ingestion & Metadata Registration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Import observational series, radar grids, or digital elevation matrices.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close upload modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on Official vs Demo marking */}
        <div className="mx-4 sm:mx-5 mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Security & Compliance Policy:</strong> Uploaded datasets are automatically tagged as <span className="font-mono font-bold bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">DEMO / USER IMPORT</span>. Files cannot be designated as OFFICIAL observations without institutional cryptographic verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Dataset File (.csv, .nc, .tif)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                  : selectedFile
                  ? "border-emerald-400 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-950/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.nc,.tif,.tiff"
                onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Detected: {detectedRowCount} records, {detectedColumns.length} fields
                  </p>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setFileContent("");
                      setDetectedColumns([]);
                      setDetectedRowCount(0);
                    }}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline inline-block mt-1"
                  >
                    Remove and choose another
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Drag and drop your file here, or <span className="text-blue-600 dark:text-blue-400 font-semibold">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Supported: CSV (tabular gauge/weather), NetCDF (NWP grid), GeoTIFF (DEM/elevation) • Max 25MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detected schema chips */}
          {detectedColumns.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Detected Schema Columns ({detectedColumns.length}):
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {detectedColumns.map((col, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {fileError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Metadata Fields Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Dataset Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Hyderabad AWS Gauge Series 2026"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as DatasetCategory)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Rainfall">Rainfall (AWS / Rain Gauges)</option>
                <option value="Weather">Weather (Surface Observations)</option>
                <option value="River">River (Stage & Discharge)</option>
                <option value="Elevation">Elevation (DEM / Topography)</option>
                <option value="Flood">Flood (Historical Inundation)</option>
                <option value="Radar">Radar (Doppler Reflectivity)</option>
                <option value="Satellite">Satellite (GPM / Remote Sensing)</option>
                <option value="NWP">NWP (Numerical Model Forecasts)</option>
                <option value="GIS">GIS (Administrative / Drainage)</option>
                <option value="Observational">Observational (Field Sensors)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Source Organization
              </label>
              <input
                type="text"
                value={sourceOrg}
                onChange={e => setSourceOrg(e.target.value)}
                placeholder="e.g. Local University Hydro Lab"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Source Reference URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Spatial Coverage
              </label>
              <input
                type="text"
                value={spatialCoverage}
                onChange={e => setSpatialCoverage(e.target.value)}
                placeholder="e.g. Telangana Musi Basin"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Temporal Coverage
              </label>
              <input
                type="text"
                value={temporalCoverage}
                onChange={e => setTemporalCoverage(e.target.value)}
                placeholder="e.g. Sep 2026 Hourly"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resolution & Frequency
              </label>
              <input
                type="text"
                value={resolution}
                onChange={e => setResolution(e.target.value)}
                placeholder="e.g. 15-Minute Automated"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Measurement Units
              </label>
              <input
                type="text"
                value={units}
                onChange={e => setUnits(e.target.value)}
                placeholder="e.g. Rainfall (mm), Temp (°C)"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Dataset Description & Purpose
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide context regarding the data collection method, catchment characteristics, or sensor models..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Data Integrity & Validation Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Validating & Storing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Register & Validate Dataset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
