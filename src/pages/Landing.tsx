import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Zap, Globe, BarChart3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Landing = () => {
  const { packages } = useData();
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").eq("status", "active").eq("approval_status", "approved").order("created_at", { ascending: false }).limit(6).then(({ data }) => setProducts(data || []));
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
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="outline" className="mb-6 px-3 py-1 rounded-full border-primary/30 bg-primary/5 text-primary font-medium">
                <Sparkles className="h-3 w-3 mr-1.5" /> Now serving 4 markets
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6">
                The affiliate marketplace
                <br /><span className="text-gradient">built for serious earners.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Join Africa's premium network for digital products. Track every click, claim every commission, and get paid in your currency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/become-affiliate">
                  <Button size="lg" className="h-12 px-8 shadow-glow gap-2">Start earning <ArrowRight className="h-4 w-4" /></Button>
                </Link>
                <Link to="/become-seller">
                  <Button size="lg" variant="outline" className="h-12 px-8">List a product</Button>
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
              <div key={s.l} className="text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
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
                className="p-6 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-elevated transition-all group">
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
                <Link key={p.id} to={`/marketplace?product=${p.id}`} className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-elevated hover:border-primary/40 transition-all">
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Sparkles /></div>}
                  </div>
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
                    <h3 className="font-semibold text-base mb-1.5 line-clamp-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold tabular">${Number(p.price).toFixed(2)}</span>
                      <span className="text-xs font-medium text-primary">{p.commission_rate}% commission</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Pick your tier.</h2>
            <p className="text-muted-foreground mt-3">All plans are annual. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {packages.map((pkg) => {
              const popular = pkg.name === "Standard";
              return (
                <div key={pkg.name} className={`relative p-7 rounded-xl border-2 bg-card flex flex-col ${popular ? "border-primary shadow-glow" : "border-border"}`}>
                  {popular && <Badge className="absolute -top-2.5 left-7 px-2.5 py-0.5">Most popular</Badge>}
                  <h3 className="font-display text-xl font-semibold mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl font-bold tabular">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground">/year</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{pkg.commission}% commission on every sale.</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {[`${pkg.commission}% recurring commission`, pkg.name === "Pro" ? "Weekly payouts" : pkg.name === "Standard" ? "Bi-weekly payouts" : "Monthly payouts", "Marketing assets", "Full network access"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/become-affiliate"><Button className="w-full" variant={popular ? "default" : "outline"}>Get started</Button></Link>
                </div>
              );
            })}
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
    </div>
  );
};

export default Landing;
