import React from "react";
import { ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";

const sources = [
  { name: "India Meteorological Department", organization: "IMD", type: "Weather & Radar", status: "SIMULATED", api: "NOT CONNECTED", lastChecked: "Prototype data", auth: "REQUIRES API KEY", docs: "https://mausam.imd.gov.in/", notes: "Representative weather and radar values are used; official feed is not connected." },
  { name: "Central Water Commission", organization: "CWC", type: "Hydrology / River Gauges", status: "SIMULATED", api: "NOT CONNECTED", lastChecked: "Prototype data", auth: "REQUIRES REGISTRATION", docs: "https://cwc.gov.in/", notes: "Representative river-stage values are used; official telemetry is not connected." },
  { name: "NDMA SACHET", organization: "NDMA", type: "CAP / Alert Broadcast", status: "UNAVAILABLE", api: "NOT CONNECTED", lastChecked: "Not connected", auth: "REQUIRES REGISTRATION", docs: "https://sachet.ndma.gov.in/", notes: "Official CAP broadcast is unavailable in this prototype." },
  { name: "ISRO Bhuvan / NRSC", organization: "ISRO / NRSC", type: "Satellite / GIS", status: "SIMULATED", api: "NOT CONNECTED", lastChecked: "Prototype data", auth: "REQUIRES REGISTRATION", docs: "https://bhuvan.nrsc.gov.in/", notes: "Representative geospatial layers are used; official service is not connected." },
  { name: "ISRO MOSDAC", organization: "ISRO", type: "Satellite Products", status: "DEMO", api: "NOT CONNECTED", lastChecked: "DEMO", auth: "REQUIRES API KEY", docs: "https://mosdac.gov.in/", notes: "Prototype integration only; no live feed connected." },
  { name: "NASA GPM / IMERG", organization: "NASA", type: "Satellite Rainfall", status: "UNAVAILABLE", api: "REQUIRES API KEY", lastChecked: "Not connected", auth: "REQUIRES API KEY", docs: "https://gpm.nasa.gov/", notes: "Official archive access requires NASA Earthdata credentials." },
  { name: "NASA Earthdata", organization: "NASA", type: "Earth Observation", status: "UNAVAILABLE", api: "REQUIRES API KEY", lastChecked: "Not connected", auth: "REQUIRES API KEY", docs: "https://www.earthdata.nasa.gov/", notes: "API integration requires institutional approval." },
  { name: "India-WRIS", organization: "MoJS / WRIS", type: "River Basins", status: "UNAVAILABLE", api: "NOT CONNECTED", lastChecked: "Not connected", auth: "REQUIRES REGISTRATION", docs: "https://indiawris.gov.in/", notes: "Hydrograph and basin inventory is listed for future connection." },
  { name: "USGS SRTM", organization: "USGS", type: "DEM / Elevation", status: "SIMULATED", api: "NOT CONNECTED", lastChecked: "Reference layer", auth: "REQUIRES REGISTRATION", docs: "https://www.usgs.gov/centers/eros/science/usgs-eros-archive-digital-elevation-shuttle-radar-topography-mission-srtm", notes: "Reference terrain values are used; no live service is connected." },
  { name: "Copernicus Climate Data Store / ECMWF ERA5", organization: "Copernicus / ECMWF", type: "Weather Reanalysis", status: "UNAVAILABLE", api: "REQUIRES API KEY", lastChecked: "Not connected", auth: "REQUIRES API KEY", docs: "https://cds.climate.copernicus.eu/", notes: "ERA5 and CDS are listed for future authorized access." },
  { name: "Open-Meteo", organization: "Open-Meteo", type: "Weather API", status: "UNAVAILABLE", api: "AVAILABLE", lastChecked: "Not connected", auth: "NO API KEY REQUIRED", docs: "https://open-meteo.com/", notes: "No live request is made by this prototype." },
  { name: "OpenWeather", organization: "OpenWeather", type: "Weather API", status: "UNAVAILABLE", api: "REQUIRES API KEY", lastChecked: "Not connected", auth: "REQUIRES API KEY", docs: "https://openweathermap.org/", notes: "Prototype integration only; keys must stay in backend env." }
];

export const AuthorityDataSourcesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Official Data Source Registry</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Data Integration Status</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          Official institutional data sources are listed for integration. Availability depends on API access, registration, credentials and institutional permissions.
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Source status is shown exactly as configured. Unconnected institutional feeds are not represented as live data.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {sources.map(source => (
          <div key={source.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{source.name}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{source.organization} • {source.type}</div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{source.status}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><span className="font-semibold text-slate-500 dark:text-slate-400">API availability:</span><div className="mt-1 font-bold">{source.api}</div></div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><span className="font-semibold text-slate-500 dark:text-slate-400">Last checked:</span><div className="mt-1 font-bold">{source.lastChecked}</div></div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><span className="font-semibold text-slate-500 dark:text-slate-400">Auth:</span><div className="mt-1 font-bold">{source.auth}</div></div>
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800"><span className="font-semibold text-slate-500 dark:text-slate-400">Documentation:</span><div className="mt-1 font-bold">{source.docs ? "Available" : "N/A"}</div></div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{source.notes}</p>

            <div className="mt-4 flex justify-end">
              <a href={source.docs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"><ExternalLink className="h-3.5 w-3.5" /> Open source</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
