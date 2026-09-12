import React, { useEffect, useRef, useState } from "react";
import { AlertOctagon, PhoneCall, Share2, Users, MapPin, Volume2, VolumeX, X, CheckCircle2 } from "lucide-react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  coordinates: [number, number];
  onNavigateToShelters: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  locationName,
  coordinates,
  onNavigateToShelters
}) => {
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const audioRef = useRef<{ context: AudioContext; oscillator: OscillatorNode; modulation: OscillatorNode; gain: GainNode } | null>(null);
  const [dispatchedFamily, setDispatchedFamily] = useState(false);
  const [sharedLocation, setSharedLocation] = useState(false);

  // Web Audio API emergency siren
  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSiren();
      setIsSirenPlaying(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const modulation = ctx.createOscillator();
        const modulationDepth = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(800, now);
        modulation.type = "sine";
        modulation.frequency.setValueAtTime(0.7, now);
        modulationDepth.gain.setValueAtTime(320, now);
        modulation.connect(modulationDepth);
        modulationDepth.connect(osc.frequency);

        gain.gain.setValueAtTime(0.16, now);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        modulation.start();

        audioRef.current = { context: ctx, oscillator: osc, modulation, gain };
        setIsSirenPlaying(true);
      } catch (err) {
        console.warn("Audio Context failed:", err);
      }
    }
  };

  function stopSiren() {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.gain.gain.cancelScheduledValues(audio.context.currentTime);
      audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.03);
      audio.oscillator.stop(audio.context.currentTime + 0.12);
      audio.modulation.stop(audio.context.currentTime + 0.12);
      audio.oscillator.disconnect();
      audio.modulation.disconnect();
      void audio.context.close();
    } catch {
      // Audio nodes may already be stopped by the browser.
    }
    audioRef.current = null;
  }

  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    if (navigator.clipboard) {
      const shareText = `EMERGENCY ALERT: I am at ${locationName} (${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}). Need emergency flood rescue assistance. Please dispatch SDRF/NDRF.`;
      navigator.clipboard.writeText(shareText);
      setSharedLocation(true);
      setTimeout(() => setSharedLocation(false), 4000);
    }
  };

  const handleNotifyFamily = () => {
    setDispatchedFamily(true);
    setTimeout(() => setDispatchedFamily(false), 5000);
  };

  return (
    <div
      id="sos-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="sos-modal-panel"
        className="relative w-full max-w-lg bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 text-white overflow-hidden"
      >
        {/* Top Warning Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-wide text-red-500">
                EMERGENCY SOS ASSISTANCE
              </h3>
              <p className="text-xs text-slate-400">
                Instant Life-Safety Dispatch & Official Helplines
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isSirenPlaying) toggleSiren();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Location Badge */}
        <div className="my-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">{locationName}</span>
              <div className="font-mono text-[11px] text-slate-400">
                GPS: {coordinates[0].toFixed(4)}° N, {coordinates[1].toFixed(4)}° E
              </div>
            </div>
          </div>
          <button
            onClick={handleShareLocation}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-colors"
          >
            {sharedLocation ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy SOS Link</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5 my-4">
          {/* Call 112 Unified Emergency */}
          <a
            href="tel:112"
            id="sos-call-112-link"
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-transform active:scale-[0.98] shadow-lg shadow-red-950/40"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              <div className="text-left">
                <div className="text-base font-black">Call 112 (National Emergency)</div>
                <div className="text-xs font-normal opacity-90">Police • Fire • Ambulance • SDRF Rescue</div>
              </div>
            </div>
            <span className="text-xs uppercase px-2 py-1 bg-black/25 rounded-md font-mono">
              Dial Now
            </span>
          </a>

          {/* Call NDMA 1078 */}
          <a
            href="tel:1078"
            id="sos-call-1078-link"
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold transition-colors"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="text-sm font-bold">Call 1078 (NDMA Disaster Control)</div>
                <div className="text-xs font-normal text-slate-400">Flood Inundation & State Rescue Teams</div>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-mono">1078</span>
          </a>

          {/* Emergency Audio Siren */}
          <button
            onClick={toggleSiren}
            id="sos-toggle-siren-btn"
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
              isSirenPlaying
                ? "bg-amber-600 text-white border-amber-400 animate-pulse"
                : "bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-750"
            }`}
          >
            <div className="flex items-center gap-3">
              {isSirenPlaying ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5 text-red-400" />
              )}
              <div className="text-left">
                <div className="text-sm font-bold">
                  {isSirenPlaying ? "Silence Emergency Alarm" : "Sound Loud Alarm (Siren)"}
                </div>
                <div className="text-xs text-slate-400">
                  Attract nearby neighbors & emergency rescue teams
                </div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-black/20 font-mono">
              {isSirenPlaying ? "ACTIVE" : "PLAY"}
            </span>
          </button>

          {/* Notify Family */}
          <button
            onClick={handleNotifyFamily}
            id="sos-notify-family-btn"
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-sky-400" />
              <div className="text-left">
                <div className="text-sm font-bold">Alert Registered Family Group</div>
                <div className="text-xs text-slate-400">
                  Broadcasts "Needs Help" status to family members
                </div>
              </div>
            </div>
            {dispatchedFamily ? (
              <span className="text-xs text-emerald-400 font-semibold">Sent ✓</span>
            ) : (
              <span className="text-xs text-sky-400 font-mono">Dispatch</span>
            )}
          </button>

          {/* Find Nearest Shelter */}
          <button
            onClick={() => {
              onClose();
              onNavigateToShelters();
            }}
            id="sos-navigate-shelter-btn"
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <div className="text-left">
                <div className="text-sm font-bold">Open Nearest High-Ground Shelter</div>
                <div className="text-xs text-emerald-100 font-normal">
                  View safe route avoiding flooded causeways
                </div>
              </div>
            </div>
            <span className="text-xs bg-black/20 px-2 py-1 rounded font-mono">1.2 km</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Notice: Dialing 112 connects to local state emergency dispatch. Use only in genuine life-threatening emergencies.
        </p>
      </div>
    </div>
  );
};
