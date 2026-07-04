import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Rocket, Lock, CreditCard, ShieldCheck, Link2, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DollarPaymentGateway from "@/components/DollarPaymentGateway";
import { supabase } from "@/integrations/supabase/client";
import { useData } from "@/context/DataContext";

type Step = "intro" | "form" | "payment" | "success";

const BENEFITS = [
  "Instant access to the tier's product marketplace",
  "Personal referral links + QR codes per product",
  "Real-time earnings, click & conversion analytics",
  "Withdraw via Mobile Money, Skrill or bank transfer",
  "Leaderboards, contests & bonus tier rewards",
  "Marketing assets: banners, swipe copy, videos",
];

const BecomeAffiliate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { packages } = useData();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(packages[1]?.name || "Standard");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [marketingChannels, setMarketingChannels] = useState("");
  const [experience, setExperience] = useState("");
  const [audienceSize, setAudienceSize] = useState("");

  useEffect(() => {
    const pkg = searchParams.get("plan");
    if (pkg && packages.find((p) => p.name === pkg)) setSelectedPkg(pkg);
  }, [searchParams, packages]);

  const pkg = packages.find((p) => p.name === selectedPkg) || packages[0];

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
        phone,
        country,
      } as any).eq("user_id", user.id);

      await supabase.from("user_roles").insert({ user_id: user.id, role: "affiliate" as any });

      await supabase.from("affiliate_applications").insert({
        user_id: user.id,
        status: "approved",
        package_name: pkg.name,
        commission_rate: pkg.commission,
        amount: pkg.price,
        full_name: fullName,
        email,
        phone,
        country,
        marketing_channels: marketingChannels,
        experience,
        audience_size: audienceSize,
        approved_at: new Date().toISOString(),
      } as any);
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
                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">For Marketers & Creators</Badge>
                <h1 className="font-display text-4xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
                  Become an <span className="text-primary font-black">Affiliate.</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Pick a tier, get your link, start earning. Africa's fastest-paying affiliate network.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {packages.map((p) => {
                  const active = selectedPkg === p.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPkg(p.name)}
                      className={`text-left p-8 rounded-3xl border-2 transition-all ${active ? "border-primary bg-primary/5 shadow-xl shadow-primary/20" : "border-white/10 glass-subtle hover:border-primary/40"}`}
                    >
                      <h3 className="font-display text-xl font-black mb-2">{p.name}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="font-display text-4xl font-black">${p.price}</span>
                        <span className="text-sm text-muted-foreground">/year</span>
                      </div>
                      <p className="text-sm font-bold text-primary mb-4">{p.commission}% commission</p>
                      <p className="text-xs text-muted-foreground">{p.payoutSchedule}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                <div className="p-10 md:p-14 rounded-[3.5rem] glass-primary shadow-xl shadow-primary/10">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Rocket className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-foreground mb-2 uppercase tracking-widest">{pkg.name} Plan</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-5xl font-black text-foreground">${pkg.price}</span>
                    <span className="text-muted-foreground font-bold">/year</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-8">Annual affiliate membership. Cancel anytime.</p>
                  <div className="space-y-4 mb-10">
                    {BENEFITS.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <div className="h-5 w-5 mt-0.5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setStep("form")} className="w-full h-16 rounded-2xl font-black text-lg">
                    Start Earning <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Link2, title: "Get Your Referral Link", desc: "Pick from hundreds of products in your tier marketplace and generate a unique tracking link in seconds." },
                    { icon: TrendingUp, title: "Promote & Track", desc: "Share on socials, blog, email or paid ads. Watch clicks, conversions and commissions update live." },
                    { icon: Wallet, title: "Get Paid Fast", desc: `${pkg.payoutSchedule}. Withdraw to Mobile Money, Skrill or bank transfer — no hidden fees.` },
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
                    <h3 className="font-display text-2xl font-black mb-4">{pkg.name} Affiliate.</h3>
                    <p className="text-sm opacity-60 leading-relaxed font-medium mb-4">
                      {pkg.commission}% commission • {pkg.payoutSchedule}
                    </p>
                    <p className="text-sm opacity-60 leading-relaxed font-medium mb-8">
                      Annual membership — <span className="text-primary font-bold">${pkg.price}/year</span>.
                    </p>
                    <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                      <span className="text-xl font-black">${pkg.price}.00</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[{ icon: Lock, text: "Secure Account Creation" }, { icon: CreditCard, text: "Korapay Secure Gateway" }, { icon: ShieldCheck, text: "Verified Affiliate Program" }].map((i) => (
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
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Phone / WhatsApp</label>
                          <Input required value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="+233 ..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Country</label>
                          <select required value={country} onChange={(e) => setCountry(e.target.value)} className="h-14 w-full rounded-2xl bg-secondary border-none font-bold px-3">
                            <option>Ghana</option>
                            <option>Nigeria</option>
                            <option>USA</option>
                            <option>United Kingdom</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Marketing Profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Audience Size</label>
                          <select value={audienceSize} onChange={(e) => setAudienceSize(e.target.value)} className="h-14 w-full rounded-2xl bg-secondary border-none font-bold px-3">
                            <option value="">Select…</option>
                            <option>Under 1,000</option>
                            <option>1,000 – 10,000</option>
                            <option>10,000 – 50,000</option>
                            <option>50,000 – 250,000</option>
                            <option>250,000+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Experience</label>
                          <select value={experience} onChange={(e) => setExperience(e.target.value)} className="h-14 w-full rounded-2xl bg-secondary border-none font-bold px-3">
                            <option value="">Select…</option>
                            <option>Just starting</option>
                            <option>Less than 1 year</option>
                            <option>1–3 years</option>
                            <option>3+ years</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Marketing channels (Instagram, TikTok, YouTube, email, blog…)</label>
                        <Textarea value={marketingChannels} onChange={(e) => setMarketingChannels(e.target.value)} className="rounded-2xl bg-secondary border-none font-bold min-h-[100px]" placeholder="Tell us where you'll promote products" />
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
                amount={pkg.price}
                itemLabel={`Affilyt ${pkg.name} Affiliate Plan (1-Year)`}
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
              <h2 className="font-display text-5xl font-black text-foreground mb-6">Welcome to Affilyt!</h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-12">
                Your <span className="text-primary font-bold">{pkg.name}</span> affiliate account is active. Head to your dashboard to grab your first referral link.
              </p>
              <Button onClick={() => navigate("/dashboard/affiliate")} className="h-16 px-10 rounded-2xl font-black text-lg">
                Go to Affiliate Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeAffiliate;
