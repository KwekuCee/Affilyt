import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { logAudit } from "@/lib/audit";
import { Search } from "lucide-react";

const TIERS = ["Basic", "Standard", "Pro"];

const Tiers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const [{ data: profs }, { data: hist }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, package_tier, created_at").not("package_tier", "is", null).order("created_at", { ascending: false }),
      supabase.from("tier_history").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setUsers(profs || []);
    setHistory(hist || []);
  };
  useEffect(() => { load(); }, []);

  const change = async (u: any, to: string) => {
    if (u.package_tier === to) return;
    const { error } = await supabase.from("profiles").update({ package_tier: to }).eq("user_id", u.user_id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await supabase.from("tier_history").insert({ user_id: u.user_id, from_tier: u.package_tier, to_tier: to, reason: "Admin manual change" });
    await logAudit("tier_change", "user", u.user_id, { from: u.package_tier, to });
    toast({ title: `Tier set to ${to}` });
    load();
  };

  const filtered = users.filter((u) => !q || (u.full_name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Affiliate Tier Management" description="Manually upgrade or downgrade affiliate package tier." />
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search affiliates…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
      </div>
      <div className="rounded-lg border border-border glass-subtle overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left px-4 py-3">Affiliate</th><th className="text-left px-4 py-3">Current tier</th><th className="text-right px-4 py-3">Set tier</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && <tr><td colSpan={3} className="text-center text-muted-foreground py-12">No affiliates found.</td></tr>}
            {filtered.map((u) => (
              <tr key={u.user_id}>
                <td className="px-4 py-3 font-medium">{u.full_name || u.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3"><Badge variant="secondary">{u.package_tier || "—"}</Badge></td>
                <td className="px-4 py-3"><div className="flex gap-1 justify-end">{TIERS.map((t) => (
                  <Button key={t} size="sm" variant={u.package_tier === t ? "default" : "outline"} onClick={() => change(u, t)}>{t}</Button>
                ))}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="text-sm font-semibold mb-3">Recent tier changes</h3>
      <div className="rounded-lg border border-border glass-subtle divide-y divide-border">
        {history.length === 0 && <div className="p-6 text-center text-muted-foreground text-sm">No changes yet.</div>}
        {history.map((h) => (
          <div key={h.id} className="flex items-center justify-between p-4 text-sm">
            <span><span className="font-mono text-xs text-muted-foreground">{h.user_id.slice(0, 8)}</span> · {h.from_tier || "—"} → <span className="font-semibold">{h.to_tier}</span></span>
            <span className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tiers;
