import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MousePointerClick, TrendingUp, Wallet, Copy, Check, Trophy, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { products, earningsData, affiliates } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const topSellers = [
  { name: "Julianne Pierce", subtitle: "Digital Assets Expert", badge: "WEEKLY LEAD", color: "text-success" },
  { name: "Marcus Thorne", subtitle: "SaaS Strategist", badge: "LEVEL 4", color: "text-muted-foreground" },
  { name: "Sarah K.", subtitle: "Cloud Solutions", badge: "LEVEL 3", color: "text-muted-foreground" },
];

const AffiliateDashboard = () => {
  const { affiliateId } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = (productId: string) => {
    const link = `${window.location.origin}/product/${productId}?ref=${affiliateId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(productId);
    toast({ title: "Link copied!", description: "Share it to start earning." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="affiliate" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <div>
              <h1 className="text-2xl font-black text-foreground">Partner Dashboard</h1>
              <p className="text-sm text-muted-foreground">Precision metrics for your affiliate performance. Monitor conversion trends and manage your active promotional links across the digital ecosystem.</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Earnings" value="$1,250.00" icon={DollarSign} trend="+12.5% from last month" />
            <StatsCard title="Total Clicks" value="4,892" icon={MousePointerClick} trend="+4.2% active sessions" />
            <StatsCard title="Conversion Rate %" value="2.4%" icon={TrendingUp} trend="-0.8% dropoff" trendDown />
            <StatsCard title="Pending Payouts" value="$145.50" icon={Wallet} subtitle="Scheduled for Friday" />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">Revenue Momentum</h2>
                  <p className="text-xs text-muted-foreground">Daily earnings performance for the last 30 days</p>
                </div>
                <span className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">Last 30 Days</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(220, 9%, 46%)" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 9%, 46%)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "12px" }} />
                  <Bar dataKey="earnings" fill="hsl(240, 60%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                <h2 className="text-base font-bold text-foreground">Top Sellers</h2>
              </div>
              <div className="space-y-4">
                {topSellers.map((seller, i) => (
                  <div key={seller.name} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {seller.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.subtitle}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${seller.color}`}>{seller.badge}</span>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-lg border border-border py-2 text-xs font-semibold text-primary hover:bg-accent transition-colors">
                View Full Rankings
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-bold text-foreground">Active Campaigns</h2>
              <p className="text-xs text-muted-foreground">Generate and manage unique referral links for approved digital products.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product Name</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Base Price</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Commission</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Promote</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                            <span className="text-primary text-xs font-bold">{p.category[0]}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{p.title}</p>
                            <p className="text-[10px] text-muted-foreground">{p.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground font-mono text-sm">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-bold text-success">50%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          className="rounded-lg bg-primary text-primary-foreground gap-1.5 text-xs h-8 px-4"
                          onClick={() => copyLink(p.id)}
                        >
                          {copiedId === p.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedId === p.id ? "Copied!" : "Copy Unique Link"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-6 py-3 text-center">
              <button className="text-xs font-medium text-primary hover:underline">View all {products.length} active products</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-6 mt-8">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>Executive Ledger — © 2024 The Executive Ledger. All rights reserved.</span>
            <div className="flex gap-6">
              <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer">API Docs</span>
              <span className="hover:text-foreground cursor-pointer">Support</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
