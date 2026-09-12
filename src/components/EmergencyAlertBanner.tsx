import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Volume2, VolumeX, Navigation, PhoneCall, X, CheckCircle2, AlertCircle } from "lucide-react";
import { RiskLevel } from "../types";

interface EmergencyAlertBannerProps {
  riskLevel: RiskLevel;
  location: string;
  waterDepth: number;
  inundationEta: string;
  onEvacuateClick: () => void;
  onSosClick: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  riskLevel,
  location,
  waterDepth,
  inundationEta,
  onEvacuateClick,
  onSosClick
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const speakEmergencyMessage = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    let text = "";
    if (riskLevel === "EMERGENCY") {
      text = `Emergency Warning! Flood risk is very high in ${location}. Estimated water depth is ${waterDepth} meters, arriving in ${inundationEta}. Move immediately to higher ground, avoid moving water, and proceed to the designated high-ground relief shelter.`;
    } else if (riskLevel === "PREPARE") {
      text = `Prepare to move advisory for ${location}. Heavy rainfall accumulation expected. Pack essential medicines, secure documents in waterproof pouches, and confirm your evacuation route.`;
    } else if (riskLevel === "WATCH") {
      text = `Stay alert. Heavy rainfall watch active for ${location}. Keep phones charged and monitor official flood bulletins.`;
    } else {
      text = `Weather conditions are normal in ${location}. No flood risk detected at this time.`;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setIsPlayingVoice(true);
    window.speechSynthesis.speak(utterance);
  };

  if (dismissed && riskLevel !== "EMERGENCY") return null;

  const getBannerDetails = () => {
    switch (riskLevel) {
      case "EMERGENCY":
        return {
          bg: "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-950/20",
          border: "border-red-500",
          icon: ShieldAlert,
          title: "EMERGENCY — FLOOD RISK VERY HIGH",
          subtitle: `Severe flash flooding & inundation imminent in ${location}`,
          timing: `Inundation window: ${inundationEta} | Peak water depth: ~${waterDepth}m`,
          actionGuidance: "Evacuate immediately to designated relief shelters. Disconnect electricity and avoid all low-lying bridges.",
          primaryBtnText: "Open Safe Evacuation Route",
          accentColor: "bg-white text-red-700 hover:bg-red-50"
        };
      case "PREPARE":
        return {
          bg: "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md",
          border: "border-orange-400",
          icon: AlertTriangle,
          title: "PREPARE TO MOVE — HEAVY FLOOD WARNING",
          subtitle: `Rising reservoir discharge & urban catchment saturation in ${location}`,
          timing: `Estimated arrival: ${inundationEta}`,
          actionGuidance: "Prepare family emergency kits, move elderly/children to upper floors or stage near high ground.",
          primaryBtnText: "Check Evacuation Routes",
          accentColor: "bg-white text-orange-800 hover:bg-orange-50"
        };
      case "WATCH":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800",
          border: "border-amber-300",
          icon: AlertCircle,
          title: "STAY ALERT — MONSOON HEAVY RAINFALL WATCH",
          subtitle: `Convective weather system active across ${location}`,
          timing: "Continuous monitoring active (IMD radar)",
          actionGuidance: "Avoid unnecessary travel through underpasses. Keep emergency contacts ready.",
          primaryBtnText: "View Flood Forecast",
          accentColor: "bg-amber-600 text-white hover:bg-amber-700"
        };
      case "NORMAL":
      default:
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
          border: "border-emerald-300",
          icon: CheckCircle2,
          title: "YOU ARE SAFE / NORMAL CONDITIONS",
          subtitle: `No critical inundation threats detected in ${location}`,
          timing: "All telemetry parameters within safe hydrological limits",
          actionGuidance: "Observational stations and radar streams operating nominally.",
          primaryBtnText: "View Live Map",
          accentColor: "bg-emerald-600 text-white hover:bg-emerald-700"
        };
    }
  };

  const banner = getBannerDetails();
  const IconComponent = banner.icon;

  return (
    <div
      id="emergency-alert-banner"
      className={`relative w-full border-b transition-all duration-300 ${banner.bg} ${banner.border} px-4 py-3 sm:px-6`}
    >
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-black/15 shrink-0 mt-0.5">
            <IconComponent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
                {banner.title}
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 font-medium">
                {banner.timing}
              </span>
            </div>
            <p className="text-xs sm:text-sm mt-0.5 opacity-90 max-w-3xl">
              {banner.actionGuidance}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          {/* Audio Voice Broadcast */}
          <button
            onClick={speakEmergencyMessage}
            id="voice-alert-toggle-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-xs"
            title={isPlayingVoice ? "Stop voice announcement" : "Play voice safety advisory"}
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Voice Alert</span>
              </>
            )}
          </button>

          {riskLevel === "EMERGENCY" && (
            <button
              onClick={onSosClick}
              id="banner-sos-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-red-700 hover:bg-red-50 shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS (112)</span>
            </button>
          )}

          <button
            onClick={onEvacuateClick}
            id="banner-evacuate-btn"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-transform active:scale-95 ${banner.accentColor}`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{banner.primaryBtnText}</span>
          </button>

          {riskLevel !== "EMERGENCY" && (
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-md hover:bg-black/10 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
