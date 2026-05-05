import { useState } from "react";
import {
    BarChart3, Globe, TrendingUp, Award, Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from "recharts";

const platforms = [
    { name: "Instagram", short: "IG", emoji: "📸", clicks: 4200, conversions: 168, revenue: 2940, color: "#E1306C" },
    { name: "TikTok", short: "TT", emoji: "🎵", clicks: 3800, conversions: 190, revenue: 3325, color: "#000000" },
    { name: "WhatsApp", short: "WA", emoji: "💬", clicks: 2100, conversions: 147, revenue: 2572, color: "#25D366" },
    { name: "Twitter/X", short: "X", emoji: "🐦", clicks: 1500, conversions: 45, revenue: 787, color: "#1DA1F2" },
    { name: "YouTube", short: "YT", emoji: "▶️", clicks: 1900, conversions: 114, revenue: 1995, color: "#FF0000" },
    { name: "Facebook", short: "FB", emoji: "👍", clicks: 900, conversions: 36, revenue: 630, color: "#4267B2" },
];

const metrics = ["clicks", "conversions", "revenue"] as const;
type Metric = typeof metrics[number];

const ChannelAttribution = () => {
    const [activeMetric, setActiveMetric] = useState<Metric>("revenue");

    const bestPlatform = [...platforms].sort((a, b) => b[activeMetric] - a[activeMetric])[0];
    const totalMetric = platforms.reduce((s, p) => s + p[activeMetric], 0);

    const chartData = platforms.map(p => ({
        name: p.short,
        clicks: p.clicks,
        conversions: p.conversions,
        revenue: p.revenue,
        fill: p.color,
    }));

    const pieData = platforms.map(p => ({
        name: p.name,
        value: p[activeMetric],
        color: p.color,
    }));

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Channel Analytics</h2>
                    <p className="text-muted-foreground font-medium">See which platform drives the most revenue.</p>
                </div>
                <Globe className="h-10 w-10 text-primary" />
            </div>

            {/* Metric Toggle */}
            <div className="flex gap-3">
                {metrics.map(m => (
                    <button
                        key={m}
                        onClick={() => setActiveMetric(m)}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${activeMetric === m
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "bg-card border-2 border-border text-foreground hover:border-primary/30"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Best Platform Highlight */}
            <div className="p-8 rounded-[3rem] border-2 border-primary/20 shadow-2xl relative overflow-hidden" style={{ backgroundColor: `${bestPlatform.color}10` }}>
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: `${bestPlatform.color}20` }} />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${bestPlatform.color}20` }}>
                        {bestPlatform.emoji}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-amber-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best Performing Channel</p>
                        </div>
                        <p className="text-3xl font-black text-foreground italic">{bestPlatform.name}</p>
                        <p className="text-sm font-bold text-muted-foreground">
                            {activeMetric === "revenue" && `$${bestPlatform.revenue.toLocaleString()} revenue`}
                            {activeMetric === "clicks" && `${bestPlatform.clicks.toLocaleString()} clicks`}
                            {activeMetric === "conversions" && `${bestPlatform.conversions} conversions`}
                            {" "} — {((bestPlatform[activeMetric] / totalMetric) * 100).toFixed(1)}% of total
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Comparison</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 16, border: "2px solid hsl(var(--border))", background: "hsl(var(--card))", fontWeight: 800, fontSize: 12 }}
                                    formatter={(value: number) => activeMetric === "revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
                                />
                                <Bar dataKey={activeMetric} radius={[10, 10, 0, 0]}>
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: 16, border: "2px solid hsl(var(--border))", background: "hsl(var(--card))", fontWeight: 800, fontSize: 12 }}
                                    formatter={(value: number) => activeMetric === "revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
                                />
                                <Legend
                                    formatter={(value) => <span className="text-xs font-bold">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {platforms.map(p => {
                    const cvr = p.clicks > 0 ? ((p.conversions / p.clicks) * 100).toFixed(1) : "0";
                    const isBest = p.name === bestPlatform.name;
                    return (
                        <div key={p.name} className={`p-6 rounded-[2rem] border-2 transition-all text-center ${isBest ? "bg-primary/10 border-primary/30 shadow-xl" : "bg-card/40 border-border"}`}>
                            <span className="text-3xl mb-3 block">{p.emoji}</span>
                            <p className="font-black text-sm text-foreground mb-1">{p.short}</p>
                            <p className="text-lg font-black text-foreground italic">${p.revenue.toLocaleString()}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">{p.conversions} sales</p>
                            <Badge className="mt-2 bg-secondary text-muted-foreground border-none text-[9px] font-black rounded-full">{cvr}% CVR</Badge>
                            {isBest && <Badge className="mt-1 bg-amber-400/20 text-amber-600 border-none text-[8px] font-black rounded-full block w-fit mx-auto">#1</Badge>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelAttribution;
