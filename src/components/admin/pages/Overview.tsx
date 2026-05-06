import { useEffect, useState } from "react";
import { DollarSign, Users, Store, Package, TrendingUp, Wallet, AlertCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";

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

const StatCard = ({ icon: Icon, label, value, hint, accent }: any) => (
  <div className="rounded-lg border border-border glass-subtle p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className={`h-8 w-8 rounded-md flex items-center justify-center ${accent || "bg-primary/10 text-primary"}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
    {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
  </div>
);

const Overview = () => {
  const [stats, setStats] = useState<Stats>({
    revenue: 0, platformFees: 0, affiliates: 0, sellers: 0,
    products: 0, orders: 0, pendingWithdrawals: 0, pendingProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [orders, affiliates, sellers, products, withdrawals, pendingProds, recent] = await Promise.all([
        supabase.from("orders").select("amount, platform_fee"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).not("package_tier", "is", null),
        supabase.from("seller_subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("withdrawals").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase.from("orders").select("id, buyer_email, amount, created_at, status").order("created_at", { ascending: false }).limit(5),
      ]);

      const revenue = (orders.data || []).reduce((s: number, o: any) => s + Number(o.amount || 0), 0);
      const platformFees = (orders.data || []).reduce((s: number, o: any) => s + Number(o.platform_fee || 0), 0);

      setStats({
        revenue,
        platformFees,
        affiliates: affiliates.count || 0,
        sellers: sellers.count || 0,
        products: products.count || 0,
        orders: (orders.data || []).length,
        pendingWithdrawals: withdrawals.count || 0,
        pendingProducts: pendingProds.count || 0,
      });
      setRecentOrders(recent.data || []);
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Overview" description="Snapshot of your platform's performance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="GMV" value={`$${stats.revenue.toLocaleString()}`} hint="All-time gross sales" />
        <StatCard icon={TrendingUp} label="Platform Fees" value={`$${stats.platformFees.toLocaleString()}`} hint="10% from sellers" accent="bg-emerald-500/10 text-emerald-600" />
        <StatCard icon={Users} label="Affiliates" value={stats.affiliates} hint="Paid members" />
        <StatCard icon={Store} label="Vendors" value={stats.sellers} hint="Active subscriptions" />
        <StatCard icon={Package} label="Products" value={stats.products} />
        <StatCard icon={FileText} label="Orders" value={stats.orders} />
        <StatCard icon={Wallet} label="Pending Payouts" value={stats.pendingWithdrawals} accent="bg-amber-500/10 text-amber-600" />
        <StatCard icon={AlertCircle} label="Pending Approvals" value={stats.pendingProducts} accent="bg-amber-500/10 text-amber-600" />
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
