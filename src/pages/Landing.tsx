import { motion } from "framer-motion";
import {
    ArrowRight,
    Play,
    CheckCircle2,
    TrendingUp,
    Users,
    Globe,
    Zap,
    ShieldCheck,
    BarChart3,
    Layers,
    Star
} from "lucide-react";
import { Link } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import {
    products,
    blogPosts,
    testimonials
} from "@/lib/data";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useData } from "@/context/DataContext";
import * as LucideIcons from "lucide-react";

const Landing = () => {
    const { landingContent, products: systemProducts, packages } = useData();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    // Helper to get icon component from string
    const getIcon = (name: string) => {
        const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
        return Icon;
    };

    const stats = landingContent.stats.map(s => ({ ...s, icon: getIcon(s.icon) }));
    const features = landingContent.features.map(f => ({ ...f, icon: getIcon(f.icon) }));

    const pricingPlans = packages.map(pkg => ({
        name: pkg.name,
        price: `$${pkg.price}`,
        description: pkg.name === "Basic" ? "Great for beginners. Includes basic tools to start selling." :
            pkg.name === "Standard" ? "Our most popular choice. Includes full training and support." :
                "The absolute best. Includes VIP benefits and priority help.",
        features: [
            `${pkg.commission}% Commission`,
            pkg.name === "Basic" ? "Monthly Payouts" : pkg.name === "Standard" ? "Every Two Weeks" : "Weekly Payouts",
            "Marketing Materials",
            "Full Network Access"
        ],
        isPopular: pkg.name === "Standard"
    }));

    return (
        <div className="min-h-screen bg-transparent overflow-x-hidden">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">
                                    Start Your Journey Today
                                </Badge>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] mb-6">
                                    {landingContent.heroTitle.split(" ").map((word, i) => (
                                        <span key={i}>
                                            {(word === "Hub" || word === "Affiliate") ? <span className="text-primary italic">{word} </span> : word + " "}
                                        </span>
                                    ))}
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                    {landingContent.heroSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <Link to="/become-affiliate">
                                        <Button size="lg" className="h-14 px-8 rounded-2xl font-bold text-lg group shadow-xl shadow-primary/20">
                                            Start Earning Now
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl font-bold text-lg bg-background/50 backdrop-blur-sm border-2">
                                        <Play className="mr-2 h-5 w-5 fill-primary text-primary" />
                                        Start Tutorial
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative rounded-[2.5rem] overflow-hidden border-[8px] border-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] aspect-[4/3] group">
                                <img
                                    src="/ledger_hero.png"
                                    alt="Executive Ledger Interface"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
                            </div>

                            {/* Floating Element 1 */}
                            <motion.div
                                className="absolute -top-6 -left-6 bg-card p-4 rounded-2xl shadow-2xl border border-border flex items-center gap-4 hidden md:flex"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-success" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Earnings Active</p>
                                    <p className="text-lg font-black text-foreground">+$1,280.40</p>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 */}
                            <motion.div
                                className="absolute -bottom-8 -right-8 bg-background/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-border hidden md:block max-w-[200px]"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
                                </div>
                                <p className="text-xs font-medium text-foreground leading-snug">
                                    "The most robust affiliate hub I've ever used. Truly institutional."
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Live Numbers Section */}
            <section className="py-20 bg-primary/5 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="text-center md:text-left"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-2 lg:mb-0">
                                    <div className="p-3 rounded-xl bg-card border border-border shadow-sm mb-3 md:mb-0">
                                        <stat.icon className="h-6 w-6 text-primary" />
                                    </div>
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

            {/* Features Section */}
            <section id="features" className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Infrastructure Excellence</h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Designed for Institutional Scale.</p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We provide the tools normally reserved for top-tier agencies. Now available for every high-performance affiliate operation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className="group relative p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 md:py-32 bg-secondary/50 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Marketplace Alpha</h2>
                            <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Featured Institutional Assets.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.slice(0, 3).map((product, i) => (
                            <motion.div
                                key={product.id}
                                className="flex flex-col h-full rounded-[2rem] overflow-hidden bg-card border border-border group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            {product.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-2xl font-black text-foreground">${product.price}</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-3 w-3 fill-primary text-primary" />)}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {product.features.slice(0, 3).map(f => (
                                            <span key={f} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-2.5 py-1 rounded-md">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Package Choice Section (Pricing) */}
            <section id="pricing" className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-20">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Strategic Access</h2>
                        <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">Choose Your Growth Path.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl border-2 transition-all duration-300 ${plan.isPopular ? "bg-white/10 border-primary shadow-2xl shadow-primary/10 scale-105 z-10" : "bg-card/40 border-border hover:border-primary/30"
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                {plan.isPopular && (
                                    <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground border-none font-bold uppercase tracking-widest text-[10px]">
                                        Most Chosen
                                    </Badge>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-widest">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl md:text-5xl font-black text-foreground">{plan.price}</span>
                                        {plan.price !== "Custom" && <span className="text-muted-foreground font-bold">/year</span>}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/become-affiliate" className="w-full">
                                    <Button className={`w-full h-14 rounded-2xl font-bold text-lg ${plan.isPopular ? "" : "variant-outline"}`} variant={plan.isPopular ? "default" : "outline"}>
                                        Get Started
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 md:py-48 bg-slate-950/40 relative overflow-hidden backdrop-blur-3xl border-y border-white/5 shadow-inner">
                {/* Cinematic Background Gradient Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40 animate-pulse" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-4 bg-primary/20 backdrop-blur-3xl px-8 py-2 rounded-full border border-primary/40 mb-8"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Trust Matrix 02-X</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic leading-tight uppercase">Trusted by the <span className="text-primary not-italic">Elite Network.</span></h2>
                        <p className="text-white/60 text-lg font-medium italic mt-6 max-w-2xl mx-auto leading-relaxed">
                            Validated feedback from our high-performance partners operating at scale across the global institutional ledger.
                        </p>
                    </div>

                    <TestimonialCarousel />
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">The Ledger Insights</h2>
                            <p className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Market Intelligence.</p>
                        </div>
                        <Button variant="outline" className="rounded-full px-8 font-bold border-2">
                            Read All Articles
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {blogPosts.map((post, i) => (
                            <motion.article
                                key={post.id}
                                className="group cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 relative">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                                            Read More <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                        <span>{post.date}</span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span>By {post.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ready to Earn (CTA) */}
            <section className="pb-24 md:pb-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="p-12 md:p-24 rounded-[3rem] bg-foreground text-background relative overflow-hidden text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full border-[100px] border-background/20 rounded-full scale-150 -translate-y-1/2" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic">
                                Ready to Join the <span className="text-primary italic">Elite Network?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-background/60 mb-12 leading-relaxed">
                                Start your journey towards institutional-scale affiliate earnings today. Our network is ready for your growth.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                                <Link to="/become-affiliate">
                                    <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-xl group shadow-xl">
                                        Deploy Your Ledger
                                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <p className="text-xs font-bold uppercase tracking-widest text-background/40">
                                    Join 12,000+ Institutional Partners
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
