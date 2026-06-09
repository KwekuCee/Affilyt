import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Mail, TrendingUp, MessageSquare } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 backdrop-blur-xl mt-auto">
    <div className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Affilyt</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            The premium affiliate marketplace for digital creators across Africa and beyond.
          </p>
          <div className="flex items-center gap-2">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-md bg-secondary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</h5>
          <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link to="/affiliate-pricing" className="hover:text-foreground transition-colors w-fit">Become an Affiliate</Link>
            <Link to="/become-seller" className="hover:text-foreground transition-colors w-fit">Become a Vendor</Link>
            <Link to="/about" className="hover:text-foreground transition-colors w-fit">About</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</h5>
          <nav className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors w-fit">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors w-fit">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors w-fit">Refund Policy</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Support</h5>
          <a href="mailto:support@affilyt.site" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            support@affilyt.site
          </a>
          <Link to="/contact" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <div className="h-9 w-9 rounded-md bg-success/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="h-4 w-4 text-success" />
            </div>
            Contact form
          </Link>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 Affilyt. All rights reserved.</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Built by <a href="https://primehaven.tech" className="text-foreground font-medium hover:text-primary">Prime Haven</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
