import React from "react";
import {
  Layers,
  Radio,
  Satellite,
  Waves,
  Mountain,
  FileSpreadsheet,
  CheckCircle2,
  Activity,
  ArrowRight,
  Database,
  Cpu
} from "lucide-react";

export const DataFusionPage: React.FC = () => {
  const feeds = [
    {
      id: "feed-1",
      name: "Satellite Earth Observation",
      source: "ISRO / IMD INSAT-3DR & 3D VHRR",
      parameters: "Cloud Top Temperature (-68°C), Thermal Infrared Hydro-Estimator",
      latency: "15 min",
      contribution: "20%",
      status: "SIMULATED",
      protocol: "HDF5 S3 Ingestion",
      icon: Satellite,
      color: "bg-blue-600"
    },
    {
      id: "feed-2",
      name: "Doppler Weather Radar (DWR)",
      source: "IMD Hyderabad S-Band Polarimetric Radar",
      parameters: "Reflectivity (48 dBZ), Radial Velocity (18 m/s), Convective Core",
      latency: "5 min",
      contribution: "25%",
      status: "SIMULATED",
      protocol: "GRIB2 Radar Mosaic",
      icon: Radio,
      color: "bg-red-600"
    },
    {
      id: "feed-3",
      name: "Automated Weather Stations (AWS)",
      source: "Telangana Planning Society & IMD Rain Gauges",
      parameters: "Rainfall Rate (28 mm/hr), Cumulative 24h (142 mm), Temp, Humidity",
      latency: "1 min",
      contribution: "20%",
      status: "SIMULATED",
      protocol: "REST API / MQTT Telemetry",
      icon: Activity,
      color: "bg-emerald-600"
    },
    {
      id: "feed-4",
      name: "River Stage & Discharge Gauges",
      source: "Central Water Commission (CWC)",
      parameters: "River Musi Stage (512.4m), Himayat Sagar / Osman Sagar Outflows",
      latency: "10 min",
      contribution: "15%",
      status: "SIMULATED",
      protocol: "CWC Hydro-Net WFS",
      icon: Waves,
      color: "bg-indigo-600"
    },
    {
      id: "feed-5",
      name: "Numerical Weather Models (NWP)",
      source: "NCMRWF / IMD WRF 3km High-Resolution",
      parameters: "6h Quantitative Precipitation Forecast (QPF), Vorticity, Cape (2200 J/kg)",
      latency: "3 hours",
      contribution: "10%",
      status: "SIMULATED",
      protocol: "NetCDF4 Gridded Raster",
      icon: Cpu,
      color: "bg-purple-600"
    },
    {
      id: "feed-6",
      name: "Digital Elevation Models (DEM)",
      source: "ISRO Cartosat DEM & SRTM 30m",
      parameters: "Flow Direction, Topographic Wetness Index (TWI), Depression Sinks",
      latency: "Static (Pre-computed)",
      contribution: "5%",
      status: "SIMULATED",
      protocol: "Cloud-Optimized GeoTIFF",
      icon: Mountain,
      color: "bg-amber-600"
    },
    {
      id: "feed-7",
      name: "Crowdsourced Reports & Traffic Cameras",
      source: "AAPADRAKSHA Citizen Mobile App & Smart City CCTV",
      parameters: "Computer Vision Flood Inundation Detections, Submerged Road Reports",
      latency: "Real-time (<10s)",
      contribution: "5%",
      status: "SIMULATED",
      protocol: "WebSockets & GeoJSON",
      icon: FileSpreadsheet,
      color: "bg-teal-600"
    }
  ];

  return (
    <div id="data-fusion-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Multi-Sensor Data Fusion & Ingestion Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              7 Simulated Inputs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Heterogeneous data ingestion marrying earth observation, Doppler radar, river sensors, and physical terrain constraints.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Pipeline Throughput:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            Prototype input stream
          </span>
        </div>
      </div>

      {/* Visual Pipeline Architecture Graphic */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm tracking-wide">Real-Time Sensor Fusion Architecture</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Kalman & Neural Attention Merging
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-300">1. Ingestion Layer</span>
            <div className="font-bold">Heterogeneous Adapters</div>
            <p className="text-[11px] text-slate-300">
              Parses GeoTIFF, NetCDF4, GRIB2, REST telemetry, and MQTT streams into unified tensors.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-300">2. Quality & Interpolation</span>
            <div className="font-bold">Kriging & Bias Correction</div>
            <p className="text-[11px] text-slate-300">
              Corrects radar attenuation using ground rain gauges with spatiotemporal Kriging.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-300">3. Hydrodynamic Neural Core</span>
            <div className="font-bold">Trained logistic classifier + depth approximation</div>
            <p className="text-[11px] text-slate-300">
              Integrates physical boundary layers with deep temporal networks to model backwater surges.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-300">4. Decision Intelligence</span>
            <div className="font-bold">Early Warnings & Routing</div>
            <p className="text-[11px] text-slate-300">
              Outputs ward-level risk probabilities, safe corridor routes, and NDMA alert dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* Sensor Feed Cards Grid (Section 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feeds.map(feed => {
          const Icon = feed.icon;

          return (
            <div
              key={feed.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl text-white ${feed.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {feed.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {feed.source}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {feed.status}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
                  Parameters Monitored:
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">
                  {feed.parameters}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Latency: <strong className="text-slate-700 dark:text-slate-300">{feed.latency}</strong></span>
                <span>Fusion Weight: <strong className="text-blue-600 dark:text-blue-400">{feed.contribution}</strong></span>
                <span className="text-slate-400 truncate max-w-[120px]">{feed.protocol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
