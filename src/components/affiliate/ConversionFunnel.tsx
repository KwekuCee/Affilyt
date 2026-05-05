import { useState, useMemo } from "react";
import { Filter, TrendingDown, ArrowDown, ShoppingCart, Eye, MousePointerClick, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Mock product funnel data
const mockProducts = [
    { id: "1", name: "Digital Marketing Course", clicks: 2840, views: 2100, addToCart: 460, purchases: 128 },
    { id: "2", name: "Fitness Tracker Pro", clicks: 1920, views: 1580, addToCart: 380, purchases: 95 },
    { id: "3", name: "E-Book Bundle Pack", clicks: 3200, views: 2600, addToCart: 720, purchases: 210 },
    { id: "4", name: "Premium Headphones", clicks: 1100, views: 890, addToCart: 190, purchases: 52 },
    { id: "5", name: "Online Cooking Class", clicks: 1650, views: 1200, addToCart: 310, purchases: 88 },
];

const funnelStages = [
    { key: "clicks", label: "Clicks", icon: MousePointerClick, color: "hsl(var(--primary))" },
    { key: "views", label: "Page Views", icon: Eye, color: "hsl(142 76% 46%)" },
    { key: "addToCart", label: "Add to Cart", icon: ShoppingCart, color: "hsl(38 92% 50%)" },
    { key: "purchases", label: "Purchases", icon: CreditCard, color: "hsl(280 70% 55%)" },
] as const;

const ConversionFunnel = () => {
    const [selectedProduct, setSelectedProduct] = useState<string>("all");

    const funnelData = useMemo(() => {
        if (selectedProduct === "all") {
            return funnelStages.map(stage => ({
                stage: stage.label,
                value: mockProducts.reduce((s, p) => s + p[stage.key], 0),
                color: stage.color,
                icon: stage.icon,
            }));
        }
        const product = mockProducts.find(p => p.id === selectedProduct);
        if (!product) return [];
        return funnelStages.map(stage => ({
            stage: stage.label,
            value: product[stage.key],
            color: stage.color,
            icon: stage.icon,
        }));
    }, [selectedProduct]);

    const conversionRates = useMemo(() => {
        if (funnelData.length < 2) return [];
        return funnelData.slice(1).map((stage, i) => ({
            from: funnelData[i].stage,
            to: stage.stage,
            rate: funnelData[i].value > 0 ? ((stage.value / funnelData[i].value) * 100).toFixed(1) : "0",
        }));
    }, [funnelData]);

    const overallRate = funnelData.length >= 2 && funnelData[0].value > 0
        ? ((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(1)
        : "0";

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Conversion Funnel</h2>
                    <p className="text-muted-foreground font-medium">Track your customer journey from click to purchase.</p>
                </div>
                <Filter className="h-10 w-10 text-primary" />
            </div>

            {/* Product Filter */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => setSelectedProduct("all")}
                    className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${selectedProduct === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                        }`}
                >
                    All Products
                </button>
                {mockProducts.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedProduct(p.id)}
                        className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${selectedProduct === p.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                            }`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Funnel */}
                <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-border shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Funnel Visualization</h3>

                    <div className="space-y-6">
                        {funnelData.map((stage, i) => {
                            const widthPercent = funnelData[0].value > 0
                                ? Math.max(15, (stage.value / funnelData[0].value) * 100)
                                : 100;
                            const StageIcon = stage.icon;

                            return (
                                <div key={stage.stage}>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stage.color}20` }}>
                                            <StageIcon className="h-5 w-5" style={{ color: stage.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-black text-foreground uppercase">{stage.stage}</p>
                                                <p className="text-lg font-black text-foreground">{stage.value.toLocaleString()}</p>
                                            </div>
                                            <div className="h-8 w-full bg-secondary/50 rounded-xl overflow-hidden relative">
                                                <div
                                                    className="h-full rounded-xl transition-all duration-1000 ease-out relative overflow-hidden"
                                                    style={{ width: `${widthPercent}%`, backgroundColor: stage.color }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {i < funnelData.length - 1 && conversionRates[i] && (
                                        <div className="flex items-center justify-center gap-2 py-2">
                                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                                            <Badge className="bg-secondary text-foreground border-none text-[10px] font-black px-3 py-1 rounded-full">
                                                {conversionRates[i].rate}% conversion
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Overall Conversion */}
                    <div className="p-8 rounded-[2.5rem] bg-primary/10 border-2 border-primary/20 shadow-xl text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Overall Conversion</p>
                        <p className="text-5xl font-black text-foreground italic">{overallRate}%</p>
                        <p className="text-xs font-bold text-muted-foreground mt-2">Click to Purchase</p>
                    </div>

                    {/* Stage Breakdown */}
                    <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Stage Rates</h3>
                        {conversionRates.map((cr, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-all">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">{cr.from}</p>
                                    <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                                        <TrendingDown className="h-3 w-3" /> to {cr.to}
                                    </p>
                                </div>
                                <p className="text-lg font-black text-foreground">{cr.rate}%</p>
                            </div>
                        ))}
                    </div>

                    {/* Recharts Mini Bar */}
                    <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Quick Chart</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                    <XAxis dataKey="stage" tick={{ fontSize: 8, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} />
                                    <YAxis tick={{ fontSize: 8, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 16, border: "2px solid hsl(var(--border))", background: "hsl(var(--card))", fontWeight: 800, fontSize: 12 }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {funnelData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversionFunnel;
