import { motion } from "framer-motion";
import {
    ArrowRight, Play, CheckCircle2, TrendingUp, Users, Globe, Zap, ShieldCheck, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataContext";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";
import { useState, useEffect } from "react";

const Landing = () => {
    const { landingContent, packages } = useData();
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3);
            setBlogPosts(data || []);
        };
        const fetchProducts = async () => {
            const { data } = await supabase.from("products").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3);
            setProducts(data || []);
        };
        fetchBlogs();
        fetchProducts();
    }, []);

    const fadeInUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

    const getIcon = (name: string) => {
        const Icon = (LucideIcons as any)[name] || LucideIcons.CircleHelp;
        return Icon;
    };

    const stats = landingContent.stats.map(s => ({ ...s, icon: getIcon(s.icon) }));
    const features = landingContent.features.map(f => ({ ...f, icon: getIcon(f.icon) }));

    const pricingPlans = packages.map(pkg => ({
        name: pkg.name,
        price: `$${pkg.price}`,
        description: pkg.name === "Basic" ? "Great for beginners. Start selling today." :
            pkg.name === "Standard" ? "Most popular. Full tools and support." : "VIP access with maximum commission.",
        features: [
            `${pkg.commission}% Commission`,
            pkg.name === "Basic" ? "Monthly Payouts" : pkg.name === "Standard" ? "Every Two Weeks" : "Weekly Payouts",
            "Marketing Materials", "Full Network Access"
        ],
        isPopular: pkg.name === "Standard"
    }));

    return (
        <div className="min-h-screen bg-transparent overflow-x-hidden">
            <LandingNavbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">Start Your Journey Today</Badge>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] mb-6">
                                    {landingContent.heroTitle.split(" ").map((word, i) => (
                                        <span key={i}>{(word === "Hub." || word === "Affiliate") ? <span className="text-primary italic">{word} </span> : word + " "}</span>
                                    ))}
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">{landingContent.heroSubtitle}</p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <Link to="/become-affiliate">
                                        <Button size="lg" className="h-14 px-8 rounded-2xl font-bold text-lg group shadow-xl shadow-primary/20">
                                            Start Earning Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div className="flex-1 relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                            <div className="relative rounded-[2.5rem] overflow-hidden border-[8px] border-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] aspect-[4/3] group">
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <TrendingUp className="h-24 w-24 text-primary/40" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-primary/5 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div key={stat.label} className="text-center md:text-left" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-2 lg:mb-0">
                                    <div className="p-3 rounded-xl bg-card border border-border shadow-sm mb-3 md:mb-0"><stat.icon className="h-6 w-6 text-primary" /></div>
                                    <div>
                                        <h4 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{stat.value}</h4>
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Why Choose Affilyt</h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Everything You Need to Succeed.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div key={feature.title} className="group relative p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><feature.icon className="h-7 w-7" /></div>
                                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
            {products.length > 0 && (
                <section className="py-24 md:py-32 bg-secondary/50 relative">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mb-16">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Marketplace</h2>
                            <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Featured Products.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product: any, i: number) => (
                                <motion.div key={product.id} className="flex flex-col h-full rounded-[2rem] overflow-hidden bg-card border border-border group"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                    <div className="aspect-[16/10] overflow-hidden relative bg-secondary">
                                        {product.image_url ? <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Star className="h-12 w-12 text-muted-foreground/20" /></div>}
                                        <div className="absolute top-4 left-4"><Badge className="bg-background/80 backdrop-blur-md text-foreground border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{product.category}</Badge></div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-2xl font-black text-foreground mb-2">${Number(product.price).toFixed(2)}</p>
                                        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{product.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{product.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing */}
            <section id="pricing" className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Pricing</h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Choose Your Growth Path.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, i) => (
                            <motion.div key={plan.name} className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl border-2 transition-all duration-300 ${plan.isPopular ? "bg-white/10 border-primary shadow-2xl shadow-primary/10 scale-105 z-10" : "bg-card/40 border-border hover:border-primary/30"}`}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                {plan.isPopular && <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground border-none font-bold uppercase tracking-widest text-[10px]">Most Popular</Badge>}
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-widest">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl md:text-5xl font-black text-foreground">{plan.price}</span>
                                        <span className="text-muted-foreground font-bold">/year</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{plan.description}</p>
                                </div>
                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="h-3 w-3 text-primary" /></div>
                                            <span className="text-sm font-medium text-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/become-affiliate" className="w-full">
                                    <Button className={`w-full h-14 rounded-2xl font-bold text-lg`} variant={plan.isPopular ? "default" : "outline"}>Get Started</Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 md:py-48 bg-slate-950/40 relative overflow-hidden backdrop-blur-3xl border-y border-white/5 shadow-inner">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40 animate-pulse" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic leading-tight uppercase">What Our <span className="text-primary not-italic">Partners Say.</span></h2>
                    </div>
                    <TestimonialCarousel />
                </div>
            </section>

            {/* Blog */}
            {blogPosts.length > 0 && (
                <section id="blog" className="py-24 md:py-32">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mb-16">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Latest News</h2>
                            <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground">From the Blog.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {blogPosts.map((post: any, i: number) => (
                                <motion.article key={post.id} className="group cursor-pointer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                                    <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 relative bg-secondary">
                                        {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                    </div>
                                    <div className="space-y-4 px-2">
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            <span className="h-1 w-1 rounded-full bg-border" />
                                            <span>By {post.author}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="pb-24 md:pb-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div className="p-12 md:p-24 rounded-[3rem] bg-foreground text-background relative overflow-hidden text-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic">Ready to Join <span className="text-primary italic">Affilyt?</span></h2>
                            <p className="text-lg md:text-xl text-background/60 mb-12 leading-relaxed">Start earning with Africa's leading affiliate platform today.</p>
                            <Link to="/become-affiliate">
                                <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-xl group shadow-xl">
                                    Get Started <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
