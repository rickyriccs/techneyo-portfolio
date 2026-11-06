import React from "react";
import { cn } from "@/lib/utils";

interface BadgePillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "orange" | "cyan" | "emerald" | "neutral";
  pulsing?: boolean;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  children,
  icon,
  variant = "cyan",
  pulsing = false,
  className = "",
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case "orange":
        return "border-[#FE6F17]/30 bg-[#FE6F17]/10 text-orange-200 shadow-[0_0_15px_-3px_rgba(254,111,23,0.3)]";
      case "cyan":
        return "border-[#00A0E0]/30 bg-[#00A0E0]/10 text-cyan-200 shadow-[0_0_15px_-3px_rgba(0,160,224,0.3)]";
      case "emerald":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]";
      case "neutral":
      default:
        return "border-white/10 bg-white/[0.05] text-slate-300";
    }
  };

  const getPulseDotColor = () => {
    switch (variant) {
      case "orange":
        return "bg-[#FE6F17]";
      case "cyan":
        return "bg-[#00A0E0]";
      case "emerald":
        return "bg-emerald-400";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md transition-all duration-200",
        getStyles(),
        className
      )}
      {...props}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              getPulseDotColor()
            )}
          />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", getPulseDotColor())} />
        </span>
      )}
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
