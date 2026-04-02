import { motion } from "framer-motion";
import { Check, Zap, Shield, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  "Access to all digital products",
  "50% commission on every sale",
  "Real-time analytics dashboard",
  "Unique referral tracking links",
  "Priority support",
  "Monthly payouts",
];

const BecomeSeller = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleJoin = () => {
    setRole("AFFILIATE");
    navigate("/dashboard/affiliate");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto flex items-center justify-center px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              <Star className="h-3 w-3" /> Affiliate Program
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Start <span className="gradient-text">Earning</span> Today
            </h1>
            <p className="mt-2 text-muted-foreground">Join thousands of affiliates earning passive income</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 card-shine" style={{ boxShadow: "var(--shadow-card-hover)" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-btn animate-float">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">Affiliate Access</h2>
                <p className="text-sm text-muted-foreground">One-time registration</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-black text-foreground">₵100</span>
              <span className="text-muted-foreground ml-1"> / one-time</span>
            </div>

            <ul className="mb-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <Button onClick={handleJoin} className="w-full rounded-full gradient-btn border-0 h-12 text-base font-bold gap-2 group">
              Pay & Join Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Simulated payment — instant access for demo
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Secure</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /> 50% Commission</div>
            <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Instant Access</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeSeller;
