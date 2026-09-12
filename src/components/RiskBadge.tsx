import React from "react";
import { RiskLevel } from "../types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = "md",
  showDot = true
}) => {
  const getStyle = () => {
    switch (level) {
      case "EMERGENCY":
        return {
          bg: "bg-red-100 dark:bg-red-950/60",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-300 dark:border-red-800",
          dot: "bg-red-500 animate-pulse"
        };
      case "CRITICAL":
        return {
          bg: "bg-red-100 dark:bg-red-950/60",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-300 dark:border-red-800",
          dot: "bg-red-500 animate-pulse"
        };
      case "HIGH":
        return {
          bg: "bg-orange-100 dark:bg-orange-950/60",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-300 dark:border-orange-800",
          dot: "bg-orange-500"
        };
      case "PREPARE":
        return {
          bg: "bg-orange-100 dark:bg-orange-950/60",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-300 dark:border-orange-800",
          dot: "bg-orange-500"
        };
      case "ADVISORY":
        return {
          bg: "bg-blue-100 dark:bg-blue-950/60",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-300 dark:border-blue-800",
          dot: "bg-blue-500"
        };
      case "INFO":
        return {
          bg: "bg-slate-100 dark:bg-slate-800/80",
          text: "text-slate-700 dark:text-slate-300",
          border: "border-slate-300 dark:border-slate-700",
          dot: "bg-slate-500"
        };
      case "WATCH":
        return {
          bg: "bg-amber-100 dark:bg-amber-950/60",
          text: "text-amber-800 dark:text-amber-300",
          border: "border-amber-300 dark:border-amber-800",
          dot: "bg-amber-500"
        };
      case "NORMAL":
      default:
        return {
          bg: "bg-emerald-100 dark:bg-emerald-950/60",
          text: "text-emerald-800 dark:text-emerald-300",
          border: "border-emerald-300 dark:border-emerald-800",
          dot: "bg-emerald-500"
        };
    }
  };

  const style = getStyle();
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : size === "lg"
      ? "px-3.5 py-1 text-sm font-bold"
      : "px-2.5 py-0.5 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} whitespace-nowrap`}
    >
      {showDot && <span className={`w-2 h-2 rounded-full ${style.dot}`} />}
      <span>{level}</span>
    </span>
  );
};
