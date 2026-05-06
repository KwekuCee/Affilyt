import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { Package, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InventoryAnalytics = () => {
    const { user } = useAuth();
    const [data, setData] = useState<{ id: string; title: string; revenue: number; sales: number; stock: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchAnalytics = async () => {
            // Fetch products and their orders to calculate analytics
            const { data: products } = await supabase.from("products").select("id, title, price, stock_quantity").eq("seller_id", user.id);
            const { data: orders } = await supabase.from("orders").select("product_id, amount, seller_earnings").eq("seller_id", user.id);

            const analytics = (products || []).map((p: any) => {
                const pOrders = (orders || []).filter((o: any) => o.product_id === p.id);
                const revenue = pOrders.reduce((sum: number, o: any) => sum + Number(o.seller_earnings || 0), 0);
                return {
                    id: p.id,
                    title: p.title,
                    revenue: revenue,
                    sales: pOrders.length,
                    stock: p.stock_quantity ?? 999 // treating null as infinite/high for visual sorting
                };
            });

            // Sort by sales descending
            analytics.sort((a, b) => b.sales - a.sales);
            setData(analytics);
            setIsLoading(false);
        };
        fetchAnalytics();
    }, [user]);

    if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

    const bestSellers = [...data].sort((a, b) => b.sales - a.sales).slice(0, 3);
    const slowMovers = [...data].filter(d => d.sales < 2).sort((a, b) => a.sales - b.sales).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Inventory Analytics</h2>
                    <p className="text-muted-foreground font-medium">Deep dive into your product performance.</p>
                </div>
                <Package className="h-10 w-10 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 p-8 rounded-[2rem] glass">
                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest mb-6">Revenue Per Product</h3>
                    <div className="h-[300px] w-full">
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.slice(0, 7)} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', background: 'hsl(var(--background))', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }} />
                                    <Bar dataKey="revenue" radius={[10, 10, 10, 10]}>
                                        {data.slice(0, 7).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - (index * 0.1)})`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">No sales data available to chart.</div>
                        )}
                    </div>
                </div>

                {/* Insights */}
                <div className="space-y-8">
                    <div className="p-8 rounded-[2rem] glass-primary space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <TrendingUp className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Best Selling Products</h3>
                        </div>
                        <div className="space-y-4">
                            {bestSellers.map(p => (
                                <div key={p.id} className="flex justify-between items-center">
                                    <p className="font-bold text-sm truncate pr-4">{p.title}</p>
                                    <p className="font-black text-foreground">{p.sales} <span className="text-[10px] text-muted-foreground font-normal">sales</span></p>
                                </div>
                            ))}
                            {bestSellers.length === 0 && <p className="text-xs italic text-primary/70">No sales recorded yet.</p>}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] glass space-y-6">
                        <div className="flex items-center gap-3 text-destructive">
                            <TrendingDown className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Slow Movers</h3>
                        </div>
                        <div className="space-y-4">
                            {slowMovers.map(p => (
                                <div key={p.id} className="flex justify-between items-center">
                                    <p className="font-bold text-sm truncate pr-4">{p.title}</p>
                                    <Badge variant="outline" className="text-[10px] text-destructive border-destructive/20 bg-destructive/5">{p.sales} sales</Badge>
                                </div>
                            ))}
                            {slowMovers.length === 0 && <p className="text-xs italic text-muted-foreground">All your products are selling well!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryAnalytics;
