import { Search, Moon, Sun, Menu, X, Bell, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const Navbar = ({ searchQuery = "", onSearchChange }: NavbarProps) => {
  const { dark, toggleDark } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard/affiliate", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-black text-base text-foreground tracking-tight group">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-[10px] text-primary-foreground font-black">EL</span>
            </div>
            <span className="hidden sm:inline italic">The Executive Ledger</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-colors ${isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {onSearchChange && (
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search institutional assets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64 h-9 rounded-lg bg-secondary border-0 text-sm focus-visible:ring-primary"
              />
            </div>
          )}

          <button onClick={toggleDark} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden md:flex items-center gap-2 ml-2">
            <Link to="/dashboard/affiliate">
              <Button size="sm" className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-black px-4 uppercase tracking-widest gap-2">
                <LayoutDashboard className="h-3 w-3" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 space-y-0.5 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-colors ${location.pathname === link.to
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link to="/dashboard/affiliate" onClick={() => setMobileOpen(false)}>
              <Button className="w-full h-11 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-xl">
                Dashboard
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
