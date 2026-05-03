import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type SellerTier = "Basic" | "Standard" | "Pro";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  profile: any | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  dark: boolean;
  toggleDark: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleDark = () => setDark((v) => !v);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  const checkAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
      await checkAdmin(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const hydrateUser = async (authUser: User) => {
      const [profileData] = await Promise.all([
        fetchProfile(authUser.id),
        checkAdmin(authUser.id),
      ]);
      return profileData;
    };

    // Check initial session
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user) {
          setUser(currentSession.user);
          await hydrateUser(currentSession.user);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Safety timeout: ensure loading always finishes
    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        if (!currentSession?.user) {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const authUser = currentSession.user;
        setUser(authUser);
        setIsLoading(true);

        setTimeout(() => {
          if (!mounted) return;
          hydrateUser(authUser)
            .catch((err) => console.error("Auth change error:", err))
            .finally(() => {
              if (mounted) setIsLoading(false);
            });
        }, 0);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const value = React.useMemo(() => ({
    user,
    session,
    isLoading,
    isAdmin,
    profile,
    signOut,
    refreshProfile,
    dark,
    toggleDark
  }), [user, session, isLoading, isAdmin, profile, dark]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
