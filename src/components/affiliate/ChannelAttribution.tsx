import { useEffect, useMemo, useState } from "react";
import { Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const PLATFORMS: Record<string, { name: string; short: string; emoji: string; color: string }> = {
  instagram: { name: "Instagram", short: "IG", emoji: "📸", color: "#E1306C" },
  tiktok: { name: "TikTok", short: "TT", emoji: "🎵", color: "#010101" },
  whatsapp: { name: "WhatsApp", short: "WA", emoji: "💬", color: "#25D366" },
  twitter: { name: "Twitter/X", short: "X", emoji: "🐦", color: "#1DA1F2" },
  youtube: { name: "YouTube", short: "YT", emoji: "▶️", color: "#FF0000" },
  facebook: { name: "Facebook", short: "FB", emoji: "👍", color: "#4267B2" },
  other: { name: "Other", short: "OT", emoji: "🌐", color: "#64748b" },
};

const detectChannel = (row: any): string => {
  const src = (row.utm_source || row.channel || row.referrer || "").toString().toLowerCase();
  for (const k of Object.keys(PLATFORMS)) if (src.includes(k) || src.includes(PLATFORMS[k].short.toLowerCase())) return k;
  if (src.includes("ig")) return "instagram";
  if (src.includes("yt")) return "youtube";
  if (src.includes("fb")) return "facebook";
  return "other";
};

const metrics = ["clicks", "conversions", "revenue"] as const;
type Metric = typeof metrics[number];

const ChannelAttribution = () => {
  const { user } = useAuth();
  const [activeMetric, setActiveMetric] = useState<Metric>("revenue");
  const [rows, setRows] = useState<{ key: string; clicks: number; conversions: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data: clicks } = await supabase.from("link_clicks").select("*").eq("affiliate_id", user.id);
      const { data: orders } = await supabase.from("orders").select("id, amount, affiliate_link_id, status").eq("affiliate_id", user.id).eq("status", "completed");

      const byChannel: Record<string, { clicks: number; conversions: number; revenue: number }> = {};
      const linkChannel: Record<string, string> = {};
      (clicks || []).forEach((c: any) => {
        const ch = detectChannel(c);
        linkChannel[c.link_id] = ch;
        if (!byChannel[ch]) byChannel[ch] = { clicks: 0, conversions: 0, revenue: 0 };
        byChannel[ch].clicks += 1;
        if (c.converted) byChannel[ch].conversions += 1;
      });
      (orders || []).forEach((o: any) => {
        const ch = linkChannel[o.affiliate_link_id] || "other";
        if (!byChannel[ch]) byChannel[ch] = { clicks: 0, conversions: 0, revenue: 0 };
        byChannel[ch].revenue += Number(o.amount || 0);
      });

      setRows(Object.entries(byChannel).map(([key, v]) => ({ key, ...v })));
      setLoading(false);
    })();
  }, [user]);

  const totalMetric = rows.reduce((s, r) => s + r[activeMetric], 0);
  const bestRow = [...rows].sort((a, b) => b[activeMetric] - a[activeMetric])[0];
  const best = bestRow ? PLATFORMS[bestRow.key] || PLATFORMS.other : null;

  const chartData = rows.map(r => ({ name: PLATFORMS[r.key]?.short || r.key, [activeMetric]: r[activeMetric], fill: PLATFORMS[r.key]?.color || "#64748b" }));
  const pieData = rows.map(r => ({ name: PLATFORMS[r.key]?.name || r.key, value: r[activeMetric], color: PLATFORMS[r.key]?.color || "#64748b" }));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Channel Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Real click sources from your smart links (utm_source).</p>
      </div>

      <div className="flex gap-2">
        {metrics.map(m => (
          <button key={m} onClick={() => setActiveMetric(m)} className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeMetric === m ? "bg-primary text-primary-foreground" : "glass-subtle"}`}>{m}</button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 rounded-2xl glass text-center text-sm text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="p-12 rounded-2xl glass-subtle border-2 border-dashed border-border text-center">
          <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-sm text-muted-foreground">No channel data yet. Add a <span className="font-mono">utm_source</span> (e.g. tiktok, instagram) to your smart links to track sources.</p>
        </div>
      ) : (
        <>
          {best && (
            <div className="p-5 sm:p-6 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden" style={{ backgroundColor: `${best.color}08` }}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${best.color}15` }}>{best.emoji}</div>
                <div>
                  <div className="flex items-center gap-2"><Award className="h-4 w-4 text-amber-400" /><p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">Best Performing</p></div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{best.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeMetric === "revenue" && `$${bestRow.revenue.toLocaleString()}`}
                    {activeMetric === "clicks" && `${bestRow.clicks.toLocaleString()} clicks`}
                    {activeMetric === "conversions" && `${bestRow.conversions} conversions`}
                    {totalMetric > 0 && ` — ${((bestRow[activeMetric] / totalMetric) * 100).toFixed(1)}% of total`}
                  </p>
                </div>
              </div>
            </div>
          )}

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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {rows.map(r => {
              const p = PLATFORMS[r.key] || PLATFORMS.other;
              const cvr = r.clicks > 0 ? ((r.conversions / r.clicks) * 100).toFixed(1) : "0";
              return (
                <div key={r.key} className="p-4 rounded-2xl border text-center glass-subtle">
                  <span className="text-2xl mb-2 block">{p.emoji}</span>
                  <p className="font-semibold text-xs text-foreground">{p.short}</p>
                  <p className="text-base font-bold text-foreground mt-1">${r.revenue.toLocaleString()}</p>
                  <p className="text-[9px] text-muted-foreground">{r.conversions} sales</p>
                  <Badge variant="secondary" className="mt-1.5 text-[9px]">{cvr}% CVR</Badge>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelAttribution;
