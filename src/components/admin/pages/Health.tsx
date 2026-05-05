import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { CheckCircle2, XCircle, AlertCircle, Database, CreditCard, Server } from "lucide-react";

interface Check { name: string; status: "ok" | "warn" | "down"; detail: string; icon: any; }

const Health = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const next: Check[] = [];
      const t0 = performance.now();
      const { error: dbErr } = await supabase.from("profiles").select("id").limit(1);
      const dbMs = Math.round(performance.now() - t0);
      next.push({
        name: "Database", icon: Database,
        status: dbErr ? "down" : dbMs > 1000 ? "warn" : "ok",
        detail: dbErr ? dbErr.message : `${dbMs}ms response time`,
      });

      const t1 = performance.now();
      try {
        const r = await fetch("https://api.korapay.com/", { mode: "no-cors" });
        const ms = Math.round(performance.now() - t1);
        next.push({ name: "Korapay Gateway", icon: CreditCard, status: "ok", detail: `Reachable (${ms}ms)` });
      } catch {
        next.push({ name: "Korapay Gateway", icon: CreditCard, status: "warn", detail: "Could not reach (CORS-blocked is normal)" });
      }

      const { count } = await supabase.from("activity_events").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString());
      next.push({ name: "Edge Functions / Activity", icon: Server, status: (count ?? 0) > 0 ? "ok" : "warn", detail: `${count ?? 0} events in last 24h` });

      setChecks(next);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Platform Health" description="Live status of core dependencies." />
      <div className="grid md:grid-cols-3 gap-4">
        {loading && <div className="text-sm text-muted-foreground">Running checks…</div>}
        {checks.map((c) => {
          const Icon = c.icon;
          const StatusIcon = c.status === "ok" ? CheckCircle2 : c.status === "warn" ? AlertCircle : XCircle;
          const color = c.status === "ok" ? "text-emerald-500" : c.status === "warn" ? "text-amber-500" : "text-destructive";
          return (
            <div key={c.name} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                <StatusIcon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Health;
