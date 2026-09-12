import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Layers, ShieldAlert, Home, AlertCircle, Compass } from "lucide-react";
import { ZoneData, ShelterItem, CitizenReportItem } from "../types";

const mapTilerKey = (import.meta as ImportMeta & { env?: { VITE_MAPTILER_KEY?: string } }).env?.VITE_MAPTILER_KEY;
const tileUrl = mapTilerKey
  ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${encodeURIComponent(mapTilerKey)}`
  : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

interface LiveMapProps {
  center: [number, number];
  zoom: number;
  zones: ZoneData[];
  selectedZoneId?: string;
  onSelectZone: (zone: ZoneData) => void;
  shelters?: ShelterItem[];
  reports?: CitizenReportItem[];
  showRoute?: boolean;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  center,
  zoom,
  zones,
  selectedZoneId,
  onSelectZone,
  shelters = [],
  reports = [],
  showRoute = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    zones: true,
    inundation: true,
    radar: true,
    shelters: true,
    reports: true,
    routes: showRoute
  });

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: true
      });

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        ...(mapTilerKey ? {} : { subdomains: "abcd" }),
        attribution: mapTilerKey ? "&copy; MapTiler &copy; OpenStreetMap contributors" : "&copy; OpenStreetMap contributors &copy; CARTO"
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const container = mapContainerRef.current;
    if (!map || !container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Render Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Render Zones
    if (activeLayers.zones) {
      zones.forEach(zone => {
        const isSelected = zone.id === selectedZoneId;
        const color =
          zone.risk === "EMERGENCY"
            ? "#ef4444"
            : zone.risk === "PREPARE"
            ? "#f97316"
            : zone.risk === "WATCH"
            ? "#eab308"
            : "#10b981";

        const circle = L.circle([zone.latitude, zone.longitude], {
          radius: isSelected ? 2200 : 1600,
          color: color,
          weight: isSelected ? 3 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.45 : 0.25,
          dashArray: isSelected ? "4, 6" : undefined
        });

        circle.bindTooltip(
          `<strong>${zone.name}</strong><br/>Risk: <span style="color:${color};font-weight:bold">${zone.risk}</span> (${zone.floodProb}%)<br/>Rainfall: ${zone.rainfall} mm<br/>Depth: ${zone.depth} m`,
          { direction: "top", permanent: false, className: "text-xs font-sans" }
        );

        circle.on("click", () => {
          onSelectZone(zone);
        });

        circle.addTo(group);
      });
    }

    // 2. Inundation Water Depth Simulation
    if (activeLayers.inundation) {
      const activeZone = zones.find(zone => zone.id === selectedZoneId) || zones[0];
      const severityScale = activeZone ? Math.max(0.004, Math.min(0.03, (activeZone.depth || 0.1) * 0.012 + (activeZone.floodProb || 0) * 0.00008)) : 0.01;
      const longitudeScale = severityScale * 1.7;
      const inundationCoords: [number, number][] = [
        [center[0] - severityScale, center[1] - longitudeScale],
        [center[0] - severityScale * 0.65, center[1] - longitudeScale * 0.35],
        [center[0] - severityScale * 0.3, center[1] + longitudeScale * 0.55],
        [center[0] - severityScale * 0.7, center[1] + longitudeScale],
        [center[0] - severityScale * 1.5, center[1] + longitudeScale * 0.75],
        [center[0] - severityScale * 1.25, center[1] - longitudeScale * 0.5]
      ];

      const waterPolygon = L.polygon(inundationCoords, {
        color: "#2563eb",
        weight: 1.5,
        fillColor: "#3b82f6",
        fillOpacity: 0.35
      });
      waterPolygon.bindTooltip(`Risk-based prototype inundation estimate: ${activeZone?.depth ?? 0}m depth, ${activeZone?.floodProb ?? 0}% probability`, { direction: "center" });
      waterPolygon.addTo(group);
    }

    // 3. Radar Precipitation Heatmap simulation
    if (activeLayers.radar) {
      const radarCenter = [center[0] + 0.015, center[1] + 0.01];
      const radarCircle = L.circle(radarCenter as [number, number], {
        radius: 3500,
        color: "#ec4899",
        weight: 1,
        fillColor: "#ec4899",
        fillOpacity: 0.18,
        dashArray: "3, 6"
      });
      radarCircle.bindTooltip("Doppler Radar Convective Core: Reflectivity > 45 dBZ (Heavy Rain)", { direction: "bottom" });
      radarCircle.addTo(group);
    }

    // 4. Shelters Markers
    if (activeLayers.shelters && shelters.length > 0) {
      shelters.forEach(sh => {
        if (!Array.isArray(sh.coordinates) || sh.coordinates.length !== 2) return;
        const shelterIcon = L.divIcon({
          className: "custom-shelter-marker",
          html: `<div style="background-color:#059669;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 5px rgba(0,0,0,0.3);border:2px solid white;font-size:14px;font-weight:bold;">🏠</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(sh.coordinates, { icon: shelterIcon });
        marker.bindPopup(
          `<div class="p-1">
            <h4 style="font-weight:bold;margin:0 0 4px 0;">${sh.name}</h4>
            <p style="font-size:11px;margin:0 0 4px 0;">${sh.address}</p>
            <div style="font-size:11px;color:#059669;font-weight:bold;">Slots: ${sh.availableSlots} / ${sh.capacity} Available</div>
            <div style="font-size:11px;color:#4b5563;">Distance: ${sh.distanceKm} km | Phone: ${sh.contact}</div>
          </div>`
        );
        marker.addTo(group);
      });
    }

    // 5. Citizen Reports Markers
    if (activeLayers.reports && reports.length > 0) {
      reports.forEach(rep => {
        if (!Array.isArray(rep.coordinates) || rep.coordinates.length !== 2) return;
        const isFlooded = rep.category.toLowerCase().includes("flood") || rep.severity === "CRITICAL";
        const iconColor = isFlooded ? "#dc2626" : "#d97706";
        const iconSymbol = isFlooded ? "🌊" : "⚠️";

        const repIcon = L.divIcon({
          className: "custom-report-marker",
          html: `<div style="background-color:${iconColor};color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;font-size:12px;">${iconSymbol}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(rep.coordinates, { icon: repIcon });
        marker.bindPopup(
          `<div class="p-1">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <strong style="color:${iconColor}">${rep.id}: ${rep.category}</strong>
              <span style="font-size:10px;background:#fee2e2;color:#b91c1c;padding:1px 4px;border-radius:4px;">${rep.status}</span>
            </div>
            <p style="font-size:11px;margin:4px 0;">${rep.description}</p>
            <div style="font-size:10px;color:#6b7280;">Location: ${rep.location}</div>
          </div>`
        );
        marker.addTo(group);
      });
    }

    // 6. Safe Evacuation Route vs Blocked Route
    if (activeLayers.routes) {
      // Current User Location Marker
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `<div style="background-color:#2563eb;width:18px;height:18px;border-radius:50%;box-shadow:0 0 0 6px rgba(37,99,235,0.3);border:2px solid white;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([center[0], center[1]], { icon: userIcon })
        .bindTooltip("You Are Here (Selected Location)", { permanent: false, direction: "top" })
        .addTo(group);

      // Safe Route (Green Polyline avoiding flooded causeways)
      const safeRoutePoints: [number, number][] = [
        [center[0], center[1]],
        [center[0] + 0.003, center[1] + 0.004],
        [center[0] + 0.007, center[1] + 0.006],
        [center[0] + 0.009, center[1] + 0.009],
        [17.3880, 78.4910] // To Shelter 1
      ];

      const safePolyline = L.polyline(safeRoutePoints, {
        color: "#10b981",
        weight: 5,
        opacity: 0.9,
        lineCap: "round"
      });
      safePolyline.bindTooltip("RECOMMENDED SAFE EVACUATION ROUTE (Avoids Inundated Underpasses)", { direction: "top" });
      safePolyline.addTo(group);

      // Blocked Road (Red Dashed Polyline)
      const blockedRoadPoints: [number, number][] = [
        [center[0], center[1]],
        [center[0] - 0.005, center[1] - 0.002],
        [center[0] - 0.009, center[1] + 0.004]
      ];
      const blockedPolyline = L.polyline(blockedRoadPoints, {
        color: "#ef4444",
        weight: 4,
        dashArray: "6, 8",
        opacity: 0.8
      });
      blockedPolyline.bindTooltip("HAZARD: ROAD CLOSED (Water Level > 1.2m at Causeway)", { direction: "bottom" });
      blockedPolyline.addTo(group);
    }
  }, [zones, selectedZoneId, activeLayers, shelters, reports, center, onSelectZone]);

  const resetView = () => {
    mapInstanceRef.current?.setView(center, zoom);
  };

  return (
    <div id="live-map-wrapper" className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Layer Toggles Control Panel (Floating Top Right) */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>GIS Map Layers</span>
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.zones}
              onChange={() => toggleLayer("zones")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Risk Zones (Green/Red)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.inundation}
              onChange={() => toggleLayer("inundation")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Predicted Inundation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.radar}
              onChange={() => toggleLayer("radar")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Doppler Radar Cloud Core</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.shelters}
              onChange={() => toggleLayer("shelters")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Relief Shelters</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.reports}
              onChange={() => toggleLayer("reports")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Citizen Flood Reports</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={activeLayers.routes}
              onChange={() => toggleLayer("routes")}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Safe Route Navigation</span>
          </label>
        </div>

        <button
          onClick={resetView}
          className="w-full mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
        >
          <Compass className="w-3 h-3" />
          <span>Center Region</span>
        </button>
      </div>

      {/* Floating Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200 dark:border-slate-800 text-[11px]">
        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
          Disaster Risk Legend
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Normal (0-49%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Watch (50-69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600 dark:text-slate-400">Prepare (70-84%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-slate-600 dark:text-slate-400">Emergency (85%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-sm" />
            <span className="text-slate-600 dark:text-slate-400">Safe Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border-b-2 border-dashed border-red-500" />
            <span className="text-slate-600 dark:text-slate-400">Hazard / Avoid</span>
          </div>
        </div>
      </div>
    </div>
  );
};
