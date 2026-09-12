import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Copy,
  Pencil,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  TriangleAlert,
  XCircle,
  Pause,
  Send,
  RotateCcw
} from "lucide-react";
import { AlertItem, AuthorityAlertAudit } from "../types";
import { VoiceAlertButton } from "../components/VoiceAlertButton";

interface AuthorityAlertControlPageProps {
  alerts: AlertItem[];
  auditLog: AuthorityAlertAudit[];
  onCreateAlert: (alert: AlertItem) => void;
  onUpdateAlert: (alert: AlertItem) => void;
  onDeleteAlert: (id: string) => void;
  onDuplicateAlert: (alert: AlertItem) => void;
}

const alertTypes = [
  "Heavy Rainfall",
  "Flash Flood",
  "Urban Flood",
  "River Flood",
  "Inundation",
  "Landslide Risk",
  "Cyclone",
  "Thunderstorm",
  "Lightning",
  "Emergency Evacuation",
  "General Disaster Warning"
];

const severities = ["INFO", "ADVISORY", "WATCH", "HIGH", "CRITICAL", "EMERGENCY"];
const sources = [
  "IMD",
  "CWC",
  "ISRO/NRSC",
  "MOSDAC",
  "NASA GPM",
  "India-WRIS",
  "Local Sensor",
  "Radar",
  "Satellite",
  "NWP",
  "AI/ML Prediction",
  "Authority Manual Entry",
  "Demonstration Data"
];

const initialForm = (): AlertItem => ({
  id: `ALERT-${Date.now()}`,
  category: "Heavy Rainfall",
  title: "Heavy rainfall alert for low-lying wards",
  description: "Heavy rain and rising water in low-lying urban pockets. Residents are advised to move to higher ground.",
  severity: "HIGH",
  location: "Hyderabad",
  time: "Just now",
  recommendedAction: "Move to higher ground and avoid low-lying roads.",
  source: "Authority Manual Entry",
  verificationStatus: "Draft",
  status: "Draft",
  district: "Hyderabad",
  city: "Hyderabad",
  coordinates: [17.385, 78.4867],
  affectedZones: ["Zone A", "Zone B"],
  startTime: new Date().toISOString(),
  expiryTime: new Date(Date.now() + 3600000).toISOString(),
  expectedRainfall: "120 mm",
  floodProbability: "72%",
  expectedInundationDepth: "1.0 m",
  confidence: "86%",
  previousSeverity: "NEW",
  sourceStatus: "DEMO MODE",
  createdBy: "Authority Operator",
  modifiedBy: "Authority Operator"
});

export const AuthorityAlertControlPage: React.FC<AuthorityAlertControlPageProps> = ({
  alerts,
  auditLog,
  onCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
  onDuplicateAlert
}) => {
  const [form, setForm] = useState<AlertItem>(initialForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedAlert = useMemo(
    () => alerts.find(alert => alert.id === editingId) ?? null,
    [alerts, editingId]
  );

  const handleChange = (field: keyof AlertItem, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (publish = false) => {
    const next: AlertItem = {
      ...form,
      status: publish ? "Published" : "Draft",
      verificationStatus: publish ? "Published" : "Draft",
      time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      published: publish,
      sourceStatus: publish ? "Notification delivery: DEMO MODE" : "Draft saved",
      previousSeverity: form.previousSeverity || form.severity,
      createdAt: form.createdAt || new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: form.createdBy || "Authority Operator",
      modifiedBy: "Authority Operator"
    };

    if (editingId && selectedAlert) {
      onUpdateAlert({ ...next, id: editingId });
    } else {
      onCreateAlert({ ...next, id: next.id || `ALERT-${Date.now()}` });
    }

    setForm(initialForm());
    setEditingId(null);
  };

  const handleEdit = (alert: AlertItem) => {
    setEditingId(alert.id);
    setForm({ ...alert, previousSeverity: alert.previousSeverity || alert.severity });
  };

  const handleDuplicate = (alert: AlertItem) => {
    onDuplicateAlert(alert);
  };

  const handleStatusChange = (alert: AlertItem, status: AlertItem["status"]) => {
    onUpdateAlert({
      ...alert,
      status,
      verificationStatus: status || "Draft",
      published: status === "Published",
      modifiedAt: new Date().toISOString(),
      modifiedBy: "Authority Operator",
      sourceStatus: status === "Published" ? "Notification delivery: DEMO MODE" : `Alert ${status?.toLowerCase()}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-violet-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Authority Alert Control</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create, edit, publish, pause, withdraw, and review operational warnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Plus className="h-4 w-4 text-blue-500" />
              {editingId ? "Edit alert" : "Create alert"}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Authority-only action</div>
          </div>

          {!editingId && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              Select <strong>Edit</strong> on any alert below to load it into this form. Changes are saved locally in this demo session.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Alert title</span>
              <input value={form.title} onChange={e => handleChange("title", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Alert type</span>
              <select value={form.category} onChange={e => handleChange("category", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {alertTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Severity</span>
              <select value={form.severity} onChange={e => handleChange("severity", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {severities.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Status</span>
              <select value={form.status || "Draft"} onChange={e => handleChange("status", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Paused">Paused</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">State</span>
              <input value={form.location || "Telangana"} onChange={e => handleChange("location", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">District</span>
              <input value={form.district || "Hyderabad"} onChange={e => handleChange("district", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Alert description</span>
              <textarea rows={3} value={form.description} onChange={e => handleChange("description", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Recommended action</span>
              <textarea rows={2} value={form.recommendedAction} onChange={e => handleChange("recommendedAction", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Coordinates</span>
              <input value={form.coordinates ? `${form.coordinates[0]}, ${form.coordinates[1]}` : "17.385, 78.4867"} onChange={e => {
                const [lat, lng] = e.target.value.split(",").map(v => Number(v.trim()));
                handleChange("coordinates", [lat || 17.385, lng || 78.4867]);
              }} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Source</span>
              <select value={form.source} onChange={e => handleChange("source", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {sources.map(source => <option key={source} value={source}>{source}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Expected rainfall</span>
              <input value={form.expectedRainfall || "120 mm"} onChange={e => handleChange("expectedRainfall", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Flood probability</span>
              <input value={form.floodProbability || "72%"} onChange={e => handleChange("floodProbability", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Inundation depth</span>
              <input value={form.expectedInundationDepth || "1.0 m"} onChange={e => handleChange("expectedInundationDepth", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Confidence</span>
              <input value={form.confidence || "86%"} onChange={e => handleChange("confidence", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Expiry time</span>
              <input type="datetime-local" value={form.expiryTime ? new Date(form.expiryTime).toISOString().slice(0, 16) : ""} onChange={e => handleChange("expiryTime", new Date(e.target.value).toISOString())} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Affected zones</span>
              <input value={(form.affectedZones || ["Zone A"]).join(", ")} onChange={e => handleChange("affectedZones", e.target.value.split(",").map(v => v.trim()).filter(Boolean))} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={() => handleSave(false)} className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"><Save className="h-4 w-4" /> Save draft</button>
            <button type="button" onClick={() => handleSave(true)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"><ShieldAlert className="h-4 w-4" /> Publish alert</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(initialForm()); }} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"><XCircle className="h-4 w-4" /> Cancel edit</button>}
          </div>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200"><Bell className="h-4 w-4 text-amber-500" /> Alert queue</div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{alerts.length} items</span>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{alert.id}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-300">{alert.status || "Published"}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{alert.title}</h3>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{alert.location}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <button type="button" onClick={() => handleEdit(alert)} className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300" title="Edit alert"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <VoiceAlertButton alert={alert} compact />
                    {alert.status === "Published" ? (
                      <button type="button" onClick={() => handleStatusChange(alert, "Paused")} className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300" title="Pause alert"><Pause className="h-3.5 w-3.5" /> Pause</button>
                    ) : (
                      <button type="button" onClick={() => handleStatusChange(alert, "Published")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" title="Publish alert"><Send className="h-3.5 w-3.5" /> Publish</button>
                    )}
                    {alert.status === "Withdrawn" ? (
                      <button type="button" onClick={() => handleStatusChange(alert, "Published")} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200" title="Republish alert"><RotateCcw className="h-3.5 w-3.5" /> Republish</button>
                    ) : (
                      <button type="button" onClick={() => handleStatusChange(alert, "Withdrawn")} className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1.5 text-[11px] font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300" title="Withdraw alert"><TriangleAlert className="h-3.5 w-3.5" /> Withdraw</button>
                    )}
                    <button type="button" onClick={() => handleDuplicate(alert)} className="inline-flex items-center gap-1 rounded-lg bg-indigo-100 px-2 py-1.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" title="Duplicate alert"><Copy className="h-3.5 w-3.5" /> Duplicate</button>
                    <button type="button" onClick={() => onDeleteAlert(alert.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300" title="Delete alert"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{alert.severity}</span>
                  <span>{alert.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Audit log</div>
        <div className="space-y-3">
          {auditLog.map(entry => (
            <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex items-center justify-between gap-3">
                <div className="font-bold text-slate-900 dark:text-white">{entry.alertId}</div>
                <div className="text-slate-500 dark:text-slate-400">{entry.publicationStatus}</div>
              </div>
              <div className="mt-2 text-slate-600 dark:text-slate-300">Created: {entry.createdBy} • {entry.createdTime}</div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">Severity: {entry.previousSeverity} → {entry.newSeverity}</div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">Status: {entry.statusChange}</div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">Modified: {entry.modifiedBy} • {entry.modifiedTime}</div>
              <div className="mt-1 text-slate-600 dark:text-slate-300">Source: {entry.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
