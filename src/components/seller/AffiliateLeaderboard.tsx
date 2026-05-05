import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Award, Trophy, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AffiliateLeaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchLeaderboard = async () => {
            // Fetch orders to aggregate affiliate performance for this seller
            const { data: orders } = await supabase.from("orders").select("affiliate_id, amount").eq("seller_id", user.id).not("affiliate_id", "is", null);

            const map: Record<string, { sales: number, revenue: number }> = {};
            (orders || []).forEach((o: any) => {
                if (!map[o.affiliate_id]) map[o.affiliate_id] = { sales: 0, revenue: 0 };
                map[o.affiliate_id].sales += 1;
                map[o.affiliate_id].revenue += Number(o.amount);
            });

            const affiliateIds = Object.keys(map);
            if (affiliateIds.length === 0) {
                setIsLoading(false);
                return;
            }

            // Fetch profiles
            const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", affiliateIds);

            const combined = (profiles || []).map((p: any) => ({
                ...p,
                sales: map[p.user_id].sales,
                revenue: map[p.user_id].revenue
            })).sort((a, b) => b.revenue - a.revenue);

            setLeaders(combined);
            setIsLoading(false);
        };

        fetchLeaderboard();
    }, [user]);

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Affiliate Leaderboard</h2>
                    <p className="text-muted-foreground font-medium">Your top promoters driving the most revenue.</p>
                </div>
                <Trophy className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-4">
                {leaders.length === 0 ? (
                    <div className="p-10 rounded-[2rem] glass text-center flex flex-col items-center justify-center">
                        <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground font-bold">No affiliates have made a sale yet.</p>
                    </div>
                ) : (
                    leaders.map((l, index) => (
                        <div key={l.user_id} className={`p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${index === 0 ? 'glass-primary border-primary/30' : 'glass'}`}>
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-lg ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                    #{index + 1}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg flex items-center gap-2">
                                        {l.full_name || 'Anonymous Affiliate'}
                                        {index === 0 && <Trophy className="h-4 w-4 text-warning" />}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{l.email}</p>
                                </div>
                            </div>

                            <div className="flex gap-8 w-full md:w-auto text-left md:text-right">
                                <div>
                                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest">Sales</p>
                                    <p className="font-black text-secondary-foreground text-xl">{l.sales}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest">Revenue</p>
                                    <p className="font-black text-success text-xl">${Number(l.revenue).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="w-full md:w-auto flex justify-end">
                                <Button variant="secondary" className="w-full md:w-auto rounded-xl" onClick={() => window.location.href = `mailto:${l.email}`}>
                                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AffiliateLeaderboard;
