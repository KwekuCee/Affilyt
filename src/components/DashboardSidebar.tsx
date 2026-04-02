import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Link2, DollarSign, Settings, Package, Users, CreditCard, ShoppingBag } from "lucide-react";
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

const DashboardSidebar = () => {
  const { role } = useAuth();
  const location = useLocation();
  const links = role === "SUPERADMIN" ? adminLinks : affiliateLinks;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <span className="font-bold text-foreground">DigiMarket</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </RouterNavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
