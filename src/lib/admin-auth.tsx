import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "admin" | "manager" | "viewer";
  must_change_password: boolean;
  is_active: boolean;
};

type AdminAuthState = {
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  refreshProfile: (userId?: string) => Promise<AdminProfile | null>;
};

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

const loadAdminProfile = async (userId: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id,email,full_name,role,must_change_password,is_active")
    .eq("id", userId)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as AdminProfile;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async (userId = session?.user?.id) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    const adminProfile = await loadAdminProfile(userId);
    setProfile(adminProfile);
    return adminProfile;
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(data.session);
      if (data.session?.user?.id) {
        setProfile(await loadAdminProfile(data.session.user.id));
      }
      setIsLoading(false);
    };

    init();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user?.id) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      loadAdminProfile(nextSession.user.id).then((adminProfile) => {
        if (isMounted) {
          setProfile(adminProfile);
          setIsLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      isConfigured: Boolean(supabase),
      refreshProfile,
    }),
    [session, profile, isLoading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
};
