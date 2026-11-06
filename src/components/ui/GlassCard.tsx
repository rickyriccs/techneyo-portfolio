import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "orange" | "cyan" | "navy" | "none";
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glowColor = "cyan",
  interactive = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getGlowGradient = () => {
    switch (glowColor) {
      case "orange":
        return `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(254, 111, 23, 0.12), transparent 80%)`;
      case "cyan":
        return `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 160, 224, 0.12), transparent 80%)`;
      case "navy":
        return `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(1, 27, 82, 0.35), transparent 80%)`;
      default:
        return "none";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl border border-white/[0.08] bg-[#06122B]/70 backdrop-blur-xl transition-all duration-300",
        interactive && "hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      {interactive && isHovered && glowColor !== "none" && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{ background: getGlowGradient() }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
