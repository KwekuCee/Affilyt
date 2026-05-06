import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Store, Lock, CreditCard, ShieldCheck, Package, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DollarPaymentGateway from "@/components/DollarPaymentGateway";
import { supabase } from "@/integrations/supabase/client";

type Step = "intro" | "form" | "payment" | "success";
const SELLER_PRICE = 50;

const FEATURES = [
  "List unlimited products in Basic / Standard / Pro marketplaces",
  "10% platform fee — keep 90% after affiliate commission",
  "Dedicated Seller Dashboard with sales analytics",
  "Affiliates promote your products automatically",
  "Withdraw earnings via Mobile Money or Skrill",
  "Downloadable sales & revenue reports",
];

const BecomeSeller = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        full_name: fullName,
        business_name: businessName,
        business_description: businessDescription,
        business_website: businessWebsite,
      }).eq("user_id", user.id);
      await supabase.from("user_roles").insert({ user_id: user.id, role: "seller" as any });
      await supabase.from("seller_subscriptions").insert({ user_id: user.id, amount: SELLER_PRICE, status: "active" });
    }
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-transparent">
      <LandingNavbar />
      <div className="pt-32 pb-20">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.section key="intro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">For Product Owners</Badge>
                <h1 className="font-display text-4xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
                  Become a <span className="text-primary font-black">Seller.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  List your products on Affilyt and let our network of affiliates sell for you. One yearly fee. Keep 90% after commission.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                <div className="p-10 md:p-14 rounded-[3.5rem] glass-primary shadow-xl shadow-primary/10">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Store className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-foreground mb-2 uppercase tracking-widest">Seller Plan</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-5xl font-black text-foreground">${SELLER_PRICE}</span>
                    <span className="text-muted-foreground font-bold">/year</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-8">One annual fee. Unlimited products. Cancel anytime.</p>
                  <div className="space-y-4 mb-10">
                    {FEATURES.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <div className="h-5 w-5 mt-0.5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setStep("form")} className="w-full h-16 rounded-2xl font-black text-lg">
                    Start Selling <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Package, title: "Create Your Products", desc: "Upload product details, set price, choose which tier of affiliates can promote it (Basic, Standard, or Pro marketplace)." },
                    { icon: Users, title: "Affiliates Sell For You", desc: "Hundreds of affiliates promote your products through their referral links. You don't lift a finger." },
                    { icon: BarChart3, title: "Get Paid Automatically", desc: "Every sale: affiliate gets their commission, platform takes 10%, you keep the rest. Withdraw anytime." },
                  ].map((b) => (
                    <div key={b.title} className="p-8 rounded-[2.5rem] glass">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <b.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-display text-lg font-black text-foreground mb-2">{b.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {step === "form" && (
            <motion.section key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="container mx-auto px-4 max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-8 rounded-[2.5rem] bg-foreground text-background">
                    <h3 className="font-display text-2xl font-black mb-4">Seller Account.</h3>
                    <p className="text-sm opacity-60 leading-relaxed font-medium mb-8">
                      Annual seller plan — <span className="text-primary font-bold">${SELLER_PRICE}/year</span>.
                    </p>
                    <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                      <span className="text-xl font-black">${SELLER_PRICE}.00</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[{ icon: Lock, text: "Secure Account Creation" }, { icon: CreditCard, text: "Korapay Secure Gateway" }, { icon: ShieldCheck, text: "Verified Seller Program" }].map((i) => (
                      <div key={i.text} className="flex items-center gap-3">
                        <i.icon className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{i.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 p-10 rounded-[3.5rem] glass shadow-xl">
                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Account Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Name</label>
                          <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address</label>
                          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="you@email.com" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Password</label>
                          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="••••••••••••" minLength={6} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Business Details</h4>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Business / Brand Name</label>
                        <Input required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="My Brand LLC" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Website (optional)</label>
                        <Input value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="https://..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Description</label>
                        <Textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} className="rounded-2xl bg-secondary border-none font-bold min-h-[100px]" placeholder="What do you sell?" />
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-20 rounded-[2rem] font-bold text-xl flex gap-3 items-center justify-center shadow-2xl shadow-primary/30">
                      {isLoading ? "Creating Account..." : "Continue to Payment"}
                      {!isLoading && <ArrowRight className="h-6 w-6" />}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.section>
          )}

          {step === "payment" && (
            <motion.section key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-4">
              <DollarPaymentGateway
                amount={SELLER_PRICE}
                itemLabel="Affilyt Seller Plan (1-Year)"
                buyerEmail={email}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep("form")}
              />
            </motion.section>
          )}

          {step === "success" && (
            <motion.section key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-4 text-center max-w-2xl py-20">
              <div className="h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-primary/40">
                <Check className="h-16 w-16 text-white" />
              </div>
              <h2 className="font-display text-5xl font-black text-foreground mb-6">Welcome, Seller!</h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-12">
                Your seller account is active. You can now access your dedicated seller portal.
              </p>
              <Button onClick={() => window.location.href = "/dashboard/seller"} className="h-16 px-10 rounded-2xl font-black text-lg">
                Go to Seller Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeSeller;
