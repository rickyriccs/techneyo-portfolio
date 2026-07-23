import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleDot, ExternalLink, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Project = {
  project_name: string;
  project_status: "In Progress" | "Completed";
};

type Client = {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  company_description: string;
  company_website_url?: string | null;
  projects: Project[];
  display_order: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.55, ease: "easeOut" as const },
  }),
};

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("portfolio_clients")
          .select("id,company_name,company_logo_url,company_description,company_website_url,projects,display_order")
          .order("display_order", { ascending: true });

        if (!error && data) {
          const formatted = data.map((row) => ({
            ...row,
            projects: Array.isArray(row.projects) ? (row.projects as Project[]) : [],
          }));
          setClients(formatted);
        }
      } catch (err) {
        console.error("Error loading clients:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (isLoading || clients.length === 0) {
    // If no clients exist, the section gracefully hides itself completely (display: none)
    return null;
  }

  // Helper to extract company initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <section className="premium-section bg-white/[0.01] border-y border-white/5 py-24">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={fadeUp} custom={0} className="mx-auto max-w-3xl text-center">
            <p className="premium-eyebrow">Proven Experience</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              Trusted by Forward-Thinking Businesses
            </h2>
            <p className="mt-4 text-base leading-7 text-white/60 sm:text-lg">
              We collaborate with companies across Bharat & Asia to design websites, configure CRM systems, and automate workflows.
            </p>
          </motion.div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                variants={fadeUp}
                custom={index + 1}
                onClick={() => setSelectedClient(client)}
                className="premium-card premium-card-hover group flex flex-col items-center justify-between p-5 min-h-[145px] cursor-pointer text-center transition-all duration-300 hover:border-cyan-500/30"
              >
                <div className="flex flex-1 items-center justify-center w-full min-h-[64px] max-h-[72px] mb-3">
                  {client.company_logo_url ? (
                    <img
                      src={client.company_logo_url}
                      alt={`${client.company_name} Logo`}
                      className="max-h-full max-w-full object-contain filter grayscale opacity-60 transition-all duration-300 ease-in-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] font-display text-base font-bold text-white/50 transition-all duration-300 ease-in-out group-hover:bg-white/[0.08] group-hover:text-cyan-200 group-hover:border-cyan-500/20 group-hover:scale-105">
                      {getInitials(client.company_name)}
                    </div>
                  )}
                </div>
                <span className="block w-full text-xs font-semibold tracking-wide text-white/50 group-hover:text-cyan-200 transition-colors line-clamp-2 leading-tight">
                  {client.company_name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Deep-dive Details Modal */}
      <Dialog open={selectedClient !== null} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="max-w-xl border-white/10 bg-[#070b19]/95 text-white backdrop-blur-xl shadow-2xl sm:rounded-xl">
          {selectedClient && (
            <div className="space-y-6">
              {/* Modal Header containing Logo/Initials and Title */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                {selectedClient.company_logo_url ? (
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded border border-white/5 bg-white p-2">
                    <img
                      src={selectedClient.company_logo_url}
                      alt={selectedClient.company_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04] font-display text-xl font-bold text-cyan-200">
                    {getInitials(selectedClient.company_name)}
                  </div>
                )}
                <div>
                  <DialogTitle className="font-display text-2xl font-bold text-white">
                    {selectedClient.company_name}
                  </DialogTitle>
                  <p className="text-xs tracking-wider uppercase text-cyan-300/70 mt-0.5">Partner Profile</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">About the Client</h4>
                <p className="text-sm leading-relaxed text-white/80 bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  {selectedClient.company_description}
                </p>
              </div>

              {/* Works/Projects list */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">Collaborations & Works</h4>
                
                {selectedClient.projects.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.01] px-4 py-3 text-sm text-white/50">
                    <HelpCircle size={16} className="text-white/30" />
                    <span>Project details coming soon.</span>
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {selectedClient.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm transition-all hover:bg-white/[0.04]"
                      >
                        <span className="font-medium text-white/90">{proj.project_name}</span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                            proj.project_status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {proj.project_status === "Completed" ? (
                            <CheckCircle2 size={12} className="text-emerald-400" />
                          ) : (
                            <CircleDot size={12} className="text-amber-400 animate-pulse" />
                          )}
                          {proj.project_status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer / Close Call-to-action */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                {selectedClient.company_website_url ? (
                  <a
                    href={selectedClient.company_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-xs font-semibold text-slate-950 transition-all shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20"
                  >
                    <span>Visit Website</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white tracking-wide transition-all"
                >
                  Dismiss Details
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ClientsSection;
