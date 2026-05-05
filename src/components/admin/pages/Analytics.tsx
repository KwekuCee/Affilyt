import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const RANGES = [
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
  { id: "90d", label: "90 days", days: 90 },
];

const Analytics = () => {
  const [range, setRange] = useState("30d");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const load = async () => {
    const days = RANGES.find((r) => r.id === range)?.days ?? 30;
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const [{ data: o }, { data: u }] = await Promise.all([
      supabase.from("orders").select("amount, platform_fee, commission_amount, created_at").gte("created_at", since),
      supabase.from("profiles").select("created_at").gte("created_at", since),
    ]);
    setOrders(o || []);
    setUsers(u || []);
  };
  useEffect(() => { load(); }, [range]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
    const fees = orders.reduce((s, o) => s + Number(o.platform_fee || 0), 0);
    const commissions = orders.reduce((s, o) => s + Number(o.commission_amount || 0), 0);
    return { revenue, fees, commissions, orderCount: orders.length, signups: users.length };
  }, [orders, users]);

  const series = useMemo(() => {
    const days = RANGES.find((r) => r.id === range)?.days ?? 30;
    const buckets: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      buckets[d] = { date: d.slice(5), revenue: 0, orders: 0 };
    }
    orders.forEach((o) => {
      const d = o.created_at.slice(0, 10);
      if (buckets[d]) {
        buckets[d].revenue += Number(o.amount || 0);
        buckets[d].orders += 1;
      }
    });
    return Object.values(buckets);
  }, [orders, range]);

  const exportCSV = () => {
    const headers = ["date", "amount", "platform_fee", "commission_amount"];
    const rows = orders.map((o) => [o.created_at, o.amount, o.platform_fee || 0, o.commission_amount || 0]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `revenue-${range}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign },
    { label: "Platform fees", value: `$${stats.fees.toFixed(2)}`, icon: TrendingUp },
    { label: "Commissions paid", value: `$${stats.commissions.toFixed(2)}`, icon: TrendingUp },
    { label: "Orders", value: String(stats.orderCount), icon: ShoppingBag },
    { label: "New signups", value: String(stats.signups), icon: Users },
  ];

  return (
    <div>
      <PageHeader
        title="Revenue Analytics"
        description="Track sales, fees and commissions over time."
        actions={
          <div className="flex gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
              {RANGES.map((r) => (
                <button key={r.id} onClick={() => setRange(r.id)} className={`px-3 py-1.5 text-xs font-medium ${range === r.id ? "bg-primary text-primary-foreground" : "glass-subtle hover:bg-muted"}`}>{r.label}</button>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" /> CSV</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border glass-subtle p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</p>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold tabular">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border glass-subtle p-5">
        <h3 className="text-sm font-semibold mb-4">Revenue trend</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
