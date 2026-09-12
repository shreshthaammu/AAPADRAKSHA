import React, { useState } from "react";
import {
  Settings,
  Bell,
  Volume2,
  Globe,
  Radio,
  Wifi,
  Database,
  Moon,
  Sun,
  Shield,
  CheckCircle2,
  HardDrive,
  MonitorSmartphone
} from "lucide-react";
import { ThemeMode } from "../types";

interface SettingsPageProps {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onSetThemeMode: (mode: ThemeMode) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDarkMode,
  themeMode,
  onToggleTheme,
  onSetThemeMode
}) => {
  const [pushAlerts, setPushAlerts] = useState(true);
  const [soundSirens, setSoundSirens] = useState(true);
  const [sirenVolume, setSirenVolume] = useState(85);
  const [offlineTiles, setOfflineTiles] = useState(true);
  const [pollInterval, setPollInterval] = useState("5min");
  const [language, setLanguage] = useState("en");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const apis = [
    { name: "AAPADRAKSHA Hydro Core (Express)", status: "OPERATIONAL", latency: "14ms", code: "200 OK" },
    { name: "Gemini Assistant", status: "CONFIGURED / FALLBACK", latency: "Provider-dependent", code: "Rule engine available" },
    { name: "IMD Doppler Radar Mosaic (DWR)", status: "SIMULATED", latency: "Prototype input", code: "Not connected" },
    { name: "CWC Hydro-Net Telemetry", status: "SIMULATED", latency: "Prototype input", code: "Not connected" }
  ];

  return (
    <div id="settings-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Application & System Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure emergency warning thresholds, offline resilience, and sound telemetry.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alert & Audio Preferences */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Warning & Siren Preferences</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Critical Evacuation Push Alerts</span>
                <span className="text-slate-500 text-[11px]">Receive loud alarms when flood probability exceeds 85%</span>
              </div>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={e => setPushAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">High-Pitch Audio Siren</span>
                <span className="text-slate-500 text-[11px]">Play NDMA acoustic oscillation on life-threat alert</span>
              </div>
              <input
                type="checkbox"
                checked={soundSirens}
                onChange={e => setSoundSirens(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            {soundSirens && (
              <div className="pt-2">
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Siren Master Volume:</span>
                  </span>
                  <span className="font-mono font-bold text-blue-600">{sirenVolume}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={sirenVolume}
                  onChange={e => setSirenVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Offline & Resilient Storage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <HardDrive className="w-4 h-4 text-purple-600" />
            <span>Resilience & Offline Caching</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Pre-Cache GIS Map Tiles & Shelters</span>
                <span className="text-slate-500 text-[11px]">Enables offline navigation if cell towers fail during storm</span>
              </div>
              <input
                type="checkbox"
                checked={offlineTiles}
                onChange={e => setOfflineTiles(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Telemetry Sync Frequency</span>
              <select
                value={pollInterval}
                onChange={e => setPollInterval(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="1min">1 minute (Storm Emergency Mode)</option>
                <option value="5min">5 minutes (Standard Monitoring)</option>
                <option value="15min">15 minutes (Low Battery Saving)</option>
              </select>
            </div>

            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Display Theme</span>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: MonitorSmartphone }
                ] as Array<{ value: ThemeMode; label: string; icon: any }>).map(option => {
                  const Icon = option.icon;
                  const isSelected = themeMode === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onSetThemeMode(option.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-bold transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics & Live API Health */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic System Health</span>
            </h3>
            <p className="text-xs text-slate-500">Live heartbeat of microservices & data feeds</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            All Systems Nominal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {apis.map((a, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1"
            >
              <div className="font-bold text-slate-900 dark:text-white truncate">{a.name}</div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold font-mono">
                  {a.status}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">{a.latency}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-transform active:scale-98"
          >
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
