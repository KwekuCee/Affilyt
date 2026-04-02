import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, MousePointerClick, TrendingUp, Wallet, Copy, Check, Trophy } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { products, earningsData, affiliates } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
          <h1 className="text-xl font-extrabold text-foreground">Affiliate Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your performance and manage affiliate links</p>
        </div>

        <div className="p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Earnings" value="₵2,450" icon={DollarSign} trend="+12.5% this month" />
            <StatsCard title="Total Clicks" value="1,230" icon={MousePointerClick} trend="+8.2% this week" />
            <StatsCard title="Conversion Rate" value="3.98%" icon={TrendingUp} />
            <StatsCard title="Pending Payouts" value="₵500" icon={Wallet} />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-bold text-foreground">Earnings — Last 30 Days</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 9%, 46%)" />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(245, 58%, 51%)" fill="url(#fillEarnings)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                <h2 className="text-sm font-bold text-foreground">Top Affiliates</h2>
              </div>
              <div className="space-y-4">
                {affiliates.slice(0, 5).map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-btn text-xs font-bold">
                      {a.avatar}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">₵{"••••"}</p>
                    </div>
                    <span className="text-xs font-extrabold text-muted-foreground">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-sm font-bold text-foreground">Link Generator</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Product</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Price</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Commission</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-6 py-4 font-semibold text-foreground">{p.title}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono">₵{p.price}</td>
                      <td className="px-6 py-4 font-bold text-success font-mono">₵{(p.price * 0.5).toFixed(0)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs" onClick={() => copyLink(p.id)}>
                          {copiedId === p.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedId === p.id ? "Copied!" : "Copy Link"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
