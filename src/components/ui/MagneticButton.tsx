import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 to 1 pull strength
  variant?: "primary" | "secondary" | "ghost";
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  strength = 0.25,
  variant = "primary",
  onClick,
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "btn-brand-primary";
      case "secondary":
        return "btn-brand-secondary";
      case "ghost":
        return "bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10";
      default:
        return "btn-brand-primary";
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.5 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FE6F17]/50 disabled:opacity-50 disabled:cursor-not-allowed",
        getVariantStyles(),
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
