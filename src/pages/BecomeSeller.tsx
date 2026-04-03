import { motion } from "framer-motion";
import { Check, ArrowRight, Award, TrendingUp, Zap, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const features = [
  { title: "Elite Commission Tiers", description: "Our partners enjoy a flat 50% commission on all primary sales. No hidden tiers, no complicated escalators. Just direct rewards for your performance.", icon: Award, stat: "Top 5% Tier Access" },
  { title: "Real-time Analytics", description: "Track every click, conversion, and payout with institutional precision. Our dashboard updates in milliseconds.", icon: TrendingUp, stat: "99.9% Tracking Accuracy" },
  { title: "Swift Payouts", description: "Bi-weekly payouts via bank transfer, crypto, or PayPal. Never wait for your hard-earned capital.", icon: Zap },
  { title: "Marketplace Exclusive", description: "Access private offers not available anywhere else. High-converting landing pages built by master copywriters.", icon: ShieldCheck },
];

const benefits = [
  "Guaranteed 50% Commissions",
  "Executive Ledger Dashboard",
  "Private Marketplace Access",
  "Priority Technical Support",
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

      {/* Hero */}
      <section className="hero-gradient text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-4">ELITE AFFILIATE NETWORK</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Monetize Your<br />
              <span className="text-white/50">Influence.</span>
            </h1>
            <p className="mt-4 text-base text-white/60 leading-relaxed max-w-md">
              Join an institutional-grade ecosystem where precision meets profitability. Access high-ticket offers with a transparent 50% commission structure.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button onClick={handleJoin} className="rounded-lg bg-white text-primary font-bold gap-2 h-11 px-6 hover:bg-white/90">
                Pay to Join <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["KA", "AM", "YB"].map((a) => (
                    <div key={a} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 border-2 border-white/10 text-[10px] font-bold text-white">{a}</div>
                  ))}
                </div>
                <span className="text-xs text-white/60">Trusted by 2,400+ Partners</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              {feature.stat && (
                <p className="mt-3 text-xs font-semibold text-primary">{feature.stat}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground">Start Your Enterprise Journey</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            One investment to unlock a lifetime of high-performance affiliate tools and premium marketplace access.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-sm rounded-xl border border-border bg-card p-8"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Registration Fee</p>
            <span className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase">Limited Access</span>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-black text-foreground">$99</span>
            <span className="text-sm text-muted-foreground ml-1">/One-time</span>
          </div>

          <ul className="space-y-3 mb-8">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3 w-3 text-success" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          <Button onClick={handleJoin} className="w-full rounded-lg bg-primary text-primary-foreground h-11 text-sm font-bold">
            Pay to Join
          </Button>
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider mt-2">Secure Stripe Checkout</p>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By clicking "Pay to Join" you agree to our Terms of Service.<br />
          Our vetting process takes 24-48 hours post-registration.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>© 2024 THE EXECUTIVE LEDGER. BUILT FOR INSTITUTIONAL TRUST.</span>
            <div className="flex gap-6">
              <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer">Contact</span>
              <span className="hover:text-foreground cursor-pointer">API Documentation</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BecomeSeller;
