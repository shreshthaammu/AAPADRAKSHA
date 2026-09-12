import React, { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Heart,
  Share2,
  CheckSquare,
  Square,
  Send
} from "lucide-react";
import { FamilyMember } from "../types";

interface FamilySafetyPageProps {
  initialMembers?: any;
}

export const FamilySafetyPage: React.FC<FamilySafetyPageProps> = () => {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "fam-1",
      name: "Suresh Kumar",
      relation: "Self (Head)",
      phone: "+91-9876543210",
      location: "Chaderghat, Hyderabad",
      status: "SAFE",
      lastCheckIn: "10 mins ago",
      vulnerabilities: []
    },
    {
      id: "fam-2",
      name: "Lakshmi Kumar",
      relation: "Spouse",
      phone: "+91-9876543211",
      location: "Victory High Ground Shelter",
      status: "SAFE",
      lastCheckIn: "25 mins ago",
      vulnerabilities: []
    },
    {
      id: "fam-3",
      name: "Ramanathan (Father)",
      relation: "Parent",
      phone: "+91-9876543212",
      location: "Old Chaderghat Ground Floor",
      status: "NEEDS_HELP",
      lastCheckIn: "1 hour ago",
      vulnerabilities: ["Elderly (78 yrs)", "Mobility Impairment", "Insulin Dependent"]
    },
    {
      id: "fam-4",
      name: "Aanya Kumar",
      relation: "Daughter (Age 8)",
      phone: "Via Mother",
      location: "Victory High Ground Shelter",
      status: "SAFE",
      lastCheckIn: "25 mins ago",
      vulnerabilities: ["Child"]
    }
  ]);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Household Kit Checklist
  const [checklist, setChecklist] = useState([
    { id: "k1", label: "3-day drinking water (3L per person/day)", checked: true },
    { id: "k2", label: "Non-perishable food / dry rations & energy bars", checked: true },
    { id: "k3", label: "Essential prescription medicines (Insulin, BP)", checked: false },
    { id: "k4", label: "Waterproof pouch for Aadhaar, deeds & insurance", checked: true },
    { id: "k5", label: "Battery-powered torch / radio & spare power banks", checked: false },
    { id: "k6", label: "Whistle for sounding SOS location to rescue boats", checked: true }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const updateStatus = (id: string, newStatus: FamilyMember["status"]) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === id ? { ...m, status: newStatus, lastCheckIn: "Just now" } : m
      )
    );
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: newMemberName,
      relation: newMemberRelation || "Family",
      phone: newMemberPhone || "N/A",
      location: "Current Household",
      status: "CHECKED_IN",
      lastCheckIn: "Just now",
      vulnerabilities: []
    };

    setMembers([...members, newMember]);
    setNewMemberName("");
    setNewMemberRelation("");
    setNewMemberPhone("");
    setShowAddForm(false);
  };

  const handleBroadcastSafetyCheck = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const safeCount = members.filter(m => m.status === "SAFE" || m.status === "CHECKED_IN").length;
  const needHelpCount = members.filter(m => m.status === "NEEDS_HELP").length;
  const safetyScore = Math.round((safeCount / members.length) * 100);

  return (
    <div id="family-safety-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Family & Household Safety Hub
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                needHelpCount > 0
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {needHelpCount > 0 ? "1 Member Needs Rescue" : "All Members Accounted"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Coordinate real-time location check-ins, vulnerability alerts, and emergency grab-bags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBroadcastSafetyCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcastSent ? "Check Broadcast Sent!" : "Request Status Check"}</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Household Safety Score Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Household Safety Score</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {safetyScore}% Accounted For
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {safeCount} Safe / Checked-in • {needHelpCount} Needs Help • {members.length} Total
            </div>
          </div>
        </div>

        {/* Quick I Am Safe WhatsApp Action */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            "AAPADRAKSHA SAFETY UPDATE: I am currently safe. Tracking live inundation via NDMA SIH portal."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Broadcast "I Am Safe" to WhatsApp</span>
        </a>
      </div>

      {/* Add Member Form Modal / Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddMember}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-3"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Household Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              required
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Relationship (e.g. Daughter, Mother)"
              value={newMemberRelation}
              onChange={e => setNewMemberRelation(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newMemberPhone}
              onChange={e => setNewMemberPhone(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Grid: Family Members List (7 cols) + Emergency Grab-Bag Checklist (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Members Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Registered Family Contacts & Live Status
          </h2>

          {members.map(member => {
            const isNeedHelp = member.status === "NEEDS_HELP";

            return (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isNeedHelp
                    ? "bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-900"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({member.relation})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{member.location}</span>
                      <span>• Last checked in {member.lastCheckIn}</span>
                    </div>
                  </div>

                  {/* Status Dropdown / Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start">
                    <button
                      onClick={() => updateStatus(member.id, "SAFE")}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        member.status === "SAFE"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      Safe
                    </button>
                    <button
                      onClick={() => updateStatus(member.id, "CHECKED_IN")}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        member.status === "CHECKED_IN"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      Checked-in
                    </button>
                    <button
                      onClick={() => updateStatus(member.id, "NEEDS_HELP")}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        member.status === "NEEDS_HELP"
                          ? "bg-red-600 text-white animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      Needs Help
                    </button>
                  </div>
                </div>

                {/* Vulnerability Badges */}
                {member.vulnerabilities.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>Vulnerability:</span>
                    </span>
                    {member.vulnerabilities.map((v, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-semibold"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Grab-Bag Kit (Section 28) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Emergency 72-Hour Grab-Bag
              </h3>
              <p className="text-xs text-slate-500">Official NDMA Monsoon Evacuation Kit</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {checklist.filter(c => c.checked).length} / {checklist.length} Packed
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                  item.checked
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-500"
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={item.checked ? "line-through opacity-80" : "font-medium"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
            <strong>Pro Tip:</strong> Keep this backpack near the main door or highest accessible floor. Include copies of ID cards and emergency contacts in a sealed Ziploc bag.
          </div>
        </div>
      </div>
    </div>
  );
};
