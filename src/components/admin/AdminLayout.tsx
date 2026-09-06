import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, BriefcaseBusiness, Building2, CreditCard, FileText, Gift, LayoutDashboard, LogOut, Package, Settings, Shield, TrendingUp, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";

const adminLinks = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", path: "/admin/analytics", icon: TrendingUp },
  { label: "Blogs", path: "/admin/blogs", icon: BookOpen },
  { label: "Enquiries", path: "/admin/enquiries", icon: FileText },
  { label: "Bookings", path: "/admin/bookings", icon: CreditCard },
  { label: "Services", path: "/admin/services", icon: BriefcaseBusiness },
  { label: "Offers", path: "/admin/offers", icon: Gift },
  { label: "Packages", path: "/admin/packages", icon: Package },
  { label: "Tools", path: "/admin/tools", icon: Wrench },
  { label: "Portfolio", path: "/admin/portfolio", icon: Building2 },
  { label: "Logs", path: "/admin/logs", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { profile } = useAdminAuth();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <Shield size={20} className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Techneyo Admin</p>
            <p className="text-xs text-muted-foreground">{profile?.role}</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {adminLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div>
              <Link to="/" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                View website
              </Link>
              <p className="text-sm font-medium text-foreground">{profile?.email}</p>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `shrink-0 rounded-md px-3 py-2 text-xs font-semibold ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
