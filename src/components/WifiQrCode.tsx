import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Check, Sparkles } from "lucide-react";

interface WifiQrCodeProps {
  ssid: string;
  password?: string;
  encryption?: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
  size?: number;
  logoSrc?: string;
  className?: string;
}

export default function WifiQrCode({
  ssid,
  password = "",
  encryption = "WPA",
  hidden = false,
  size = 220,
  logoSrc = "/icon.png",
  className = "",
}: WifiQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Standard Wi-Fi QR Code string format:
  // WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
  const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};${hidden ? "H:true;" : ""};`;

  useEffect(() => {
    let isCancelled = false;

    const renderQR = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        // High error correction (H = 30%) allows drawing a logo in the center
        await QRCode.toCanvas(canvas, wifiString, {
          width: size,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#030712", // slate-950
            light: "#ffffff",
          },
        });

        if (isCancelled) return;

        // Draw central logo overlay
        if (logoSrc) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const logo = new Image();
            logo.crossOrigin = "anonymous";
            logo.src = logoSrc;

            logo.onload = () => {
              if (isCancelled) return;
              const logoSize = Math.floor(size * 0.24); // 24% of QR size keeps it within safe error correction limits
              const center = size / 2;
              const x = center - logoSize / 2;
              const y = center - logoSize / 2;
              const padding = 4;
              const badgeSize = logoSize + padding * 2;
              const badgeX = center - badgeSize / 2;
              const badgeY = center - badgeSize / 2;
              const borderRadius = 8;

              // Draw white badge background with soft border
              ctx.save();
              ctx.fillStyle = "#ffffff";
              ctx.strokeStyle = "#e2e8f0";
              ctx.lineWidth = 2;

              if (typeof ctx.roundRect === "function") {
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, borderRadius);
                ctx.fill();
                ctx.stroke();
              } else {
                ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);
                ctx.strokeRect(badgeX, badgeY, badgeSize, badgeSize);
              }

              // Clip and draw logo
              ctx.beginPath();
              if (typeof ctx.roundRect === "function") {
                ctx.roundRect(x, y, logoSize, logoSize, 6);
                ctx.clip();
              }
              ctx.drawImage(logo, x, y, logoSize, logoSize);
              ctx.restore();

              setIsRendered(true);
            };
          }
        } else {
          setIsRendered(true);
        }
      } catch (err) {
        console.error("Failed to generate Wi-Fi QR code:", err);
      }
    };

    renderQR();

    return () => {
      isCancelled = true;
    };
  }, [wifiString, size, logoSrc]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `TechNeyo-Guest-Wifi-QR.png`;
    link.href = dataUrl;
    link.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Container */}
      <div className="relative rounded-2xl bg-white p-3 shadow-xl ring-4 ring-cyan-500/20">
        <canvas ref={canvasRef} width={size} height={size} className="block rounded-lg" />
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          {downloaded ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Download className="h-3 w-3" />
              <span>Download QR</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
