import { Search, Moon, Sun, Menu, X, LayoutDashboard, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface Props { searchQuery?: string; onSearchChange?: (q: string) => void; }

const Navbar = ({ searchQuery = "", onSearchChange }: Props) => {
  const { dark, toggleDark, user } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/become-affiliate", label: "Affiliates" },
    { to: "/become-seller", label: "Sellers" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto h-14 flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Affilyt</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link key={l.to} to={l.to} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {onSearchChange && (
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products…" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 w-60 h-9" />
            </div>
          )}
          <button onClick={toggleDark} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link to="/dashboard/affiliate"><Button size="sm" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" />Dashboard</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="outline" size="sm">Sign in</Button></Link>
                <Link to="/become-affiliate"><Button size="sm">Join</Button></Link>
              </>
            )}
          </div>
          <button className="md:hidden h-8 w-8 rounded-md flex items-center justify-center" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background p-3 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
