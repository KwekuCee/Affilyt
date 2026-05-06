import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap, Globe, BarChart3, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { NetworkBackground } from "@/components/landing/NetworkBackground";
import { LiveTicker } from "@/components/landing/LiveTicker";
import { EarningsCalculator } from "@/components/landing/EarningsCalculator";
import { EliteWallPeek } from "@/components/landing/EliteWallPeek";
import { PayoutShowcase } from "@/components/landing/PayoutShowcase";
import { PlatformStats } from "@/components/landing/PlatformStats";
import { Users } from "lucide-react";

const Landing = () => {
  const { packages } = useData();
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").eq("status", "active").eq("approval_status", "approved").eq("is_featured", true).order("created_at", { ascending: false }).limit(6).then(({ data }) => setProducts(data || []));
    supabase.from("blog_posts").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setBlogPosts(data || []));
  }, []);

  const features = [
    { icon: Zap, title: "Instant tracking", desc: "Generate referral links in one click and watch conversions land in real time." },
    { icon: ShieldCheck, title: "Vetted products", desc: "Every product passes admin review before reaching the marketplace." },
    { icon: BarChart3, title: "Data-first dashboards", desc: "Earnings, clicks, EPC, conversion — all surfaced with zero noise." },
    { icon: Globe, title: "Pay anywhere", desc: "Mobile Money, Skrill, USD payouts across Ghana, Nigeria, USA, UK." },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <NetworkBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <Badge variant="outline" className="px-3 py-1 rounded-full border-success/30 bg-success/5 text-success font-medium flex items-center shadow-lg shadow-success/10">
                  <ShieldCheck className="h-3 w-3 mr-1.5" /> Secure & Verified Platform
                </Badge>
                <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/30 bg-primary/5 text-primary font-medium flex items-center shadow-lg shadow-primary/10">
                  <Users className="h-3 w-3 mr-1.5" /> 1,000+ Active Users
                </Badge>
              </div>
              <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-amber-500/30 bg-amber-500/10 text-amber-500 font-black uppercase tracking-widest text-[10px]">
                <Sparkles className="h-3 w-3 mr-1.5 text-amber-500" /> Africa's Premium Affiliate Platform
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">
                The affiliate marketplace
                <br /><span className="text-gradient">built for serious earners.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Join Africa's premium network for digital products. Track every click, claim every commission, and get paid in your currency.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/become-affiliate" className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors rounded-3xl" />
                  <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-primary/50 to-primary/10 overflow-hidden shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                    <div className="bg-background/90 backdrop-blur-xl px-10 py-6 rounded-[1.4rem] flex flex-col items-center justify-center min-w-[280px]">
                      <Zap className="w-8 h-8 text-primary mb-3" />
                      <span className="font-display font-black text-xl uppercase italic tracking-tight mb-1">Path of the Hunter</span>
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">Start Earning <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" /></span>
                    </div>
                  </div>
                </Link>

                <Link to="/become-seller" className="group relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-colors rounded-3xl" />
                  <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-amber-500/50 to-amber-500/10 overflow-hidden shadow-2xl shadow-amber-500/10 hover:-translate-y-1 transition-transform">
                    <div className="bg-background/90 backdrop-blur-xl px-10 py-6 rounded-[1.4rem] flex flex-col items-center justify-center min-w-[280px]">
                      <Globe className="w-8 h-8 text-amber-500 mb-3" />
                      <span className="font-display font-black text-xl uppercase italic tracking-tight mb-1">Path of the Creator</span>
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">List your Product <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" /></span>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stat strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { v: "60%", l: "Top commission" },
              { v: "<24h", l: "Payout time" },
              { v: "4", l: "Markets" },
              { v: "100%", l: "Vetted products" },
            ].map((s) => (
              <div key={s.l} className="text-center p-6 rounded-lg glass-subtle">
                <div className="font-display text-3xl md:text-4xl font-bold text-gradient tabular">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Why Affilyt</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Everything you need to scale.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-lg glass hover:border-primary/40 hover:shadow-elevated transition-all group">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PlatformStats />

      <section className="py-24 relative z-10 bg-background/50 backdrop-blur-3xl border-t border-white/5">
        <EarningsCalculator />
      </section>

      <EliteWallPeek />

      {/* Products */}
      {products.length > 0 && (
        <section className="py-24 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Marketplace</p>
                <h2 className="font-display text-4xl font-bold tracking-tight">Featured products</h2>
              </div>
              <Link to="/marketplace"><Button variant="outline" className="gap-1.5 hidden md:inline-flex">Browse all <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <Link key={p.id} to={`/marketplace?product=${p.id}`} className="group relative rounded-3xl glass overflow-hidden hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] hover:border-primary/40 transition-all border border-white/5">
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-amber-950 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/30 rotate-3 group-hover:rotate-6 transition-transform whitespace-nowrap">
                      Earn ${(Number(p.price) * (p.commission_rate / 100)).toFixed(2)}/sale
                    </div>
                  </div>
                  <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                    {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Sparkles /></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6 relative z-10 -mt-6">
                    <Badge variant="secondary" className="mb-3 text-[10px] font-black uppercase tracking-widest bg-secondary/80 backdrop-blur-md">{p.category}</Badge>
                    <h3 className="font-display font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium">{p.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="font-display text-2xl font-black tabular-nums">${Number(p.price).toFixed(2)}</span>
                      <span className="text-xs font-bold text-primary px-2 py-1 rounded-lg bg-primary/10">{p.commission_rate}% commission</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PayoutShowcase />

      {/* Join Paths */}
      <section id="join" className="py-24 relative z-10 bg-background/80">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Get Started</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Choose your path.</h2>
            <p className="text-muted-foreground mt-3">Join Africa's fastest growing digital ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Affiliate */}
            <div className="p-8 rounded-[2rem] glass-subtle border border-primary/20 hover:border-primary/50 transition-all text-center group relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Join as Affiliate</h3>
              <p className="text-sm text-muted-foreground mb-8">Promote premium digital products and earn massive recurring commissions. Get paid instantly.</p>
              <Link to="/become-affiliate" className="block w-full">
                <Button className="w-full h-12 shadow-md shadow-primary/20">View Affiliate Plans</Button>
              </Link>
            </div>

            {/* Vendor */}
            <div className="p-8 rounded-[2rem] glass-subtle border border-amber-500/20 hover:border-amber-500/50 transition-all text-center group relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Join as Vendor</h3>
              <p className="text-sm text-muted-foreground mb-8">List your courses, software, or ebooks. Let thousands of top affiliates sell for you.</p>
              <Link to="/become-seller" className="block w-full">
                <Button variant="outline" className="w-full h-12 border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500">Create Vendor Account</Button>
              </Link>
            </div>

            {/* Learner */}
            <div className="p-8 rounded-[2rem] glass-subtle border border-blue-500/20 hover:border-blue-500/50 transition-all text-center group relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Join as Learner</h3>
              <p className="text-sm text-muted-foreground mb-8">Access world-class digital products, exclusive trade signals, and premium education.</p>
              <Link to="/marketplace" className="block w-full">
                <Button variant="outline" className="w-full h-12 border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500">Browse Marketplace</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Wall of love</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Trusted by partners worldwide.</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section id="blog" className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Insights</p>
                <h2 className="font-display text-4xl font-bold tracking-tight">From the blog</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((p) => (
                <article key={p.id} className="group cursor-pointer">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-4">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{p.author}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{p.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-2xl gradient-hero p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-50" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">Ready when you are.</h2>
              <p className="text-white/70 text-lg mb-9 max-w-xl mx-auto">Three plans. One marketplace. Real payouts.</p>
              <Link to="/become-affiliate"><Button size="lg" className="h-12 px-8 shadow-glow gap-2">Join Affilyt <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LiveTicker />
    </div>
  );
};

export default Landing;
