import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";

const AdminGuard = () => {
  const location = useLocation();
  const { isConfigured, isLoading, session, profile } = useAdminAuth();

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background px-4 py-20">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Supabase is not configured</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-20">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background px-4 py-20">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Admin access is not enabled</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This user is signed in, but there is no active matching row in `admin_profiles`.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminGuard;
