import { motion } from "framer-motion";
import { Shield, Globe, Award, Zap, CheckCircle2, TrendingUp, Users, Heart } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const About = () => {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <LandingNavbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary/5">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-xs font-black uppercase tracking-[0.2em]">
                                Institutional Legacy
                            </Badge>
                            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-foreground mb-6">
                                The Story of <span className="text-primary italic text-6xl">the Ledger.</span>
                            </h1>
                            <p className="mt-4 text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                                We are the architectural backbone for digital growth. Established in 2020, we've built the world's most stable infrastructure for high-performance affiliate operations.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Missions */}
            <section className="py-24 bg-background px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative aspect-square rounded-[4rem] bg-secondary/50 border-4 border-border overflow-hidden p-8"
                        >
                            <div className="absolute inset-0 bg-primary/5 blur-3xl" />
                            <div className="h-full w-full rounded-[3.5rem] bg-foreground flex items-center justify-center relative z-10 p-12">
                                <Shield className="h-40 w-40 text-background" />
                                <div className="absolute top-12 left-12 h-12 w-12 rounded-full border-4 border-background/20" />
                                <div className="absolute bottom-12 right-12 h-20 w-20 rounded-full border-4 border-background/10" />
                            </div>
                        </motion.div>

                        <div className="space-y-12">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Precision Engineering</h2>
                                <p className="text-4xl font-black text-foreground mb-6 italic">Built with Zero Compromise.</p>
                                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                                    While others focus on simple clicks, we analyze the micro-behavior of every transaction. Our ledger is not just a database; it is a live ecosystem of trust and verified performance.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Zap, title: "Velocity Driven", desc: "Transactions processed in under 20ms with 100% attribution." },
                                    { icon: Award, title: "Quality Vetted", desc: "Every partner undergoes institution-level verification." },
                                    { icon: Globe, title: "Global Scaling", desc: "Distributed infrastructure across 40+ global nodes." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border-2 border-border group-hover:border-primary/30 transition-all">
                                            <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed italic opacity-80">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-foreground px-4 text-background rounded-b-[5rem]">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-background/60 mb-4">Core Principles</h2>
                        <h3 className="text-5xl font-black tracking-tight text-background leading-[1.1]">The Values That Scale With You.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {[
                            { icon: CheckCircle2, title: "Transparency", desc: "The ledger is never hidden. Real-time access to every metric, always." },
                            { icon: TrendingUp, title: "Performance First", desc: "Optimization is in our DNA. We succeed when our partners scale." },
                            { icon: Heart, title: "Legacy Support", desc: "Institutional partners have access to a human associate 24/7." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-6"
                            >
                                <div className="h-20 w-20 rounded-[2.5rem] bg-background/10 flex items-center justify-center mx-auto border-4 border-background/10">
                                    <item.icon className="h-10 w-10 text-white" />
                                </div>
                                <h4 className="text-2xl font-black italic">{item.title}</h4>
                                <p className="text-background/50 text-sm font-medium leading-relaxed max-w-[280px] mx-auto italic">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
