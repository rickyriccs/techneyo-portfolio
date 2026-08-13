import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Sparkles, ShieldCheck, Zap, ArrowUpRight, Compass, Users } from "lucide-react";

interface GlobalHub {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  projects: string;
  services: string[];
  isHQ?: boolean;
}

const GLOBAL_HUBS: GlobalHub[] = [
  {
    id: "india-hq",
    name: "Mumbai & Bengaluru",
    region: "Global Operations Center",
    lat: 19.076,
    lng: 72.8777,
    projects: "120+ Active Projects",
    services: ["Core IT Labs", "Fullstack Web & Mobile", "AI Solutions"],
    isHQ: true,
  },
  {
    id: "usa-hub",
    name: "San Francisco & NY",
    region: "North America",
    lat: 37.7749,
    lng: -122.4194,
    projects: "28+ Enterprise Clients",
    services: ["Custom SaaS", "Cloud Systems", "Web Applications"],
  },
  {
    id: "uae-hub",
    name: "Dubai",
    region: "Middle East & GCC",
    lat: 25.2048,
    lng: 55.2708,
    projects: "20+ Retail & Real Estate",
    services: ["E-Commerce Funnels", "WhatsApp Automation", "Ad Campaigns"],
  },
  {
    id: "uk-hub",
    name: "London",
    region: "Europe & UK",
    lat: 51.5074,
    lng: -0.1278,
    projects: "15+ Tech Startups",
    services: ["Brand Websites", "UI/UX Redesign", "SEO Growth"],
  },
  {
    id: "sg-hub",
    name: "Singapore",
    region: "Southeast Asia",
    lat: 1.3521,
    lng: 103.8198,
    projects: "14+ Regional Brands",
    services: ["Lead Automation", "Mobile Apps", "Social Ads"],
  },
  {
    id: "aus-hub",
    name: "Sydney",
    region: "Australia & APAC",
    lat: -33.8688,
    lng: 151.2093,
    projects: "10+ Business Clients",
    services: ["Business Systems", "Custom Portals", "Digital Marketing"],
  },
];

// Utility for projecting 3D sphere lat/lng coordinates onto 2D canvas context
function projectLatLngTo3D(
  lat: number,
  lng: number,
  radius: number,
  rotationY: number,
  rotationX: number
): { x: number; y: number; z: number; visible: boolean } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180) + rotationY;

  // Spherical coordinates
  let x = -(radius * Math.sin(phi) * Math.cos(theta));
  let z = radius * Math.sin(phi) * Math.sin(theta);
  let y = radius * Math.cos(phi);

  // Apply tilt X rotation
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);

  const yTilted = y * cosX - z * sinX;
  const zTilted = y * sinX + z * cosX;

  return {
    x,
    y: yTilted,
    z: zTilted,
    visible: zTilted > -20, // visible on front hemisphere
  };
}

export const GlobalPresenceVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedHub, setSelectedHub] = useState<GlobalHub>(GLOBAL_HUBS[0]);
  const [hoveredHub, setHoveredHub] = useState<GlobalHub | null>(null);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);

  const rotationRef = useRef({ y: 0.8, x: 0.25 });
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let arcProgress = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const width = rect.width || parent.clientWidth || 320;
      const height = Math.max(340, Math.min(460, width * 0.9));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    resizeCanvas();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    // Settling ticks for mobile Safari layout initialization
    const rafId1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    });
    const timer1 = setTimeout(resizeCanvas, 150);
    const timer2 = setTimeout(resizeCanvas, 600);

    // Create latitude & longitude grid dots
    const gridPoints: { lat: number; lng: number }[] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng < 180; lng += 20) {
        gridPoints.push({ lat, lng });
      }
    }

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      if (isAutoSpinning && !isDraggingRef.current) {
        rotationRef.current.y += 0.003;
      }
      arcProgress = (arcProgress + 0.008) % 1;

      // Reset scale transform every frame to prevent cumulative scaling
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Outer glow atmosphere
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.35
      );
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      glowGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.06)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Sphere base fill
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, "#0e1e38");
      sphereGrad.addColorStop(0.7, "#091326");
      sphereGrad.addColorStop(1, "#030814");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sphere boundary stroke
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw latitude/longitude grid dots
      gridPoints.forEach((point) => {
        const p = projectLatLngTo3D(
          point.lat,
          point.lng,
          radius,
          rotationRef.current.y,
          rotationRef.current.x
        );
        if (p.visible) {
          const alpha = Math.max(0.1, (p.z / radius) * 0.5);
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.beginPath();
          ctx.arc(centerX + p.x, centerY + p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Project Hub points
      const projectedHubs = GLOBAL_HUBS.map((hub) => {
        const p = projectLatLngTo3D(
          hub.lat,
          hub.lng,
          radius,
          rotationRef.current.y,
          rotationRef.current.x
        );
        return { hub, p, cx: centerX + p.x, cy: centerY + p.y };
      });

      // Find India HQ projection
      const hqProj = projectedHubs.find((item) => item.hub.isHQ);

      // Draw Arcs from India HQ to all visible Hubs
      if (hqProj && hqProj.p.visible) {
        projectedHubs.forEach((target) => {
          if (!target.hub.isHQ && target.p.visible) {
            // Calculate bezier control point for curved arc above sphere
            const midX = (hqProj.cx + target.cx) / 2;
            const midY = (hqProj.cy + target.cy) / 2;
            const dist = Math.hypot(hqProj.cx - target.cx, hqProj.cy - target.cy);

            // Curve height proportional to distance
            const curveOffset = Math.min(60, dist * 0.35);
            const ctrlX = midX;
            const ctrlY = midY - curveOffset;

            // Arc stroke
            ctx.beginPath();
            ctx.moveTo(hqProj.cx, hqProj.cy);
            ctx.quadraticCurveTo(ctrlX, ctrlY, target.cx, target.cy);
            ctx.strokeStyle = "rgba(34, 211, 238, 0.4)";
            ctx.lineWidth = 1.2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Animated light pulse travelling along the arc
            const t = arcProgress;
            // Quadratic Bezier formula: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
            const pulseX =
              Math.pow(1 - t, 2) * hqProj.cx +
              2 * (1 - t) * t * ctrlX +
              Math.pow(t, 2) * target.cx;
            const pulseY =
              Math.pow(1 - t, 2) * hqProj.cy +
              2 * (1 - t) * t * ctrlY +
              Math.pow(t, 2) * target.cy;

            const pulseGlow = ctx.createRadialGradient(
              pulseX,
              pulseY,
              0,
              pulseX,
              pulseY,
              8
            );
            pulseGlow.addColorStop(0, "#38bdf8");
            pulseGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
            ctx.fillStyle = pulseGlow;
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Draw Hub Markers & Ripples
      projectedHubs.forEach(({ hub, p, cx, cy }) => {
        if (!p.visible) return;

        const isSelected = selectedHub.id === hub.id;
        const isHovered = hoveredHub?.id === hub.id;
        const isHQ = hub.isHQ;

        // Outer pulsing ring for HQ or Selected
        if (isHQ || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(cx, cy, isHQ ? 12 : 9, 0, Math.PI * 2);
          ctx.strokeStyle = isHQ
            ? "rgba(52, 211, 153, 0.7)"
            : "rgba(56, 189, 248, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner solid node dot
        ctx.beginPath();
        ctx.arc(cx, cy, isHQ ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isHQ
          ? "#10b981"
          : isSelected
          ? "#38bdf8"
          : "#60a5fa";
        ctx.fill();

        // White core dot
        ctx.beginPath();
        ctx.arc(cx, cy, isHQ ? 2 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Label above hub point
        const alpha = Math.min(1, Math.max(0.4, (p.z + 10) / (radius + 10)));
        ctx.font = isHQ ? "bold 11px sans-serif" : "500 10px sans-serif";
        ctx.fillStyle = isHQ
          ? `rgba(52, 211, 153, ${alpha})`
          : `rgba(226, 232, 240, ${alpha})`;
        ctx.textAlign = "center";
        ctx.fillText(hub.name, cx, cy - (isHQ ? 14 : 11));
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId1);
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoSpinning, selectedHub, hoveredHub]);

  // Mouse & Touch drag interaction handlers for rotating the globe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsAutoSpinning(false);
    previousMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMouseRef.current.x;
    const deltaY = e.clientY - previousMouseRef.current.y;

    rotationRef.current.y += deltaX * 0.005;
    rotationRef.current.x = Math.max(
      -0.6,
      Math.min(0.6, rotationRef.current.x + deltaY * 0.005)
    );

    previousMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsAutoSpinning(false);
      previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseRef.current.x;
    const deltaY = e.touches[0].clientY - previousMouseRef.current.y;

    rotationRef.current.y += deltaX * 0.005;
    rotationRef.current.x = Math.max(
      -0.6,
      Math.min(0.6, rotationRef.current.x + deltaY * 0.005)
    );

    previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full rounded-2xl border border-white/12 bg-[#060e1d]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <Globe className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            Global Presence & Network
          </div>
          <h3 className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
            Serving Worldwide & Global Markets
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Multi-Region Active
        </div>
      </div>

      {/* Main Visual Section: Interactive Canvas + Hub Info */}
      <div className="relative mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Canvas Sphere Area */}
        <div
          className="relative flex min-h-[340px] items-center justify-center rounded-xl border border-white/5 bg-gradient-to-b from-blue-950/20 to-slate-950/40 p-2 cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <canvas ref={canvasRef} className="max-w-full" />

          {/* Compass & Drag Hint overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-400 border border-white/10 backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>Drag to rotate globe</span>
          </div>

          {/* Quick Hub Selector Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[200px] sm:max-w-[280px]">
            {GLOBAL_HUBS.map((hub) => {
              const active = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setSelectedHub(hub);
                    setIsAutoSpinning(false);
                  }}
                  onMouseEnter={() => setHoveredHub(hub)}
                  onMouseLeave={() => setHoveredHub(null)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                    active
                      ? hub.isHQ
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {hub.region.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hub & Region Info Card */}
        <div className="flex flex-col justify-between rounded-xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 to-blue-950/60 p-4 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${selectedHub.isHQ ? "text-emerald-400" : "text-cyan-400"}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {selectedHub.region}
                </span>
              </div>
              {selectedHub.isHQ && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  Global HQ
                </span>
              )}
            </div>

            <h4 className="mt-3 text-lg font-bold text-white flex items-center justify-between">
              {selectedHub.name}
            </h4>
            <p className="text-xs font-medium text-cyan-300/90 mt-0.5">
              {selectedHub.projects}
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Services Delivered in Region:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedHub.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Regional Performance Stats */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs">
            <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                <span>Response Time</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">&lt; 15 Mins</p>
            </div>
            <div className="rounded-lg bg-white/5 p-2.5 border border-white/5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cloud Uptime</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">99.9% Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Global Metric Chips */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 border-t border-white/10 pt-4">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center transition-all hover:border-cyan-500/30">
          <div className="font-display text-xl font-bold text-white sm:text-2xl">50+</div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Global Projects
          </p>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center transition-all hover:border-cyan-500/30">
          <div className="font-display text-xl font-bold text-white sm:text-2xl">12+</div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Countries Served
          </p>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center transition-all hover:border-cyan-500/30">
          <div className="font-display text-xl font-bold text-white sm:text-2xl">24/7</div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Global Support
          </p>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center transition-all hover:border-cyan-500/30">
          <div className="font-display text-xl font-bold text-emerald-400 sm:text-2xl">99.9%</div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            System Reliability
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalPresenceVisual;
