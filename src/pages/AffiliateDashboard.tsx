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
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-4">
          <h1 className="text-xl font-bold text-foreground">Affiliate Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your performance and manage affiliate links</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Earnings" value="₵2,450" icon={DollarSign} trend="+12.5% this month" />
            <StatsCard title="Total Clicks" value="1,230" icon={MousePointerClick} trend="+8.2% this week" />
            <StatsCard title="Conversion Rate" value="3.98%" icon={TrendingUp} />
            <StatsCard title="Pending Payouts" value="₵500" icon={Wallet} />
          </motion.div>

          {/* Chart + Leaderboard */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-base font-semibold text-foreground">Earnings (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(239, 84%, 67%)" fill="url(#fillEarnings)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                <h2 className="text-base font-semibold text-foreground">Top Affiliates</h2>
              </div>
              <div className="space-y-3">
                {affiliates.slice(0, 5).map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {a.avatar}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">₵{"*".repeat(4)}</p>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link Generator */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">Link Generator</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Commission (50%)</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">₵{p.price}</td>
                      <td className="px-6 py-4 font-semibold text-success">₵{(p.price * 0.5).toFixed(0)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="outline" className="rounded-full gap-1.5" onClick={() => copyLink(p.id)}>
                          {copiedId === p.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedId === p.id ? "Copied" : "Copy Link"}
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
