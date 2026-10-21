import { useCurrency } from "@/context/CurrencyContext";

interface CurrencyToggleProps {
  className?: string;
  isMobile?: boolean;
}

export const CurrencyToggle = ({ className = "", isMobile = false }: CurrencyToggleProps) => {
  const { currency, setCurrency } = useCurrency();

  if (isMobile) {
    return (
      <div className={`flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2 ${className}`}>
        <span className="text-xs font-semibold text-slate-300">Display Currency:</span>
        <div className="flex items-center gap-1 rounded-lg bg-black/40 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
              currency === "INR"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ₹ INR
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
              currency === "USD"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            $ USD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-white/10 bg-[#0b1329]/80 p-0.5 backdrop-blur-md shadow-inner transition-all hover:border-cyan-500/30 ${className}`}
      role="group"
      aria-label="Currency Selector"
    >
      <button
        type="button"
        onClick={() => setCurrency("INR")}
        title="Show prices in Indian Rupees (₹)"
        className={`relative rounded-md px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          currency === "INR"
            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        ₹ INR
      </button>
      <button
        type="button"
        onClick={() => setCurrency("USD")}
        title="Show prices in US Dollars ($)"
        className={`relative rounded-md px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
          currency === "USD"
            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        $ USD
      </button>
    </div>
  );
};

export default CurrencyToggle;
