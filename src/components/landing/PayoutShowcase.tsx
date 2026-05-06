import { motion } from "framer-motion";
import { CheckCircle2, Wallet, Zap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PayoutShowcase = () => {
    return (
        <section className="py-24 relative overflow-hidden border-y border-white/5 block">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-transparent pointer-events-none z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-black uppercase tracking-widest mb-6">
                            <Zap className="w-3 h-3" /> Under 1-Second Payouts
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">Stop waiting 30 days for your money.</h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-medium">
                            We partnered with Korapay to build an automated payout engine. When you request your earnings, your MoMo wallet is credited instantly via API. No holds. No manual approvals.
                        </p>

                        <div className="space-y-4 mb-10">
                            {["Withdraw directly to MTN, Vodafone, or AirtelTigo", "No minimum withdrawal holds for Promoters", "Bank-grade Korapay encryption & real-time webhook verifications"].map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground">{f}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/become-affiliate">
                            <Button size="lg" className="h-14 px-8 rounded-2xl font-black uppercase tracking-tight shadow-lg shadow-primary/20">Experience Instant Payouts</Button>
                        </Link>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-3xl opacity-50" />
                        <div className="p-8 rounded-[2rem] glass-subtle border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 bg-background/50 backdrop-blur-3xl">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Available Balance</p>
                                        <p className="text-3xl font-display font-black text-white drop-shadow-md">$450.00</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="p-5 rounded-2xl bg-secondary/50 flex justify-between items-center border border-white/5">
                                    <div>
                                        <p className="font-black text-sm uppercase text-foreground">Mobile Money (MTN)</p>
                                        <p className="text-xs font-bold text-muted-foreground">024 •••• 893</p>
                                    </div>
                                    <ShieldCheck className="w-6 h-6 text-success" />
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase text-lg tracking-tight flex items-center justify-center overflow-hidden relative group shadow-xl shadow-primary/30"
                            >
                                <span className="relative z-10 transition-transform group-hover:-translate-y-12 duration-300">Withdraw $450.00</span>
                                <span className="absolute inset-0 flex items-center justify-center text-white translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                                    Processing... <Zap className="w-5 h-5 ml-2 animate-pulse text-amber-300" />
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
