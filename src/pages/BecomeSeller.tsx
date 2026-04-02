import { motion } from "framer-motion";
import { Check, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

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
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <ShoppingBag className="h-6 w-6 text-primary" />
            DigiMarket
          </Link>
        </div>
      </header>

      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Affiliate Access</h1>
                <p className="text-sm text-muted-foreground">Start earning today</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">₵100</span>
              <span className="text-muted-foreground"> / one-time</span>
            </div>

            <ul className="mb-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 text-success" />
                  {f}
                </li>
              ))}
            </ul>

            <Button onClick={handleJoin} className="w-full rounded-full" size="lg">
              Pay & Join Now
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Simulated payment — instant access for demo
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Secure</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> 50% Commission</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeSeller;
