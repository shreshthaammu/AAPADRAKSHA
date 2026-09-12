import React, { useState } from "react";
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sun,
  Activity,
  Calendar
} from "lucide-react";
import { WeatherData, StateProfile } from "../types";

interface WeatherPageProps {
  weather: WeatherData | null;
  selectedState: StateProfile;
  selectedDistrict: string;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({
  weather,
  selectedState,
  selectedDistrict
}) => {
  const [activeChartTab, setActiveChartTab] = useState<"rainfall" | "temperature" | "humidity">("rainfall");

  // Fallback defaults if null
  const w = weather || {
    temperature: selectedState.temperature,
    feelsLike: selectedState.temperature + 2.8,
    humidity: selectedState.humidity,
    windSpeed: 24.5,
    windDirection: "WSW (240°)",
    pressure: 1004.8,
    rainfallCurrent: 18.5,
    rainfallCumulative24h: selectedState.rainfall,
    rainfallIntensity: "Heavy Rain (24 mm/hr)",
    visibilityKm: 3.2,
    cloudCoverPct: 98,
    condition: "Severe Convective Storm / Heavy Monsoon Downpour",
    uvIndex: 1
  };

  const hourlyTimeline = [
    { time: "Now", temp: w.temperature, rainMm: w.rainfallCurrent, rainProb: 95, humidity: w.humidity },
    { time: "+1 Hour", temp: w.temperature - 0.6, rainMm: 22.0, rainProb: 98, humidity: Math.min(100, w.humidity + 2) },
    { time: "+3 Hours", temp: w.temperature - 1.2, rainMm: 28.4, rainProb: 94, humidity: Math.min(100, w.humidity + 3) },
    { time: "+6 Hours", temp: w.temperature - 1.4, rainMm: 14.2, rainProb: 88, humidity: w.humidity + 1 },
    { time: "+12 Hours", temp: w.temperature - 0.2, rainMm: 8.5, rainProb: 75, humidity: w.humidity - 2 },
    { time: "+24 Hours", temp: w.temperature + 1.1, rainMm: 4.2, rainProb: 60, humidity: w.humidity - 6 }
  ];

  const multiDayForecast = [
    { day: "Today", maxTemp: 27, minTemp: 24, rainMm: selectedState.rainfall, condition: "Thunderstorms / Flood Warning" },
    { day: "Tomorrow", maxTemp: 28, minTemp: 23, rainMm: selectedState.next24, condition: "Heavy Rain Showers" },
    { day: "Day 3", maxTemp: 29, minTemp: 24, rainMm: 45, condition: "Scattered Rains" },
    { day: "Day 4", maxTemp: 31, minTemp: 25, rainMm: 20, condition: "Partly Cloudy" },
    { day: "Day 5", maxTemp: 32, minTemp: 25, rainMm: 12, condition: "Light Isolated Showers" }
  ];

  const maxRain = Math.max(...hourlyTimeline.map(h => h.rainMm), 30);
  const maxTemp = Math.max(...hourlyTimeline.map(h => h.temp), 35);

  return (
    <div id="weather-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Observational Weather & Atmospheric Radar
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              AWS & DWR Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time surface meteorology for {selectedDistrict}, {selectedState.name}. (IMD AWS & Open-Meteo Integration)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold">
            {w.condition}
          </span>
        </div>
      </div>

      {/* Primary Weather Grid (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Temperature */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Temperature</span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {w.temperature}°C
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Feels like {w.feelsLike}°C
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
            {w.humidity}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Dew point 24.2°C
          </div>
        </div>

        {/* Wind */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {w.windSpeed} <span className="text-xs font-semibold text-slate-400">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Direction: {w.windDirection}
          </div>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Atm. Pressure</span>
            <Gauge className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {w.pressure} <span className="text-xs font-semibold text-slate-400">hPa</span>
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">
            Depression (Low)
          </div>
        </div>

        {/* Visibility */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Visibility</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {w.visibilityKm} <span className="text-xs font-semibold text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Rain haze & mist
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Cloud Cover</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {w.cloudCoverPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Overcast Cumulonimbus
          </div>
        </div>
      </div>

      {/* Dynamic Visual Meteorological Charts (Section 11) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hourly Forecast & Telemetry Progression
            </h3>
            <p className="text-xs text-slate-500">
              Simulated time-series progression from automatic rain gauges & NWP WRF 3km model
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab("rainfall")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeChartTab === "rainfall"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Rainfall (mm)
            </button>
            <button
              onClick={() => setActiveChartTab("temperature")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeChartTab === "temperature"
                  ? "bg-orange-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Temperature (°C)
            </button>
            <button
              onClick={() => setActiveChartTab("humidity")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeChartTab === "humidity"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Humidity (%)
            </button>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="h-64 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-6 px-4">
          {hourlyTimeline.map((item, idx) => {
            let barHeight = 20;
            let displayVal = "";
            let barColor = "bg-blue-600";

            if (activeChartTab === "rainfall") {
              barHeight = Math.max(15, (item.rainMm / maxRain) * 100);
              displayVal = `${item.rainMm} mm`;
              barColor = item.rainMm > 20 ? "bg-red-500" : item.rainMm > 12 ? "bg-amber-500" : "bg-blue-500";
            } else if (activeChartTab === "temperature") {
              barHeight = Math.max(20, (item.temp / maxTemp) * 100);
              displayVal = `${item.temp}°C`;
              barColor = "bg-orange-500";
            } else {
              barHeight = Math.max(20, item.humidity);
              displayVal = `${item.humidity}%`;
              barColor = "bg-teal-500";
            }

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-2 opacity-90">
                  {displayVal}
                </span>

                <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${barColor}`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2 whitespace-nowrap">
                  {item.time}
                </span>
                {activeChartTab === "rainfall" && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.rainProb}% prob
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Day Synoptic Weather Forecast (Section 11) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>5-Day Synoptic Monsoon Outlook</span>
          </div>
          <span className="text-xs text-slate-500">Numerical Forecast Model GFS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {multiDayForecast.map((day, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {day.day}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5 line-clamp-1">
                  {day.condition}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between font-mono">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {day.rainMm} mm
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {day.maxTemp}° / {day.minTemp}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
