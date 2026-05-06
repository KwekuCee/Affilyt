import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const LiveTicker = () => {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data: withdrawals } = await supabase.from("withdrawals").select("amount, created_at").order('created_at', { ascending: false }).limit(5);
            const { data: sellerPayouts } = await supabase.from("seller_payouts").select("amount, created_at").order('created_at', { ascending: false }).limit(5);

            const compiledEvents: any[] = [];

            if (withdrawals) {
                withdrawals.forEach((w: any, i: number) => compiledEvents.push({ id: `w-${i}`, type: "payout", text: `Affiliate withdrew $${w.amount} via Mobile Money`, icon: DollarSign, color: "text-success", created_at: w.created_at }));
            }
            if (sellerPayouts) {
                sellerPayouts.forEach((s: any, i: number) => compiledEvents.push({ id: `s-${i}`, type: "payout", text: `Vendor cashed out $${s.amount}`, icon: DollarSign, color: "text-amber-500", created_at: s.created_at }));
            }

            compiledEvents.push({ id: 'signup', type: "signup", text: "Platform adoption increasing", icon: Activity, color: "text-blue-500", created_at: new Date().toISOString() });

            compiledEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setEvents(compiledEvents.slice(0, 8));
        };
        fetchEvents();
    }, []);

    const displayEvents = events.length > 0 ? events : [
        { id: 1, type: "payout", text: "Connecting to live transaction feed...", icon: Activity, color: "text-muted-foreground" }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 py-3 overflow-hidden pointer-events-none">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                className="flex whitespace-nowrap items-center"
                style={{ width: "fit-content" }}
            >
                {[...displayEvents, ...displayEvents, ...displayEvents, ...displayEvents].map((event, idx) => (
                    <div key={`${event.id}-${idx}`} className="flex items-center gap-2 mx-8 opacity-80">
                        <event.icon className={`h-4 w-4 ${event.color}`} />
                        <span className="text-xs font-bold font-display tracking-widest uppercase text-muted-foreground">{event.text}</span>
                        <span className="mx-4 text-white/10">•</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
