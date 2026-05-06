import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const EliteWallPeek = () => {
    const [leaders, setLeaders] = useState<any[]>([]);

    useEffect(() => {
        supabase.from("leaderboard_stats" as any).select("*").order("total_earnings", { ascending: false }).limit(3)
            .then(({ data }) => setLeaders(data || []));
    }, []);

    const displayLeaders = leaders;

    if (leaders.length < 3) return null; // Don't show podium if not enough real data

    return (
        <section className="py-24 overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-3 flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4" /> Elite Hunters
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-16 shadow-transparent">Top earners this month.</h2>

                <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-4xl mx-auto md:h-[400px] mb-12">
                    {/* Rank 2 */}
                    <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <p className="font-bold text-lg">{displayLeaders[1]?.full_name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest drop-shadow-md">{displayLeaders[1]?.package_tier} Tier</p>
                        </div>
                        <div className="w-full h-48 rounded-t-3xl bg-secondary/40 border-t border-x border-white/5 flex flex-col items-center justify-start pt-6 glass relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                            <span className="text-4xl font-black text-slate-400">#2</span>
                            <p className="mt-2 font-display text-xl font-bold text-gradient">${displayLeaders[1]?.total_earnings?.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    {/* Rank 1 */}
                    <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center z-10">
                        <div className="mb-4 text-center relative">
                            <Star className="w-6 h-6 text-amber-500 absolute -top-8 left-1/2 -translate-x-1/2" />
                            <p className="font-bold text-xl text-amber-500">{displayLeaders[0]?.full_name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{displayLeaders[0]?.package_tier} Tier</p>
                        </div>
                        <div className="w-full h-64 rounded-t-3xl bg-amber-500/10 border-t border-x border-amber-500/20 flex flex-col items-center justify-start pt-8 glass relative overflow-hidden shadow-[0_-10px_40px_rgba(245,158,11,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                            <span className="text-6xl font-black text-amber-500 drop-shadow-lg">#1</span>
                            <p className="mt-4 font-display text-2xl font-bold text-gradient">${displayLeaders[0]?.total_earnings?.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    {/* Rank 3 */}
                    <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="order-3 w-full md:w-1/3 flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <p className="font-bold text-lg">{displayLeaders[2]?.full_name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{displayLeaders[2]?.package_tier} Tier</p>
                        </div>
                        <div className="w-full h-40 rounded-t-3xl bg-secondary/20 border-t border-x border-white/5 flex flex-col items-center justify-start pt-4 glass relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                            <span className="text-3xl font-black text-amber-900/60 drop-shadow-xl">#3</span>
                            <p className="mt-2 font-display text-lg font-bold text-gradient">${displayLeaders[2]?.total_earnings?.toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>

                <div>
                    <Link to="/affiliate-pricing"><Button variant="outline" className="gap-2 rounded-xl h-12 uppercase font-black text-xs">Claim your spot <ArrowRight className="w-4 h-4 border-white" /></Button></Link>
                </div>
            </div>
        </section>
    );
};
