import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "affiliate" | "seller" | "authenticated";

interface Props {
  role: Role;
  children: ReactNode;
}

/**
 * Client-side RBAC guard (defense-in-depth). Server RLS remains the source of truth.
 * Blocks access to admin/affiliate/seller-only routes for the wrong roles or anonymous users.
 */
const ProtectedRoute = ({ role, children }: Props) => {
  const { user, isAdmin, profile, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [checking, setChecking] = useState(role === "seller");
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setAllowed(false);
      return;
    }

    if (role === "authenticated") {
      setAllowed(true);
      return;
    }

    if (role === "admin") {
      setAllowed(isAdmin);
      return;
    }

    if (role === "affiliate") {
      setAllowed(isAdmin || !!profile?.package_tier);
      return;
    }

    if (role === "seller") {
      (async () => {
        setChecking(true);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["seller", "admin"] as any);
        setAllowed(!!data && data.length > 0);
        setChecking(false);
      })();
    }
  }, [user, isAdmin, profile, isLoading, role]);

  useEffect(() => {
    if (allowed === false && user) {
      toast({
        title: "Access denied",
        description: `This area is restricted to ${role} accounts.`,
        variant: "destructive",
      });
    }
  }, [allowed, user, role, toast]);

  if (isLoading || allowed === null || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowed) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
