import { NavLink as RouterNavLink, useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, DollarSign, Settings, Package, Users,
  CreditCard, BarChart3, ArrowLeft, Moon, Sun, HelpCircle, LogOut,
  Server, ShieldCheck, Zap, Trophy, Activity, Link as LinkIcon,
  Gift, Wallet, MessageSquare, FileText, ChevronLeft, ChevronRight,
  User as UserIcon, Shield, ShoppingCart, QrCode, CalendarDays,
  Filter, Star, Bell, FolderOpen, Target, Globe, UserPlus, Menu, X,
  Percent, Ticket, Boxes, FlaskConical, UploadCloud, Calculator
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

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
  { id: "marketplace", to: "/dashboard/affiliate/products", label: "Inventory", icon: Store },
  { id: "links", to: "/dashboard/affiliate/links", label: "My Links", icon: LinkIcon },
  { id: "smart-links", to: "/dashboard/affiliate/smart-links", label: "Smart Links", icon: Zap },
  { id: "qr-codes", to: "/dashboard/affiliate/qr-codes", label: "QR Codes", icon: QrCode },
  { id: "top-products", to: "/dashboard/affiliate/top-products", label: "Top Products", icon: Star },
  { id: "reports", to: "/dashboard/affiliate/reports", label: "Performance", icon: BarChart3 },
  { id: "funnel", to: "/dashboard/affiliate/funnel", label: "Funnel", icon: Filter },
  { id: "calendar", to: "/dashboard/affiliate/calendar", label: "Calendar", icon: CalendarDays },
  { id: "channels", to: "/dashboard/affiliate/channels", label: "Channels", icon: Globe },
  { id: "goals", to: "/dashboard/affiliate/goals", label: "Goals", icon: Target },
  { id: "notifications", to: "/dashboard/affiliate/notifications", label: "Alerts", icon: Bell },
  { id: "resources", to: "/dashboard/affiliate/resources", label: "Resources", icon: FolderOpen },
  { id: "referrals", to: "/dashboard/affiliate/referrals", label: "Referrals", icon: UserPlus },
  { id: "contests", to: "/dashboard/affiliate/contests", label: "Contests", icon: Trophy },
  { id: "leaderboard", to: "/dashboard/affiliate/leaderboard", label: "Leaderboard", icon: Users },
  { id: "payments", to: "/dashboard/affiliate/payments", label: "Payouts", icon: Wallet },
  { id: "tax-docs", to: "/dashboard/affiliate/tax-docs", label: "Tax Docs", icon: FileText },
  { id: "settings", to: "/dashboard/affiliate/settings", label: "Settings", icon: Settings },
];

const vendorLinks = [
  { id: "overview", to: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", to: "/dashboard/vendor/analytics", label: "Analytics", icon: BarChart3 },
  { id: "orders", to: "/dashboard/vendor/orders", label: "Orders", icon: ShoppingCart },
  { id: "products", to: "/dashboard/vendor/products", label: "Products", icon: Package },
  { id: "import", to: "/dashboard/vendor/import", label: "Bulk Import", icon: UploadCloud },
  { id: "stock", to: "/dashboard/vendor/stock", label: "Inventory", icon: Boxes },
  { id: "ab-testing", to: "/dashboard/vendor/ab-testing", label: "A/B Testing", icon: FlaskConical },
  { id: "leaderboard", to: "/dashboard/vendor/leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "commissions", to: "/dashboard/vendor/commissions", label: "Commissions", icon: Percent },
  { id: "coupons", to: "/dashboard/vendor/coupons", label: "Coupons", icon: Ticket },
  { id: "reviews", to: "/dashboard/vendor/reviews", label: "Reviews", icon: Star },
  { id: "storefront", to: "/dashboard/vendor/products", label: "Inventory", icon: Store },
  { id: "subscription", to: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
  { id: "tax", to: "/dashboard/vendor/tax", label: "Taxes", icon: Calculator },
  { id: "payouts", to: "/dashboard/vendor/payouts", label: "Payouts", icon: Wallet },
  { id: "reports", to: "/dashboard/vendor/reports", label: "Reports", icon: FileText },
  { id: "settings", to: "/dashboard/vendor/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  type: "affiliate" | "admin" | "vendor";
}

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const { dark, toggleDark, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = type === "admin" ? adminLinks : type === "affiliate" ? affiliateLinks : vendorLinks;

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const sidebarContent = (
    <>
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm">Affilyt</span>
          </Link>
        )}
        <button onClick={() => { if (window.innerWidth < 1024) setMobileOpen(false); else setIsCollapsed(!isCollapsed); }} className="h-7 w-7 rounded-md hover:bg-sidebar-accent flex items-center justify-center">
          {window.innerWidth < 1024 ? <X className="h-4 w-4" /> : isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <RouterNavLink key={link.to} to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors group relative ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}>
              <link.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
              {isCollapsed && <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none shadow-md border border-border z-50">{link.label}</div>}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-0.5 shrink-0">
        <button onClick={toggleDark} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium hover:bg-sidebar-accent/50 transition-colors">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!isCollapsed && <span>Theme</span>}
        </button>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium hover:bg-destructive/20 hover:text-destructive transition-colors">
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 glass-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm">Affilyt</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="h-9 w-9 rounded-lg hover:bg-sidebar-accent flex items-center justify-center">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 glass-sidebar text-sidebar-foreground z-50 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex h-screen sticky top-0 flex-col glass-sidebar text-sidebar-foreground transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default DashboardSidebar;
