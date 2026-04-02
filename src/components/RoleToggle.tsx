import { useAuth, UserRole } from "@/context/AuthContext";
import { Shield, ShoppingBag, Users, Moon, Sun } from "lucide-react";

const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
  { role: "PUBLIC_VISITOR", label: "Public", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  { role: "AFFILIATE", label: "Affiliate", icon: <Users className="h-3.5 w-3.5" /> },
  { role: "SUPERADMIN", label: "Admin", icon: <Shield className="h-3.5 w-3.5" /> },
];

const RoleToggle = () => {
  const { role, setRole, dark, toggleDark } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full glass p-1 shadow-lg">
      {roles.map((r) => (
        <button
          key={r.role}
          onClick={() => setRole(r.role)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            role === r.role
              ? "gradient-btn shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {r.icon}
          {r.label}
        </button>
      ))}
      <div className="mx-1 h-5 w-px bg-border" />
      <button
        onClick={toggleDark}
        className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

export default RoleToggle;
