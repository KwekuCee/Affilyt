import { useState, useMemo } from "react";
import { Filter, ShoppingCart, Eye, MousePointerClick, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const funnelProducts = [
    { id: "all", label: "All Products" },
    { id: "p1", label: "Digital Marketing Mastery" },
    { id: "p2", label: "Premium Fitness Tracker" },
    { id: "p3", label: "E-Book Bundle" },
    { id: "p4", label: "Wireless Headphones Pro" },
];

const funnelData: Record<string, { clicks: number; views: number; addToCart: number; purchases: number }> = {
    all: { clicks: 12400, views: 8200, addToCart: 2100, purchases: 520 },
    p1: { clicks: 4200, views: 3100, addToCart: 850, purchases: 210 },
    p2: { clicks: 3100, views: 2000, addToCart: 520, purchases: 130 },
    p3: { clicks: 2800, views: 1800, addToCart: 420, purchases: 105 },
    p4: { clicks: 2300, views: 1300, addToCart: 310, purchases: 75 },
};

const stages = [
    { key: "clicks", label: "Clicks", icon: MousePointerClick, color: "bg-blue-500" },
    { key: "views", label: "Page Views", icon: Eye, color: "bg-indigo-500" },
    { key: "addToCart", label: "Add to Cart", icon: ShoppingCart, color: "bg-amber-500" },
    { key: "purchases", label: "Purchases", icon: CreditCard, color: "bg-primary" },
] as const;

const ConversionFunnel = () => {
    const [selectedProduct, setSelectedProduct] = useState("all");

    const data = funnelData[selectedProduct];
    const maxVal = data.clicks;

    const convRate = (from: number, to: number) => from > 0 ? ((to / from) * 100).toFixed(1) : "0";

    const chartData = stages.map(s => ({ name: s.label, value: data[s.key] }));

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Conversion Funnel</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track clicks → views → add-to-cart → purchases.</p>
                </div>
                <select
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                    className="h-10 rounded-xl bg-secondary border-none font-medium px-4 text-sm text-foreground"
                >
                    {funnelProducts.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
            </div>

            {/* Funnel Stages */}
            <div className="space-y-3">
                {stages.map((stage, i) => {
                    const value = data[stage.key];
                    const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
                    const prevValue = i > 0 ? data[stages[i - 1].key] : null;
                    const dropOff = prevValue ? convRate(prevValue, value) : null;
                    const Icon = stage.icon;

                    return (
                        <div key={stage.key} className="relative">
                            {i > 0 && (
                                <div className="flex items-center justify-center h-6 -mt-1.5 -mb-1.5 relative z-10">
                                    <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2">
                                        {dropOff}% conversion ↓
                                    </span>
                                </div>
                            )}
                            <div className="p-4 sm:p-5 rounded-2xl glass flex items-center gap-4">
                                <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${stage.color}/10 flex items-center justify-center shrink-0`}>
                                    <Icon className={`h-5 w-5 ${stage.color.replace("bg-", "text-")}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                                        <p className="text-sm font-bold text-foreground">{value.toLocaleString()}</p>
                                    </div>
                                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${stage.color} transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary row + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary */}
                <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Summary</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl glass-subtle">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Overall CVR</p>
                            <p className="text-xl font-bold text-primary">{convRate(data.clicks, data.purchases)}%</p>
                        </div>
                        <div className="p-3 rounded-xl glass-subtle">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Cart → Purchase</p>
                            <p className="text-xl font-bold text-foreground">{convRate(data.addToCart, data.purchases)}%</p>
                        </div>
                        <div className="p-3 rounded-xl glass-subtle">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">View → Cart</p>
                            <p className="text-xl font-bold text-foreground">{convRate(data.views, data.addToCart)}%</p>
                        </div>
                        <div className="p-3 rounded-xl glass-subtle">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Click → View</p>
                            <p className="text-xl font-bold text-foreground">{convRate(data.clicks, data.views)}%</p>
                        </div>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="p-5 sm:p-6 rounded-2xl glass">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Visualization</h3>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }}
                                />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversionFunnel;
