import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", href: "/", internal: false },
  { label: "Features", href: "/#features", internal: true },
  { label: "Pricing", href: "/#pricing", internal: true },
  { label: "About", href: "/about", internal: false },
  { label: "Contact", href: "/contact", internal: false },
];

const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handle = (href: string, internal: boolean) => {
    setOpen(false);
    if (internal && loc.pathname === "/") {
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Affilyt</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) =>
            l.internal ? (
              <a key={l.label} href={l.href} onClick={() => handle(l.href, true)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/become-vendor"><Button variant="outline" size="sm">Sell</Button></Link>
          <Link to="/become-affiliate">
            <Button size="sm" className="gap-1.5 shadow-glow">
              Join now <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) =>
              l.internal ? (
                <a key={l.label} href={l.href} onClick={() => handle(l.href, true)} className="px-3 py-2.5 text-sm font-medium hover:bg-muted rounded-md">{l.label}</a>
              ) : (
                <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium hover:bg-muted rounded-md">{l.label}</Link>
              )
            )}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border">
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Sign in</Button></Link>
              <Link to="/become-affiliate" onClick={() => setOpen(false)}><Button className="w-full">Join</Button></Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
