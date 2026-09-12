import React from "react";
import { Info } from "lucide-react";

interface DemoModeBannerProps {
  compact?: boolean;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ compact = false }) => (
  <div className={`flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 ${compact ? "py-1.5 text-[10px]" : "py-2 text-[11px]"}`}>
    <Info className="h-3.5 w-3.5 shrink-0" />
    <span><strong>PROTOTYPE / SIMULATION MODE</strong> · External government and satellite feeds are not connected; representative data is used for demonstration.</span>
  </div>
);
