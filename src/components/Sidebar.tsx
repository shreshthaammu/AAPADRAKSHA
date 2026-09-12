import React from "react";
import {
  LayoutDashboard,
  Map,
  CloudRain,
  TrendingUp,
  Bell,
  Navigation,
  PhoneCall,
  Users,
  AlertOctagon,
  Bot,
  BrainCircuit,
  SlidersHorizontal,
  Layers,
  Building2,
  FileSpreadsheet,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Settings,
  User,
  Cpu,
  HelpCircle,
  LogOut,
  Database
} from "lucide-react";

export type TabType =
  | "dashboard"
  | "live-map"
  | "weather"
  | "flood-forecast"
  | "alerts"
  | "data"
  | "evacuation"
  | "emergency-services"
  | "family-safety"
  | "sos"
  | "ai-assistant"
  | "ai-prediction"
  | "risk-analysis"
  | "data-fusion"
  | "infrastructure"
  | "citizen-alerts"
  | "what-if"
  | "analytics"
  | "disaster-reports"
  | "model-training"
  | "notifications"
  | "settings"
  | "profile";

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isAuthorityMode: boolean;
  unreadNotificationsCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isAuthorityMode,
  unreadNotificationsCount,
  isOpen,
  onCloseMobile
}) => {
  const navSections = isAuthorityMode
    ? [
        {
          group: "Command Centre",
          items: [
            { id: "dashboard" as TabType, label: "Operations Dashboard", icon: LayoutDashboard },
            { id: "live-map" as TabType, label: "Live GIS Intelligence", icon: Map },
            { id: "weather" as TabType, label: "Weather & Radar", icon: CloudRain },
            { id: "flood-forecast" as TabType, label: "Flood Forecast", icon: TrendingUp },
            { id: "authority-alerts" as TabType, label: "Alert Control", icon: Bell, badge: 3 },
            { id: "authority-sources" as TabType, label: "Official Data Sources", icon: Database },
            { id: "sos" as TabType, label: "Emergency SOS", icon: AlertOctagon, highlight: true }
          ]
        },
        {
          group: "Data & Analysis",
          items: [
            { id: "data" as TabType, label: "Dataset Management", icon: Database },
            { id: "ai-prediction" as TabType, label: "AI Flood Prediction", icon: BrainCircuit },
            { id: "risk-analysis" as TabType, label: "Risk Analysis", icon: SlidersHorizontal },
            { id: "data-fusion" as TabType, label: "Sensor / Data Fusion", icon: Layers },
            { id: "model-training" as TabType, label: "ML Model Benchmarks", icon: Cpu },
            { id: "analytics" as TabType, label: "Analytics & Trends", icon: BarChart3 },
            { id: "what-if" as TabType, label: "What-If Simulator", icon: SlidersHorizontal }
          ]
        },
        {
          group: "Operations",
          items: [
            { id: "infrastructure" as TabType, label: "Critical Infrastructure", icon: Building2 },
            { id: "disaster-reports" as TabType, label: "Incident Management", icon: ClipboardList },
            { id: "evacuation" as TabType, label: "Evacuation Planning", icon: Navigation },
            { id: "emergency-services" as TabType, label: "Emergency Services", icon: PhoneCall },
            { id: "citizen-alerts" as TabType, label: "Citizen Reports", icon: FileSpreadsheet }
          ]
        },
        {
          group: "Account & Preferences",
          items: [
            { id: "notifications" as TabType, label: "Notifications", icon: Bell, badge: unreadNotificationsCount },
            { id: "settings" as TabType, label: "Settings", icon: Settings },
            { id: "profile" as TabType, label: "Authority Profile", icon: User }
          ]
        }
      ]
    : [
        {
          group: "Citizen",
          items: [
            { id: "dashboard" as TabType, label: "Home", icon: LayoutDashboard },
            { id: "live-map" as TabType, label: "Live Risk Map", icon: Map },
            { id: "weather" as TabType, label: "Weather", icon: CloudRain },
            { id: "flood-forecast" as TabType, label: "Flood Forecast", icon: TrendingUp },
            { id: "alerts" as TabType, label: "My Alerts", icon: Bell }
          ]
        },
        {
          group: "Safety",
          items: [
            { id: "evacuation" as TabType, label: "Evacuation & Shelters", icon: Navigation },
            { id: "safety" as TabType, label: "Safety Guidance", icon: ShieldCheck },
            { id: "emergency-services" as TabType, label: "Emergency Services", icon: PhoneCall },
            { id: "family-safety" as TabType, label: "Family Safety", icon: Users },
            { id: "citizen-alerts" as TabType, label: "Report a Hazard", icon: FileSpreadsheet },
            { id: "sos" as TabType, label: "Emergency SOS", icon: AlertOctagon, highlight: true }
          ]
        },
        {
          group: "Preferences",
          items: [
            { id: "ai-assistant" as TabType, label: "AI Disaster Assistant", icon: Bot },
            { id: "notifications" as TabType, label: "Notifications", icon: Bell, badge: unreadNotificationsCount },
            { id: "profile" as TabType, label: "Profile", icon: User },
            { id: "settings" as TabType, label: "Settings", icon: Settings }
          ]
        }
      ];

  const handleSelect = (tab: TabType) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-35 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="py-4 px-3 space-y-6">
          {navSections.map(section => (
            <div key={section.group}>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {section.group}
              </h3>
              <nav className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      id={`sidebar-link-${item.id}`}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs shadow-blue-600/30 font-bold"
                          : item.highlight
                          ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? "text-white"
                              : item.highlight
                              ? "text-red-600 animate-pulse"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && item.badge > 0 ? (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-white text-blue-700"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer info & protocol badge */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">NDMA / IMD Protocol</div>
              <div className="text-[10px]">Standard Operating Procedure</div>
            </div>
          </div>
          <div className="text-center text-[10px] text-slate-400">
            AAPADRAKSHA Operations
          </div>
        </div>
      </aside>
    </>
  );
};
