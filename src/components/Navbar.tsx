import { Search, Moon, Sun, Menu, X, LayoutDashboard, Store, UserPlus, Info, Mail } from "lucide-react";
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
    { to: "/marketplace", label: "Marketplace" },
    { to: "/become-affiliate", label: "Become a Seller" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-black text-base text-foreground tracking-tight group">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
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
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-lg ${isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-56 h-9 rounded-lg bg-secondary border-0 text-sm focus-visible:ring-primary"
              />
            </div>
          )}

          <button onClick={toggleDark} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden md:flex items-center gap-2 ml-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-4 uppercase tracking-widest">
                Login
              </Button>
            </Link>
            <Link to="/dashboard/affiliate">
              <Button size="sm" className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold px-4 uppercase tracking-widest gap-1.5">
                <LayoutDashboard className="h-3 w-3" />
                Dashboard
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
              className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === link.to
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full h-11 font-bold uppercase tracking-widest text-xs rounded-xl">
                Login
              </Button>
            </Link>
            <Link to="/dashboard/affiliate" onClick={() => setMobileOpen(false)}>
              <Button className="w-full h-11 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
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
