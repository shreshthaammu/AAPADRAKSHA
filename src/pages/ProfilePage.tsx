import React, { useState } from "react";
import {
  User,
  MapPin,
  HeartPulse,
  Phone,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { StateProfile, ZoneData } from "../types";

interface ProfilePageProps {
  selectedZone: ZoneData;
  selectedDistrict: string;
  selectedState: StateProfile;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  selectedZone,
  selectedDistrict,
  selectedState
}) => {
  const [name, setName] = useState("Ramesh Rao");
  const [phone, setPhone] = useState("+91 98490 12345");
  const [address, setAddress] = useState(`House #4-2-198, Near Moosarambagh Causeway, ${selectedZone.name}`);
  const [floorLevel, setFloorLevel] = useState("Ground Floor (High Risk)");
  const [hasElderly, setHasElderly] = useState(true);
  const [hasInfant, setHasInfant] = useState(false);
  const [hasMobilityIssue, setHasMobilityIssue] = useState(false);
  const [needsDialysis, setNeedsDialysis] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="profile-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Citizen Profile & Disaster Registry
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NDMA Registered Citizen</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your home coordinates and vulnerability tags are shared securely with NDRF rescue boats during emergency evacuations.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Updated</span>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Household Info */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal & Household Identification</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name / Head of Household
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Primary Emergency Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Residential Address & Landmark
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Dwelling Story / Floor Level
              </label>
              <select
                value={floorLevel}
                onChange={e => setFloorLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Ground Floor (High Risk)">Ground Floor (High Inundation Risk)</option>
                <option value="First Floor">First Floor (Moderate Risk)</option>
                <option value="Second Floor or Higher">Second Floor or Higher (Safe from Inflow)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Medical Priority */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>Rescue Priority & Medical Vulnerabilities</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Senior Citizens (Age 65+) Present</span>
                <span className="text-slate-500 text-[11px]">Flags evacuation boat priority for slow ambulation</span>
              </div>
              <input
                type="checkbox"
                checked={hasElderly}
                onChange={e => setHasElderly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Infants or Toddlers (&lt;3 years)</span>
                <span className="text-slate-500 text-[11px]">Requires baby formula & dry relief kit</span>
              </div>
              <input
                type="checkbox"
                checked={hasInfant}
                onChange={e => setHasInfant(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Mobility Impaired / Wheelchair</span>
                <span className="text-slate-500 text-[11px]">Requires stretcher / high-clearance rescue vehicle</span>
              </div>
              <input
                type="checkbox"
                checked={hasMobilityIssue}
                onChange={e => setHasMobilityIssue(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Critical Medical Dependence (Oxygen/Dialysis)</span>
                <span className="text-slate-500 text-[11px]">High-priority helicopter or amphibious extraction</span>
              </div>
              <input
                type="checkbox"
                checked={needsDialysis}
                onChange={e => setNeedsDialysis(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update NDMA Priority Flag</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
