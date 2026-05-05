import { useState } from "react";
import { Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const platforms = [
    { name: "Instagram", short: "IG", emoji: "📸", clicks: 4200, conversions: 168, revenue: 2940, color: "#E1306C" },
    { name: "TikTok", short: "TT", emoji: "🎵", clicks: 3800, conversions: 190, revenue: 3325, color: "#010101" },
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

    const chartData = platforms.map(p => ({ name: p.short, [activeMetric]: p[activeMetric], fill: p.color }));
    const pieData = platforms.map(p => ({ name: p.name, value: p[activeMetric], color: p.color }));

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Channel Analytics</h2>
                <p className="text-sm text-muted-foreground mt-1">See which platform drives the most revenue.</p>
            </div>

            {/* Metric Toggle */}
            <div className="flex gap-2">
                {metrics.map(m => (
                    <button key={m} onClick={() => setActiveMetric(m)} className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeMetric === m ? "bg-primary text-primary-foreground" : "glass-subtle"}`}>
                        {m}
                    </button>
                ))}
            </div>

            {/* Best Platform */}
            <div className="p-5 sm:p-6 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden" style={{ backgroundColor: `${bestPlatform.color}08` }}>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${bestPlatform.color}15` }}>{bestPlatform.emoji}</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-400" />
                            <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">Best Performing</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">{bestPlatform.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {activeMetric === "revenue" && `$${bestPlatform.revenue.toLocaleString()}`}
                            {activeMetric === "clicks" && `${bestPlatform.clicks.toLocaleString()} clicks`}
                            {activeMetric === "conversions" && `${bestPlatform.conversions} conversions`}
                            {" — "}{((bestPlatform[activeMetric] / totalMetric) * 100).toFixed(1)}% of total
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 sm:p-6 rounded-2xl glass">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Comparison</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} formatter={(v: number) => activeMetric === "revenue" ? `$${v.toLocaleString()}` : v.toLocaleString()} />
                                <Bar dataKey={activeMetric} radius={[6, 6, 0, 0]}>{chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl glass">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Distribution</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} formatter={(v: number) => activeMetric === "revenue" ? `$${v.toLocaleString()}` : v.toLocaleString()} />
                                <Legend formatter={v => <span className="text-xs">{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {platforms.map(p => {
                    const cvr = p.clicks > 0 ? ((p.conversions / p.clicks) * 100).toFixed(1) : "0";
                    const isBest = p.name === bestPlatform.name;
                    return (
                        <div key={p.name} className={`p-4 rounded-2xl border text-center transition-all ${isBest ? "bg-primary/5 border-primary/30 shadow-sm" : "glass-subtle"}`}>
                            <span className="text-2xl mb-2 block">{p.emoji}</span>
                            <p className="font-semibold text-xs text-foreground">{p.short}</p>
                            <p className="text-base font-bold text-foreground mt-1">${p.revenue.toLocaleString()}</p>
                            <p className="text-[9px] text-muted-foreground">{p.conversions} sales</p>
                            <Badge variant="secondary" className="mt-1.5 text-[9px]">{cvr}% CVR</Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChannelAttribution;
