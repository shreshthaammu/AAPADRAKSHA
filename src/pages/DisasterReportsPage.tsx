import React, { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Filter,
  Eye,
  Send,
  Check,
  X
} from "lucide-react";
import { CitizenReportItem } from "../types";

interface DisasterReportsPageProps {
  reports: CitizenReportItem[];
  isAuthorityMode: boolean;
}

export const DisasterReportsPage: React.FC<DisasterReportsPageProps> = ({
  reports,
  isAuthorityMode
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [localReports, setLocalReports] = useState(reports);
  const [selectedReport, setSelectedReport] = useState<CitizenReportItem | null>(null);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setLocalReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  const filtered = localReports.filter(r => {
    if (statusFilter === "ALL") return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div id="disaster-reports-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Incident Management & Field Operations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {isAuthorityMode ? "Authority Command View" : "Public Registry"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking of waterlogging incidents, fallen powerlines, and dispatch statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {localReports.length} Incidents Logged
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-slate-500 px-1">Filter:</span>
          {["ALL", "VERIFIED", "IN_PROGRESS", "RESOLVED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3 pl-2">Ticket ID</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(report => {
                const isCrit = report.severity === "CRITICAL";

                return (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 pl-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {report.id}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {report.location}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {report.category}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">
                      {report.time}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                        >
                          View
                        </button>

                        {isAuthorityMode && (
                          <>
                            {report.status !== "RESOLVED" ? (
                              <button
                                onClick={() => handleUpdateStatus(report.id, "RESOLVED")}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                              >
                                Resolve
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(report.id, "IN_PROGRESS")}
                                className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold"
                              >
                                Reopen
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Incident Docket #{selectedReport.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedReport.category}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Location:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedReport.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Description:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Severity</span>
                  <span className="font-bold text-red-600">{selectedReport.severity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Status</span>
                  <span className="font-bold text-emerald-600">{selectedReport.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Close
              </button>
              {isAuthorityMode && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedReport.id, "RESOLVED");
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Mark as Resolved & Close Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
