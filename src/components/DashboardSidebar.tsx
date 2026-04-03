import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Store, DollarSign, Settings, Package, Users, CreditCard, BarChart3, ArrowLeft, Moon, Sun, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const affiliateLinks = [
  { to: "/dashboard/affiliate", label: "Dashboard", icon: LayoutDashboard },
  { to: "/", label: "Marketplace", icon: Store },
  { to: "/dashboard/affiliate/payouts", label: "Payouts", icon: DollarSign },
  { to: "/dashboard/affiliate/profile", label: "Profile", icon: Users },
  { to: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/dashboard/admin", label: "Inventory", icon: Package },
  { to: "/dashboard/admin/sellers", label: "Sellers", icon: Users },
  { to: "/dashboard/admin/payouts", label: "Payouts", icon: CreditCard },
  { to: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  type: "affiliate" | "admin";
}

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const { dark, toggleDark, affiliateName } = useAuth();
  const location = useLocation();
  const links = type === "admin" ? adminLinks : affiliateLinks;

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-card">
      <div className="px-5 pt-6 pb-4">
        <Link to="/" className="block">
          <h2 className="text-sm font-bold text-foreground leading-tight">Executive Ledger</h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">
            {type === "admin" ? "SYSTEM OVERSIGHT" : "MARKETPLACE ADMIN"}
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-0.5">
        {type === "affiliate" && (
          <div className="rounded-lg bg-primary px-3 py-3 mb-2">
            <p className="text-[10px] font-medium text-primary-foreground/70">Current Tier</p>
            <p className="text-sm font-bold text-primary-foreground">Enterprise Pro</p>
          </div>
        )}
        {type === "admin" && (
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Store className="h-4 w-4" />
            Export Ledger
          </Link>
        )}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <HelpCircle className="h-4 w-4" />
          {type === "admin" ? "Support" : "Help Center"}
        </button>
        <button
          onClick={toggleDark}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
