import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Eye, MousePointerClick, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const stages = [
  { key: "clicks", label: "Clicks", icon: MousePointerClick, color: "bg-blue-500" },
  { key: "views", label: "Page Views", icon: Eye, color: "bg-indigo-500" },
  { key: "addToCart", label: "Add to Cart", icon: ShoppingCart, color: "bg-amber-500" },
  { key: "purchases", label: "Purchases", icon: CreditCard, color: "bg-primary" },
] as const;

interface FunnelData { clicks: number; views: number; addToCart: number; purchases: number }

const ConversionFunnel = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<{ id: string; title: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [data, setData] = useState<FunnelData>({ clicks: 0, views: 0, addToCart: 0, purchases: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: links } = await supabase.from("affiliate_links").select("product_id, products(id, title)").eq("affiliate_id", user.id);
      const uniq: Record<string, { id: string; title: string }> = {};
      (links || []).forEach((l: any) => { if (l.products) uniq[l.products.id] = l.products; });
      setProducts(Object.values(uniq));
    })();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    (async () => {
      let clicksQ = supabase.from("link_clicks").select("id, product_id, converted", { count: "exact" }).eq("affiliate_id", user.id);
      let ordersQ = supabase.from("orders").select("id", { count: "exact", head: true }).eq("affiliate_id", user.id).eq("status", "completed");
      let eventsQ = supabase.from("funnel_events").select("event_type, product_id").eq("affiliate_id", user.id);
      if (selectedProduct !== "all") {
        clicksQ = clicksQ.eq("product_id", selectedProduct);
        ordersQ = ordersQ.eq("product_id", selectedProduct);
        eventsQ = eventsQ.eq("product_id", selectedProduct);
      }
      const [{ count: clickCount }, { count: orderCount }, { data: events }] = await Promise.all([clicksQ, ordersQ, eventsQ]);
      const views = (events || []).filter((e: any) => e.event_type === "view").length;
      const cart = (events || []).filter((e: any) => e.event_type === "add_to_cart").length;
      setData({ clicks: clickCount || 0, views, addToCart: cart, purchases: orderCount || 0 });
      setLoading(false);
    })();
  }, [user, selectedProduct]);

  const maxVal = Math.max(data.clicks, 1);
  const convRate = (from: number, to: number) => from > 0 ? ((to / from) * 100).toFixed(1) : "0";
  const chartData = stages.map(s => ({ name: s.label, value: data[s.key] }));
  const isEmpty = data.clicks + data.views + data.addToCart + data.purchases === 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Conversion Funnel</h2>
          <p className="text-sm text-muted-foreground mt-1">Real clicks → views → cart → purchases from your links.</p>
        </div>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="h-10 rounded-xl bg-secondary border-none font-medium px-4 text-sm text-foreground">
          <option value="all">All Products</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl glass text-center text-sm text-muted-foreground">Loading…</div>
      ) : isEmpty ? (
        <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center text-sm text-muted-foreground">
          No funnel data yet. Share your links to record clicks and conversions.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {stages.map((stage, i) => {
              const value = data[stage.key];
              const pct = (value / maxVal) * 100;
              const prevValue = i > 0 ? data[stages[i - 1].key] : null;
              const Icon = stage.icon;
              return (
                <div key={stage.key} className="relative">
                  {i > 0 && (
                    <div className="flex items-center justify-center h-6 -mt-1.5 -mb-1.5 relative z-10">
                      <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2">{convRate(prevValue!, value)}% ↓</span>
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
                        <div className={`h-full rounded-full ${stage.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl glass-subtle"><p className="text-[10px] font-medium text-muted-foreground uppercase">Overall CVR</p><p className="text-xl font-bold text-primary">{convRate(data.clicks, data.purchases)}%</p></div>
                <div className="p-3 rounded-xl glass-subtle"><p className="text-[10px] font-medium text-muted-foreground uppercase">Cart → Purchase</p><p className="text-xl font-bold text-foreground">{convRate(data.addToCart, data.purchases)}%</p></div>
                <div className="p-3 rounded-xl glass-subtle"><p className="text-[10px] font-medium text-muted-foreground uppercase">View → Cart</p><p className="text-xl font-bold text-foreground">{convRate(data.views, data.addToCart)}%</p></div>
                <div className="p-3 rounded-xl glass-subtle"><p className="text-[10px] font-medium text-muted-foreground uppercase">Click → View</p><p className="text-xl font-bold text-foreground">{convRate(data.clicks, data.views)}%</p></div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl glass">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Visualization</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversionFunnel;
