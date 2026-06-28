import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin-auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConfigured, isLoading, session, profile, refreshProfile } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/admin/dashboard";

  if (!isLoading && session && profile) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!supabase) {
      setError("Supabase env variables are missing. Add them to .env.local and restart the dev server.");
      setIsSubmitting(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    const adminProfile = await refreshProfile(data.user?.id);
    if (!adminProfile) {
      setError("This account is authenticated but is not active in admin_profiles.");
      await supabase.auth.signOut();
      setIsSubmitting(false);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Techneyo Solutions</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Admin login</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in with a Supabase Auth admin account.</p>
          </div>

          {!isConfigured && (
            <div className="mb-5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              Supabase is not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
              <span className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
                <Mail size={16} className="text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
              <span className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
                <Lock size={16} className="text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none"
                />
              </span>
            </label>
            <button type="submit" disabled={isSubmitting || !isConfigured} className="btn-hero w-full disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            The user must exist in Supabase Auth and have an active row in `admin_profiles`.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
