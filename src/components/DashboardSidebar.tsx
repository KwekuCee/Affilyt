import { NavLink as RouterNavLink, useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Store, DollarSign, Settings, Package, Users, CreditCard, BarChart3, ArrowLeft, Moon, Sun, HelpCircle, LogOut, Server, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const affiliateLinks = [
  { to: "/dashboard/affiliate", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/affiliate/marketplace", label: "Marketplace", icon: Store },
  { to: "/dashboard/affiliate/payouts", label: "Payouts", icon: DollarSign },
  { to: "/dashboard/affiliate/profile", label: "Profile", icon: Users },
  { to: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/admin/inventory", label: "Inventory", icon: Package },
  { to: "/dashboard/admin/sellers", label: "Sellers", icon: Users },
  { to: "/dashboard/admin/payouts", label: "Payouts", icon: CreditCard },
  { to: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/admin/audit", label: "Audit Logs", icon: Server },
  { to: "/dashboard/admin/security", label: "Security", icon: ShieldCheck },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  type: "affiliate" | "admin";
}

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const { dark, toggleDark } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = type === "admin" ? adminLinks : affiliateLinks;

  const handleLogout = () => {
    // Navigate home, simulation
    navigate("/");
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/40 backdrop-blur-3xl p-6 gap-8">
      <div className="px-2">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground uppercase tracking-wider italic">The Ledger.</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{type === "admin" ? "Institutional" : "Partner"}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 select-none flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mb-4 ml-3">Operations</p>
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all ${active
                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <link.icon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground"}`} />
              {link.label}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-border pt-8 space-y-2">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mb-4 ml-3">System</p>
        <button onClick={toggleDark} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Luminous" : "Obscure"}
        </button>
        <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all">
          <LogOut className="h-4 w-4" />
          Terminate
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
