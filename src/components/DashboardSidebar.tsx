import { NavLink as RouterNavLink, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Link2, DollarSign, Settings, Package, Users, CreditCard, ShoppingBag, ArrowLeft, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const affiliateLinks = [
  { to: "/dashboard/affiliate", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/affiliate/links", label: "My Links", icon: Link2 },
  { to: "/dashboard/affiliate/earnings", label: "Earnings", icon: DollarSign },
  { to: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { to: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/admin/products", label: "Products", icon: Package },
  { to: "/dashboard/admin/sellers", label: "Sellers", icon: Users },
  { to: "/dashboard/admin/payouts", label: "Payouts", icon: CreditCard },
];

interface DashboardSidebarProps {
  type: "affiliate" | "admin";
}

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const { dark, toggleDark } = useAuth();
  const location = useLocation();
  const links = type === "admin" ? adminLinks : affiliateLinks;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-btn">
          <ShoppingBag className="h-4 w-4" />
        </div>
        <span className="font-extrabold text-foreground">DigiMarket</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>

        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {type === "admin" ? "Administration" : "Affiliate"}
        </p>

        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={toggleDark}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
