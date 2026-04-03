import { useAuth, UserRole } from "@/context/AuthContext";
import { Shield, ShoppingBag, Users } from "lucide-react";

const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
  { role: "PUBLIC_VISITOR", label: "Public", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  { role: "AFFILIATE", label: "Affiliate", icon: <Users className="h-3.5 w-3.5" /> },
  { role: "SUPERADMIN", label: "Admin", icon: <Shield className="h-3.5 w-3.5" /> },
];

const RoleToggle = () => {
  const { role, setRole } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg">
      {roles.map((r) => (
        <button
          key={r.role}
          onClick={() => setRole(r.role)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            role === r.role
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {r.icon}
          {r.label}
        </button>
      ))}
    </div>
  );
};

export default RoleToggle;
