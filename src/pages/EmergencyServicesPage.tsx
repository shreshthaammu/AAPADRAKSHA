import React, { useState } from "react";
import {
  PhoneCall,
  Shield,
  HeartPulse,
  Flame,
  Building2,
  Users,
  MapPin,
  ExternalLink,
  LifeBuoy,
  AlertOctagon,
  Search
} from "lucide-react";
import { EmergencyServiceItem, StateProfile } from "../types";

interface EmergencyServicesPageProps {
  selectedState: StateProfile;
  selectedDistrict: string;
  onOpenSOS: () => void;
  services: EmergencyServiceItem[];
}

export const EmergencyServicesPage: React.FC<EmergencyServicesPageProps> = ({
  selectedState,
  selectedDistrict,
  onOpenSOS,
  services
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const nationalHelplines = [
    { name: "National Emergency Helpline", number: "112", description: "Unified 24x7 all-emergency dispatch", badge: "Primary", icon: AlertOctagon, color: "bg-red-600" },
    { name: "Medical & Ambulance (EMRI)", number: "108", description: "Emergency medical response & trauma care", badge: "24x7", icon: HeartPulse, color: "bg-emerald-600" },
    { name: "Police Emergency Control", number: "100", description: "Immediate law enforcement & rescue cordon", badge: "24x7", icon: Shield, color: "bg-blue-600" },
    { name: "Fire & Disaster Rescue", number: "101", description: "Flood evacuation rafts & structural extraction", badge: "24x7", icon: Flame, color: "bg-orange-600" },
    { name: "NDMA National Helpline", number: "1078", description: "National Disaster Management Authority control room", badge: "National", icon: LifeBuoy, color: "bg-purple-600" },
    { name: "State Disaster Authority (SDMA)", number: "1070", description: `${selectedState.name} Disaster Management Department`, badge: "State", icon: Building2, color: "bg-indigo-600" }
  ];

  const fallbackFacilities = [
    {
      name: "Osmania General Hospital - Emergency Trauma Care",
      type: "Tertiary Hospital",
      distanceKm: 2.1,
      address: "Afzal Gunj, Hyderabad",
      phone: "+91-40-24600121",
      emergencyBeds: 180,
      status: "Operational / High Ground"
    },
    {
      name: "Gandhi Hospital - Flood Rescue Ward",
      type: "Specialized Medical Center",
      distanceKm: 4.8,
      address: "Musheerabad, Secunderabad",
      phone: "+91-40-27505566",
      emergencyBeds: 240,
      status: "Operational"
    },
    {
      name: "10th Battalion NDRF Control Room",
      type: "Search & Rescue Unit",
      distanceKm: 6.2,
      address: "Regional Response Base, Hyderabad",
      phone: "+91-40-27131114",
      boatsAvailable: 34,
      status: "Deployed to Chaderghat"
    },
    {
      name: "GHMC Monsoon Central Disaster Control Room",
      type: "Municipal Command Center",
      distanceKm: 3.4,
      address: "Tank Bund Road, Hyderabad",
      phone: "+91-40-21111111",
      tollFree: "040-29555500",
      status: "Command Active"
    },
    {
      name: "Red Cross Telangana Emergency Response",
      type: "NGO Relief & First Aid",
      distanceKm: "3.8 km",
      address: "Himayatnagar, Hyderabad",
      phone: "+91-40-23223633",
      status: "Relief Teams Ready"
    },
    {
      name: "Community Kitchen & Relief Supplies",
      type: "Food & Relief Distribution",
      distanceKm: "2.6 km",
      address: "Nampally Relief Supply Centre",
      phone: "+91-80080-1078",
      status: "Food Packets Dispatching"
    }
  ];

  const localFacilities = services.length > 0
    ? services.map(service => ({
        name: service.name,
        type: service.category,
        distanceKm: service.distance,
        address: service.address || selectedDistrict,
        phone: service.phone,
        status: service.status,
        coordinates: service.coordinates,
        website: service.website
      }))
    : fallbackFacilities;

  const filteredFacilities = localFacilities.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="emergency-services-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Services & Rapid Response Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Verified 24x7 Dispatches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Immediate contacts for SDRF, NDRF, fire rescue, hospitals, and disaster emergency rooms in {selectedDistrict}.
          </p>
        </div>

        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Broadcast SOS Beacon</span>
        </button>
      </div>

      {/* National / State Critical Helplines Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          National & State Disaster Toll-Free Helplines (Tap to Call)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nationalHelplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={`tel:${item.number}`}
                id={`helpline-card-${item.number}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className={`p-3 rounded-xl text-white ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.badge}
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono group-hover:text-blue-600">
                      {item.number}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Local Facilities & Command Control Rooms */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Local Critical Facilities in {selectedDistrict}
            </h3>
            <p className="text-xs text-slate-500">Hospitals, NDRF battalions, and municipal command centers</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hospitals or stations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    {fac.type}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {fac.name}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{fac.address} ({fac.distanceKm})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {fac.coordinates && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${fac.coordinates[0]},${fac.coordinates[1]}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-slate-600 dark:text-slate-200" title="Open location in Google Maps">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Map</span>
                    </a>
                  )}
                  <a
                    href={`tel:${fac.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <span>Phone: {fac.phone}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
                  ● {fac.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
