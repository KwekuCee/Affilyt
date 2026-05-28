import { useEffect, useState } from "react";
import { DollarSign, Users, Store, Package, TrendingUp, Wallet, AlertCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/StatsCard";

interface Stats {
  revenue: number;
  platformFees: number;
  affiliates: number;
  sellers: number;
  products: number;
  orders: number;
  pendingWithdrawals: number;
  pendingProducts: number;
}

const Overview = () => {
  const [stats, setStats] = useState<Stats>({
    revenue: 0, platformFees: 0, affiliates: 0, sellers: 0,
    products: 0, orders: 0, pendingWithdrawals: 0, pendingProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: viewStats, error } = await (supabase.from("admin_platform_stats" as any) as any).select("*").single();
      const { data: recent } = await supabase.from("orders").select("id, buyer_email, amount, created_at, status").order("created_at", { ascending: false }).limit(5);

      if (viewStats) {
        setStats({
          revenue: viewStats.gmv || 0,
          platformFees: viewStats.total_platform_fees || 0,
          affiliates: viewStats.total_affiliates || 0,
          sellers: viewStats.total_vendors || 0,
          products: viewStats.total_products || 0,
          orders: viewStats.total_orders || 0,
          pendingWithdrawals: viewStats.pending_withdrawals || 0,
          pendingProducts: viewStats.pending_approvals || 0,
        });
      }
      setRecentOrders(recent || []);
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Overview" description="Snapshot of your platform's performance." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="GMV" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} subtitle="All-time gross sales" />
        <StatsCard title="Platform Fees" value={`$${stats.platformFees.toLocaleString()}`} icon={TrendingUp} subtitle="10% from sellers" />
        <StatsCard title="Affiliates" value={stats.affiliates.toString()} icon={Users} subtitle="Paid members" />
        <StatsCard title="Vendors" value={stats.sellers.toString()} icon={Store} subtitle="Active subscriptions" />
        <StatsCard title="Products" value={stats.products.toString()} icon={Package} />
        <StatsCard title="Orders" value={stats.orders.toString()} icon={FileText} />
        <StatsCard title="Pending Payouts" value={stats.pendingWithdrawals.toString()} icon={Wallet} />
        <StatsCard title="Pending Approvals" value={stats.pendingProducts.toString()} icon={AlertCircle} />
      </div>

      <div className="rounded-lg border border-border glass-subtle">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Recent Orders</h2>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No orders yet.</div>
          )}
          {recentOrders.map((o) => (
            <div key={o.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{o.buyer_email}</div>
                <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">${Number(o.amount).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground capitalize">{o.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
