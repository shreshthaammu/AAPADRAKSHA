import React, { useState, useMemo } from "react";
import { DatasetItem, DatasetCategory, DatasetStatus } from "../../types";
import {
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Sparkles,
  Cpu,
  Trash2,
  Upload,
  ArrowUpDown,
  FileCode2,
  Layers,
  Database
} from "lucide-react";

interface Props {
  datasets: DatasetItem[];
  onInspect: (dataset: DatasetItem) => void;
  onToggleTraining: (id: string, current: boolean) => void;
  onPreprocessRequest: (dataset: DatasetItem) => void;
  onDeleteRequest: (id: string) => void;
  onOpenUpload: () => void;
}

export const DatasetLibraryTable: React.FC<Props> = ({
  datasets,
  onInspect,
  onToggleTraining,
  onPreprocessRequest,
  onDeleteRequest,
  onOpenUpload
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortField, setSortField] = useState<"name" | "records" | "date" | "score">("date");
  const [sortAsc, setSortAsc] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    datasets.forEach(d => set.add(d.category));
    return ["ALL", ...Array.from(set)];
  }, [datasets]);

  const filteredDatasets = useMemo(() => {
    return datasets
      .filter(d => {
        const matchesSearch =
          d.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "ALL" || d.category === selectedCategory;
        const matchesStatus = selectedStatus === "ALL" || d.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === "name") {
          diff = a.displayName.localeCompare(b.displayName);
        } else if (sortField === "records") {
          diff = a.records - b.records;
        } else if (sortField === "score") {
          diff = (a.validation?.score || 0) - (b.validation?.score || 0);
        } else {
          diff = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        return sortAsc ? diff : -diff;
      });
  }, [datasets, searchTerm, selectedCategory, selectedStatus, sortField, sortAsc]);

  const handleSort = (field: "name" | "records" | "date" | "score") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section aria-labelledby="dataset-library-heading" className="space-y-3.5">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-1 items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search datasets, columns, sources..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            {categories.filter(c => c !== "ALL").map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="DEMO">Demo / Synthetic</option>
            <option value="PROCESSED">Cleaned / Processed</option>
            <option value="OFFICIAL">Official</option>
            <option value="LIVE">Live Telemetry</option>
          </select>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Dataset</span>
          </button>
        </div>
      </div>

      {/* Dataset Table View */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-mono text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="p-3 font-semibold cursor-pointer hover:text-blue-600 select-none min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Dataset Name & Source</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Format</th>
                <th
                  onClick={() => handleSort("records")}
                  className="p-3 font-semibold cursor-pointer hover:text-blue-600 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Records</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("score")}
                  className="p-3 font-semibold cursor-pointer hover:text-blue-600 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Validation</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-semibold">Training</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredDatasets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-slate-500">
                    No datasets matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDatasets.map(ds => {
                  return (
                    <tr
                      key={ds.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition-colors group"
                    >
                      {/* Name & Source */}
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => onInspect(ds)}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-left line-clamp-1 block transition-colors"
                          >
                            {ds.displayName}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-mono text-[10px]">{ds.name}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{ds.source}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">v{ds.version}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {ds.category}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded tracking-wide ${
                            ds.status === "OFFICIAL"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : ds.status === "PROCESSED"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                              : ds.status === "LIVE"
                              ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {ds.status === "DEMO" ? "DEMO" : ds.status}
                        </span>
                      </td>

                      {/* Format */}
                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {ds.format}
                      </td>

                      {/* Records */}
                      <td className="p-3 whitespace-nowrap font-mono text-xs">
                        {ds.records} <span className="text-[10px] text-slate-400">({ds.columnCount} cols)</span>
                      </td>

                      {/* Validation */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {ds.validation?.status === "PASS" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : ds.validation?.status === "WARNING" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          <span className="font-mono text-xs">
                            {ds.validation?.score || 100}%
                          </span>
                        </div>
                      </td>

                      {/* Training status */}
                      <td className="p-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onToggleTraining(ds.id, ds.trainingSelected)}
                          className={`text-[11px] font-medium px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                            ds.trainingSelected
                              ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-semibold"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Cpu className="w-3 h-3" />
                          <span>{ds.trainingSelected ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onInspect(ds)}
                            title="Inspect & Preview"
                            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onPreprocessRequest(ds)}
                            title="Preprocess & Clean"
                            className="p-1.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-600 dark:text-purple-400 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {!ds.isSystemSample && (
                            <button
                              type="button"
                              onClick={() => onDeleteRequest(ds.id)}
                              title="Delete dataset"
                              className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
