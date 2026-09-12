import React from "react";
import { AlertTriangle, CheckCircle2, PhoneCall, ShieldAlert, Waves } from "lucide-react";
import { RiskLevel, ZoneData } from "../types";

interface CitizenSafetyPageProps {
  selectedZone: ZoneData;
}

const guidanceByRisk: Record<string, { title: string; summary: string; steps: string[] }> = {
  EMERGENCY: {
    title: "Move to safety now",
    summary: "Flood danger is high in your monitored area. Follow official evacuation instructions and avoid moving water.",
    steps: ["Move to a designated shelter or higher ground immediately.", "Switch off electricity if it is safe to do so.", "Do not walk, swim, or drive through floodwater.", "Call 112 for urgent rescue assistance."]
  },
  PREPARE: {
    title: "Prepare to move",
    summary: "Heavy rainfall or rising water may affect your area soon. Keep your family and emergency kit ready.",
    steps: ["Avoid low-lying roads, bridges, and underpasses.", "Charge phones and keep medicines and documents waterproof.", "Check the nearest shelter and evacuation route.", "Follow official alerts before travelling."]
  },
  WATCH: {
    title: "Stay alert",
    summary: "Conditions are being monitored. Be ready to change plans if rainfall or water levels increase.",
    steps: ["Keep phones charged and monitor alerts.", "Avoid unnecessary travel during intense rain.", "Move valuables away from ground-level water.", "Check on elderly people, children, and neighbours."]
  }
};

export const CitizenSafetyPage: React.FC<CitizenSafetyPageProps> = ({ selectedZone }) => {
  const guidance = guidanceByRisk[selectedZone.risk] || {
    title: "Basic preparedness",
    summary: "No immediate threat is currently indicated. Keep simple emergency supplies ready during the rainy season.",
    steps: ["Keep a torch, medicines, water, and a charged power bank ready.", "Know your nearest higher ground or relief shelter.", "Avoid entering flowing water even when conditions look calm.", "Monitor official updates if weather conditions change."]
  };
  const isEmergency = selectedZone.risk === "EMERGENCY";

  return (
    <div id="citizen-safety-page" className="space-y-5 animate-in fade-in duration-300">
      <div className={`rounded-2xl border p-5 ${isEmergency ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
        <div className="flex items-start gap-3">
          {isEmergency ? <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-red-600" /> : <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Safety guidance for {selectedZone.district}</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{guidance.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{guidance.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-800 dark:text-slate-200"><AlertTriangle className="h-4 w-4 text-amber-500" /> What to do</h2>
          <div className="mt-4 space-y-3">
            {guidance.steps.map((step, index) => <div key={step} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span><span>{step}</span></div>)}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><Waves className="h-4 w-4 text-blue-600" /> Monitored area</h2>
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{selectedZone.name}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedZone.rainfallIntensity} · estimated depth {selectedZone.depth}m · {selectedZone.inundationEta}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <h2 className="flex items-center gap-2 text-sm font-black text-red-900 dark:text-red-200"><PhoneCall className="h-4 w-4" /> Emergency help</h2>
            <p className="mt-2 text-sm text-red-800 dark:text-red-200">Call <strong>112</strong> for urgent rescue or police assistance.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
