import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  MapPin,
  Clock,
  RefreshCw,
  Sun,
  Moon,
  AlertOctagon,
  UserCheck,
  Shield,
  Menu,
  X
} from "lucide-react";
import { INDIAN_STATES } from "../data/regions";
import { StateProfile } from "../types";

interface NavbarProps {
  selectedState: StateProfile;
  selectedDistrict: string;
  onSelectState: (state: StateProfile) => void;
  onSelectDistrict: (district: string) => void;
  isAuthorityMode: boolean;
  onToggleAuthorityMode: () => void;
  appMode: "citizen" | "authority";
  onOpenSOS: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedState,
  selectedDistrict,
  onSelectState,
  onSelectDistrict,
  isAuthorityMode,
  onToggleAuthorityMode,
  appMode,
  onOpenSOS,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
  isMobileSidebarOpen
}) => {
  const [timeString, setTimeString] = useState("");
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " IST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
        {/* Left: Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow-md shadow-red-600/20 flex items-center justify-center">
              <img src="/logo.png" alt="AAPADRAKSHA logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-wider text-slate-900 dark:text-white">
                  AAPADRAKSHA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium truncate max-w-xs">
                AI Heavy Rainfall Warning & Inundation Prediction
              </p>
            </div>
          </div>
        </div>

        {/* Center: State & District Selector */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* State Picker */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <select
              value={selectedState.name}
              onChange={e => {
                const found = INDIAN_STATES.find(s => s.name === e.target.value);
                if (found) {
                  onSelectState(found);
                  onSelectDistrict(found.defaultDistrict);
                }
              }}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {INDIAN_STATES.map(st => (
                <option key={st.name} value={st.name} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Picker */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={e => onSelectDistrict(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {selectedState.districts.map(dist => (
                <option key={dist} value={dist} className="dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {dist}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Right: Role Toggle, Presentation Toggle, Clock, SOS & Theme */}
        <div className="flex items-center gap-2">
          {/* Refresh Countdown & Clock */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{timeString}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{countdown}s</span>
            </div>
          </div>

          {/* Citizen vs Authority View Switcher (Section 4) */}
          <button
            onClick={() => {
              if (!isAuthorityMode && appMode === "citizen") {
                const confirmSwitch = window.confirm("Switch to Authority Mode? This prototype simulates role-based access and loads the command centre.");
                if (!confirmSwitch) return;
              }
              onToggleAuthorityMode();
            }}
            id="role-switch-button"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isAuthorityMode
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title="Toggle between Citizen view and Authority/Disaster Command view"
          >
            {isAuthorityMode ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Authority Mode</span>
                <span className="sm:hidden">Command</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Citizen Mode</span>
                <span className="sm:hidden">Citizen</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark or Light theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Prominent High-Visibility SOS Button */}
          <button
            onClick={onOpenSOS}
            id="navbar-sos-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all"
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
