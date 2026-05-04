import { NavLink as RouterNavLink, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, DollarSign, Settings, Package, Users,
  CreditCard, BarChart3, ArrowLeft, Moon, Sun, HelpCircle, LogOut,
  Server, ShieldCheck, Zap, Trophy, Activity, Link as LinkIcon,
  Gift, Wallet, MessageSquare, FileText, ChevronLeft, ChevronRight,
  User as UserIcon, Shield, ShoppingCart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const adminLinks = [
  { id: "overview", to: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", to: "/dashboard/admin/users", label: "Users", icon: Users },
  { id: "inventory", to: "/dashboard/admin/inventory", label: "Products", icon: Package },
  { id: "commissions", to: "/dashboard/admin/commissions", label: "Commissions", icon: Zap },
  { id: "contests", to: "/dashboard/admin/contests", label: "Contests", icon: Trophy },
  { id: "payouts", to: "/dashboard/admin/payouts", label: "Withdrawals", icon: CreditCard },
  { id: "analytics", to: "/dashboard/admin/analytics", label: "Analytics", icon: Activity },
  { id: "fraud", to: "/dashboard/admin/fraud", label: "Security", icon: ShieldCheck },
  { id: "settings", to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

const affiliateLinks = [
  { id: "overview", to: "/dashboard/affiliate", label: "Overview", icon: LayoutDashboard },
  { id: "marketplace", to: "/dashboard/affiliate/marketplace", label: "Products", icon: Store },
  { id: "links", to: "/dashboard/affiliate/links", label: "My Links", icon: LinkIcon },
  { id: "reports", to: "/dashboard/affiliate/reports", label: "Performance", icon: BarChart3 },
  { id: "contests", to: "/dashboard/affiliate/contests", label: "Contests", icon: Trophy },
  { id: "leaderboard", to: "/dashboard/affiliate/leaderboard", label: "Leaderboard", icon: Users },
  { id: "payments", to: "/dashboard/affiliate/payments", label: "Payouts", icon: Wallet },
  { id: "settings", to: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
];

const sellerLinks = [
  { id: "overview", to: "/dashboard/seller", label: "Overview", icon: LayoutDashboard },
  { id: "products", to: "/dashboard/seller/products", label: "My Products", icon: Package },
  { id: "orders", to: "/dashboard/seller/orders", label: "Orders", icon: ShoppingCart },
  { id: "affiliates", to: "/dashboard/seller/affiliates", label: "Aggregates", icon: Users },
  { id: "payouts", to: "/dashboard/seller/payouts", label: "Withdrawals", icon: Wallet },
  { id: "reports", to: "/dashboard/seller/reports", label: "Reports", icon: FileText },
  { id: "settings", to: "/dashboard/seller/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  type: "affiliate" | "admin" | "seller";
}

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const { dark, toggleDark, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const links = type === "admin" ? adminLinks : type === "affiliate" ? affiliateLinks : sellerLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className={`h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-60'}`}>
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-white">Affilyt</span>
          </Link>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="h-7 w-7 rounded-md hover:bg-sidebar-accent flex items-center justify-center">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink key={link.to} to={link.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white'}`}>
              <link.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
              {isCollapsed && <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-md border border-border z-50">{link.label}</div>}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        <button onClick={toggleDark} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent/50 hover:text-white transition-colors">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!isCollapsed && <span>Theme</span>}
        </button>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-destructive/20 hover:text-destructive transition-colors">
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
