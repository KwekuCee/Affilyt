import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, Store, Wallet, Star, FileText,
  Settings, LogOut, Shield, ChevronLeft, ChevronRight, Bell, Search, Moon, Sun,
  Activity, BarChart3, Crown, ShieldCheck, RotateCcw, Megaphone, Tag, Heart
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";

const navItems = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/admin/activity", label: "Activity", icon: Activity },
  { to: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/admin/users", label: "Users", icon: Users },
  { to: "/dashboard/admin/tiers", label: "Tiers", icon: Crown },
  { to: "/dashboard/admin/sellers", label: "Sellers", icon: Store },
  { to: "/dashboard/admin/products", label: "Products", icon: Package },
  { to: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { to: "/dashboard/admin/refunds", label: "Refunds", icon: RotateCcw },
  { to: "/dashboard/admin/withdrawals", label: "Withdrawals", icon: Wallet },
  { to: "/dashboard/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/dashboard/admin/broadcast", label: "Broadcast", icon: Megaphone },
  { to: "/dashboard/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/dashboard/admin/blogs", label: "Blog", icon: FileText },
  { to: "/dashboard/admin/audit", label: "Audit log", icon: ShieldCheck },
  { to: "/dashboard/admin/health", label: "Health", icon: Heart },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

const AdminShell = () => {
  const { signOut, profile, user, dark, toggleDark } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background theme-admin relative overflow-hidden text-foreground">
      {/* Glassmorphic Animated Background Blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Sidebar */}
      <aside className={`sticky top-0 h-screen flex flex-col glass-sidebar transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-60"}`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-tight">Affilyt Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-border space-y-0.5">
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span>Theme</span>}
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sticky top-0 z-10 glass-sidebar backdrop-blur border-b border-border flex items-center px-6 gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 h-9 bg-muted/40 border-none" />
          </div>
          <button className="h-9 w-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {(profile?.full_name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div className="text-xs">
              <div className="font-semibold">{profile?.full_name || "Admin"}</div>
              <div className="text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto relative z-10 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
