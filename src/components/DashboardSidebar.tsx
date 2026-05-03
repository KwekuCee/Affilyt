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
  { id: "overview", to: "/dashboard/affiliate", label: "Dashboard", icon: LayoutDashboard },
  { id: "marketplace", to: "/dashboard/affiliate/marketplace", label: "Products", icon: Store },
  { id: "links", to: "/dashboard/affiliate/links", label: "My Links", icon: LinkIcon },
  { id: "reports", to: "/dashboard/affiliate/reports", label: "Performance", icon: BarChart3 },
  { id: "contests", to: "/dashboard/affiliate/contests", label: "Contests", icon: Trophy },
  { id: "leaderboard", to: "/dashboard/affiliate/leaderboard", label: "Leaderboard", icon: Users },
  { id: "membership", to: "/dashboard/affiliate/membership", label: "Membership", icon: Zap },
  { id: "prizes", to: "/dashboard/affiliate/prizes", label: "Prizes / Rewards", icon: Gift },
  { id: "payments", to: "/dashboard/affiliate/payments", label: "Money Out", icon: Wallet },
  { id: "community", to: "/dashboard/affiliate/community", label: "Get Help", icon: MessageSquare },
  { id: "blogs", to: "/dashboard/affiliate/blogs", label: "News", icon: FileText },
  { id: "settings", to: "/dashboard/affiliate/settings", label: "My Settings", icon: Settings },
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
    <aside className={`h-screen sticky top-0 flex flex-col bg-card border-r border-border transition-all duration-500 ease-in-out z-50 ${isCollapsed ? 'w-24' : 'w-80'}`}>
      <div className={`p-8 border-b border-border flex items-center justify-between ${isCollapsed ? 'px-6' : ''}`}>
        {!isCollapsed && <Link to="/" className="text-2xl font-black italic tracking-tighter uppercase text-primary">AffiliateHub.</Link>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="h-10 w-10 rounded-xl bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-2 scrollbar-hide">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink
              key={link.to}
              to={link.to}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${active ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <link.icon className={`h-5 w-5 min-w-[20px] transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
              {!isCollapsed && <span className="font-bold text-sm tracking-tight whitespace-nowrap">{link.label}</span>}
              {active && !isCollapsed && <div className="absolute right-4 h-2 w-2 rounded-full bg-white animate-pulse" />}
              {isCollapsed && <div className="absolute left-[88px] bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 shadow-2xl z-50 whitespace-nowrap">{link.label}</div>}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className={`p-6 border-t border-border space-y-4 ${isCollapsed ? 'px-4' : ''}`}>
        <button onClick={toggleDark} className={`flex items-center gap-4 p-4 rounded-2xl transition-all w-full text-muted-foreground hover:bg-secondary hover:text-foreground ${isCollapsed ? 'justify-center p-0 h-12' : ''}`}>
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!isCollapsed && <span className="font-bold text-sm">Appearance</span>}
        </button>
        <button onClick={handleSignOut} className={`flex items-center gap-4 p-4 rounded-2xl transition-all w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive ${isCollapsed ? 'justify-center p-0 h-12' : ''}`}>
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-bold text-sm">Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
