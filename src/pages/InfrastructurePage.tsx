import React, { useState } from "react";
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Bus,
  HeartPulse,
  Droplets,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { RiskBadge } from "../components/RiskBadge";
import { RiskLevel } from "../types";

export const InfrastructurePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");

  const infrastructureItems = [
    {
      id: "inf-1",
      name: "Moosarambagh Low-Level Causeway",
      category: "Bridges & Transport",
      risk: "EMERGENCY" as RiskLevel,
      waterDepth: "1.45 m (Over-topping)",
      status: "Closed & Barricaded",
      action: "Traffic diverted via Amberpet Flyover. SDRF teams stationed with inflatable rescue craft.",
      icon: Bus,
      criticality: "High Priority Transit"
    },
    {
      id: "inf-2",
      name: "Chaderghat 132/33kV Power Substation",
      category: "Power Grid & Electrical",
      risk: "EMERGENCY" as RiskLevel,
      waterDepth: "0.75 m (Transformer Yard)",
      status: "Emergency Partial Shutdown",
      action: "TSSPDCL engineers deployed portable de-watering diesel pumps. Feeder 4 isolated to prevent electrocution.",
      icon: Zap,
      criticality: "Feeds 45,000 Homes"
    },
    {
      id: "inf-3",
      name: "Mahatma Gandhi Bus Station (MGBS)",
      category: "Bridges & Transport",
      risk: "PREPARE" as RiskLevel,
      waterDepth: "0.35 m (Platform 1-4)",
      status: "Restricted Operations",
      action: "Interstate long-distance buses diverted to outer ring terminal; elevated walkway in use.",
      icon: Bus,
      criticality: "Major Regional Hub"
    },
    {
      id: "inf-4",
      name: "Osmania General Hospital",
      category: "Hospitals & Medical",
      risk: "WATCH" as RiskLevel,
      waterDepth: "0.10 m (Drainage Compound)",
      status: "Operational / Defended",
      action: "Permanent storm drain flap gates closed. Heavy-duty submersible pumps operational.",
      icon: HeartPulse,
      criticality: "Apex Trauma Center"
    },
    {
      id: "inf-5",
      name: "Amberpet Sewage Treatment Plant & Sump",
      category: "Water & Drainage",
      risk: "PREPARE" as RiskLevel,
      waterDepth: "0.55 m (Intake Screen)",
      status: "Operating at 140% Hydraulic Capacity",
      action: "Emergency sluice gates opened towards retention basin to prevent urban backflow.",
      icon: Droplets,
      criticality: "Primary Basin Sump"
    },
    {
      id: "inf-6",
      name: "Hyderabad Metro Green Line (MGBS Elevated Pier 12-18)",
      category: "Bridges & Transport",
      risk: "NORMAL" as RiskLevel,
      waterDepth: "0.0 m (Elevated)",
      status: "Fully Operational",
      action: "Elevated line clear of floodwaters. Escalator sumps monitored continuously.",
      icon: Bus,
      criticality: "Mass Rapid Transit"
    }
  ];

  const filtered = infrastructureItems.filter(item => {
    const matchType = selectedType === "ALL" || item.category.includes(selectedType);
    const matchRisk = selectedRisk === "ALL" || item.risk === selectedRisk;
    return matchType && matchRisk;
  });

  return (
    <div id="infrastructure-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Critical Infrastructure Exposure & Resilience
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              2 Assets in Emergency State
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time monitoring of bridges, power substations, hospitals, and drainage sumps exposed to inundation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
            {infrastructureItems.length} Key Assets Monitored
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-500">Asset Type:</span>
          {["ALL", "Bridges", "Power", "Hospitals", "Water"].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                selectedType === t
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Risk Severity:</span>
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Severities</option>
            <option value="EMERGENCY">Emergency Only</option>
            <option value="PREPARE">Prepare</option>
            <option value="WATCH">Watch</option>
            <option value="NORMAL">Normal</option>
          </select>
        </div>
      </div>

      {/* Infrastructure Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const isRed = item.risk === "EMERGENCY";
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                isRed
                  ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isRed
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.category}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-semibold">
                        {item.criticality}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <RiskBadge level={item.risk} size="sm" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Water Submersion</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{item.waterDepth}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Asset Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{item.status}</span>
                </div>
              </div>

              {/* Civil Defense Action */}
              <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                  Civil Defense Response Deployed:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
