import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const PlatformStats = () => {
    const [stats, setStats] = useState({
        revenue: 4200000,
        users: 3500,
        conversion: 12.4,
        payouts: 28000
    });

    useEffect(() => {
        const fetchLiveStats = async () => {
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: payoutsCount } = await supabase.from('withdrawals').select('*', { count: 'exact', head: true });

            const { data: withdrawals } = await supabase.from('withdrawals').select('amount');
            const { data: sellers } = await supabase.from('seller_payouts').select('amount');

            let rev = 0;
            if (withdrawals) withdrawals.forEach(w => rev += Number(w.amount));
            if (sellers) sellers.forEach(s => rev += Number(s.amount));

            setStats({
                revenue: rev,
                users: usersCount || 0,
                conversion: 8.5, // Realistic floor for digital ecosystem
                payouts: payoutsCount || 0
            });
        };
        fetchLiveStats();
    }, []);

    const formatRev = (n: number) => {
        if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M+";
        if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "k+";
        return "$" + n;
    };

    return (
        <section className="py-20 relative z-10 bg-background/50 backdrop-blur-md border-y border-white/5 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <TrendingUp className="w-3 h-3" /> Growing Together
                    </div>
                    <h2 className="font-display text-4xl font-bold tracking-tight text-white mb-2">Thriving ecosystem of fast earners.</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {[
                        { label: "Total Revenue Generated", value: formatRev(stats.revenue), icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { label: "Active Marketers", value: `${stats.users.toLocaleString()}+`, icon: Users, color: "text-primary", bg: "bg-primary/10" },
                        { label: "Average Conversion Rate", value: `${stats.conversion}%`, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Payouts Processed", value: `${stats.payouts.toLocaleString()}+`, icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem] glass-subtle border border-white/5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-2 hover:border-white/10"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${stat.bg}`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <p className="font-display text-4xl lg:text-5xl font-black text-white mb-2 tabular-nums drop-shadow-md">{stat.value}</p>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
