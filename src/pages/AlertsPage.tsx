import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
  Share2,
  Navigation,
  PhoneCall,
  Radio,
  ExternalLink
} from "lucide-react";
import { AlertItem, RiskLevel } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { VoiceAlertButton } from "../components/VoiceAlertButton";

interface AlertsPageProps {
  alerts: AlertItem[];
  onNavigateTab: (tab: any) => void;
  onOpenSOS: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onNavigateTab,
  onOpenSOS
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["ALL", "Heavy Rainfall", "River Overflow", "Infrastructure Hazard", "Evacuation"];

  const liveAlerts = alerts.filter(a => {
    const status = (a.status || "Published").toLowerCase();
    return status === "published" || status === "active" || status === "";
  });

  const filteredAlerts = liveAlerts.filter(a => {
    const matchesSev = selectedSeverity === "ALL" || a.severity === selectedSeverity;
    const matchesCat = selectedCategory === "ALL" || a.category.includes(selectedCategory);
    return matchesSev && matchesCat;
  });

  const handleCopyAlert = (alert: AlertItem) => {
    if (navigator.clipboard) {
      const text = `OFFICIAL DISASTER ALERT [${alert.severity}]: ${alert.title}\nLocation: ${alert.location}\nAction: ${alert.recommendedAction}\nSource: ${alert.source}`;
      navigator.clipboard.writeText(text);
      setCopiedId(alert.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  return (
    <div id="alerts-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Disaster Early Warning & Alerts Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              {alerts.length} Active Bulletins
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Verified official meteorological, hydrological, and civil defense bulletins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </span>
          {["ALL", "EMERGENCY", "PREPARE", "WATCH"].map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedSeverity === sev
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
        AAPADRAKSHA Demo Notice: Some datasets, predictions, map layers and model metrics shown in this prototype may be simulated or illustrative. They must not be interpreted as official government warnings or live observations unless explicitly marked as live and connected to the corresponding authoritative source.
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No active alerts match this filter</h3>
            <p className="text-xs text-slate-400 mt-1">Select "ALL" to view the full civil defense warning list.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isRed = alert.severity === "EMERGENCY";
            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`p-5 rounded-2xl border transition-all ${
                  isRed
                    ? "bg-red-50/50 dark:bg-red-950/25 border-red-300 dark:border-red-900 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isRed
                          ? "bg-red-600 text-white animate-pulse"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isRed ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <RiskBadge level={alert.severity} size="sm" />
                        <span className="text-[11px] font-mono text-slate-400">{alert.id}</span>
                        <span className="text-[11px] text-slate-500">• {alert.time}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {alert.title}
                      </h3>

                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Impact Zone: </span>
                        {alert.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <VoiceAlertButton alert={alert} compact />
                    <button
                      onClick={() => handleCopyAlert(alert)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                      title="Copy alert text to share on messaging apps"
                    >
                      {copiedId === alert.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    {isRed && (
                      <button
                        onClick={() => onNavigateTab("evacuation")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Evacuate</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">
                  {alert.description}
                </p>

                {/* Recommended Action Box */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    <span>Recommended Immediate Action:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 pl-5">
                    {alert.recommendedAction}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Source: {alert.source}</span>
                  </div>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {alert.verificationStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
