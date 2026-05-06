import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Activity } from "lucide-react";

const mockEvents = [
    { id: 1, type: "payout", text: "Affiliate #8493 just withdrew $150 via MTN MoMo", icon: DollarSign, color: "text-success" },
    { id: 2, type: "sale", text: "New sale recorded for 'Premium Trade Signals'", icon: ShoppingCart, color: "text-primary" },
    { id: 3, type: "payout", text: "Seller #1029 cashed out $4,200 via Bank Transfer", icon: DollarSign, color: "text-amber-500" },
    { id: 4, type: "signup", text: "7 new hunters joined in the last hour", icon: Activity, color: "text-blue-500" },
    { id: 5, type: "sale", text: "Affiliate #3821 earned $45 commission", icon: DollarSign, color: "text-success" },
];

export const LiveTicker = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 py-3 overflow-hidden pointer-events-none">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                className="flex whitespace-nowrap items-center"
                style={{ width: "fit-content" }}
            >
                {[...mockEvents, ...mockEvents, ...mockEvents, ...mockEvents].map((event, idx) => (
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
