import React from "react";
import { RiskLevel } from "../types";

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  contributingFactors?: { factor: string; weightPct: number; value: string; impact: string }[];
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  contributingFactors,
  size = 220
}) => {
  const radius = (size - 30) / 2;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  const getColor = () => {
    switch (riskLevel) {
      case "EMERGENCY":
        return "#ef4444"; // red-500
      case "PREPARE":
        return "#f97316"; // orange-500
      case "WATCH":
        return "#eab308"; // yellow-500
      case "NORMAL":
      default:
        return "#10b981"; // emerald-500
    }
  };

  const color = getColor();

  return (
    <div id="risk-gauge-container" className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform rotate-[135deg]"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />
          {/* Active Colored Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s ease" }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Risk Index
          </span>
          <div className="flex items-baseline gap-1 my-0.5">
            <span className="text-4xl font-extrabold tracking-tight" style={{ color }}>
              {score}
            </span>
            <span className="text-xs font-medium text-slate-400">/100</span>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs"
            style={{
              backgroundColor: `${color}18`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {riskLevel}
          </span>
        </div>
      </div>

      {contributingFactors && contributingFactors.length > 0 && (
        <div className="w-full mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
            <span>Contributing Factor</span>
            <span>Weight / Value</span>
          </div>
          {contributingFactors.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px] sm:max-w-none">
                {item.factor}
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
                <span className="text-[10px] text-slate-400">({item.weightPct}%)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
