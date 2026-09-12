import React, { useState, useEffect } from "react";
import {
  AlertOctagon,
  PhoneCall,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  Radio,
  Send,
  ShieldAlert,
  ZapOff,
  LifeBuoy,
  Flashlight
} from "lucide-react";
import { ZoneData } from "../types";
import { triggerEmergencySOS } from "../services/api";

interface EmergencySOSPageProps {
  selectedZone: ZoneData;
  onNavigateTab: (tab: any) => void;
}

export const EmergencySOSPage: React.FC<EmergencySOSPageProps> = ({
  selectedZone,
  onNavigateTab
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [sosResponse, setSosResponse] = useState<any | null>(null);
  const [strobeActive, setStrobeActive] = useState(false);

  const coords = `${selectedZone.latitude.toFixed(4)}° N, ${selectedZone.longitude.toFixed(4)}° E`;

  // Synthesized audio siren using Web Audio API
  useEffect(() => {
    if (!sirenPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      const lfo = setInterval(() => {
        if (ctx.state === "running") {
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.5);
        }
      }, 500);

      return () => {
        clearInterval(lfo);
        try {
          osc.stop();
          ctx.close();
        } catch (e) {}
      };
    } catch (e) {
      console.warn("Audio Context not supported in this frame", e);
    }
  }, [sirenPlaying]);

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTriggerSOS = async () => {
    const res = await triggerEmergencySOS(
      [selectedZone.latitude, selectedZone.longitude],
      "Citizen Emergency Trigger: Severe Inundation Trap. Need immediate evacuation boat.",
      "Citizen Applet User",
      "9876543210"
    );
    setSosSent(true);
    setSosResponse(res);
  };

  return (
    <div id="sos-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Warning Banner */}
      <div className="p-6 rounded-3xl bg-red-600 text-white shadow-xl shadow-red-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-4 border-red-500 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-white text-red-600 shadow-md shrink-0 mt-1">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest bg-red-800/80 px-2.5 py-0.5 rounded-md">
              PRIORITY DISTRESS DISPATCH
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
              Emergency SOS Response Center
            </h1>
            <p className="text-xs sm:text-sm text-red-100 mt-1">
              Direct link to NDRF, SDRF, Police (100) and Ambulance (108) Incident Command.
            </p>
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="tel:112"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-red-600 hover:bg-red-50 active:scale-95 font-black text-sm shadow-lg transition-transform"
          >
            <PhoneCall className="w-5 h-5" />
            <span>DIAL 112 DISPATCH</span>
          </a>

          <button
            onClick={() => setSirenPlaying(!sirenPlaying)}
            className={`p-3 rounded-2xl border-2 transition-colors ${
              sirenPlaying
                ? "bg-amber-400 border-amber-300 text-slate-900 font-bold"
                : "bg-red-700/80 border-red-400 text-white hover:bg-red-700"
            }`}
            title="Toggle Audio Siren"
          >
            {sirenPlaying ? <Volume2 className="w-6 h-6 animate-bounce" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Grid: Coordinates & Broadcast (6 cols) + Flood Survival Survival Rules (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Location & Broadcast */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Geo-Coordinates & Distress Signal
          </h2>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">GPS Location:</span>
              <button
                onClick={handleCopyCoords}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Coordinates Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Coordinates</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {coords}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Zone: <span className="font-semibold">{selectedZone.name}</span>, {selectedZone.district}
            </div>
          </div>

          {/* Broadcast Trigger */}
          <div className="space-y-3">
            {!sosSent ? (
              <button
                onClick={handleTriggerSOS}
                id="send-sos-signal-btn"
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-transform"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>BROADCAST DISTRESS BEACON TO NDRF</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Distress Beacon Registered with Incident Command!</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Dispatch Ticket ID: <strong className="font-mono">{sosResponse?.ticketId || "SOS-IND-9021"}</strong>. Local rescue boats and disaster police in {selectedZone.name} have received your coordinates.
                </p>
              </div>
            )}

            <button
              onClick={() => setStrobeActive(!strobeActive)}
              className={`w-full py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                strobeActive
                  ? "bg-amber-300 text-slate-950 border-amber-400 animate-pulse font-black"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              <Flashlight className="w-4 h-4" />
              <span>{strobeActive ? "Screen Strobe Active (Signal Rescuers)" : "Turn On Rescue Flash Strobe"}</span>
            </button>
          </div>
        </div>

        {/* Right: NDMA Flood Survival Protocols (Section 30) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>NDMA Mandatory Flood Survival Protocols</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <ZapOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">1. Cut Off Electricity & Gas</strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Switch off the main circuit breaker before water reaches wall outlets to prevent fatal electrocution.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <LifeBuoy className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">2. Ascend to Higher Ground</strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Move elderly, children, and essential kits to the top floor or roof terrace. Never hide in a closed attic without roof access.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">3. Do NOT Walk or Drive Through Floodwater</strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Just 15 cm of moving water can sweep a person off their feet. 30 cm can float most cars and SUVs.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block">4. Signal Rescuers Acoustically</strong>
                <span className="text-slate-600 dark:text-slate-400">
                  Blow a whistle, shine a light, or wave a bright colored cloth. Avoid shouting unnecessarily to conserve oxygen and stamina.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
