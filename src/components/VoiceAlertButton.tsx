import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AlertItem } from "../types";

interface VoiceAlertButtonProps {
  alert: AlertItem;
  compact?: boolean;
}

export const VoiceAlertButton: React.FC<VoiceAlertButtonProps> = ({ alert, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const toggleVoiceAlert = () => {
    if (!("speechSynthesis" in window)) {
      alert("Voice alerts are not supported by this browser. Try the latest Chrome or Edge.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const message = `${alert.severity} disaster alert. ${alert.title}. Location: ${alert.location}. Recommended action: ${alert.recommendedAction}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={toggleVoiceAlert}
      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1.5 text-xs font-semibold text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
      title={isPlaying ? "Stop voice alert" : "Play voice alert"}
      aria-label={isPlaying ? `Stop voice alert for ${alert.title}` : `Play voice alert for ${alert.title}`}
    >
      {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      <span>{compact ? (isPlaying ? "Stop" : "Voice") : isPlaying ? "Stop voice" : "Voice alert"}</span>
    </button>
  );
};
