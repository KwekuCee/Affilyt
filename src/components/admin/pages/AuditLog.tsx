import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AuditLog = () => {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => setItems(data || []));
  }, []);

  const filtered = items.filter((i) => !q || JSON.stringify(i).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Audit Log" description="Every administrative action, timestamped." />
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search action, target, admin…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
      </div>
      <div className="rounded-lg border border-border glass-subtle divide-y divide-border">
        {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground text-sm">No audit entries.</div>}
        {filtered.map((e) => (
          <div key={e.id} className="flex items-start gap-3 p-4 hover:bg-muted/30">
            <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center"><ShieldCheck className="h-4 w-4" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm"><span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{e.action}</span>
                {e.target_type && <span className="text-muted-foreground text-xs ml-2">on {e.target_type}{e.target_id && ` ${e.target_id.slice(0, 8)}`}</span>}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{e.admin_email || e.admin_id?.slice(0, 8)} · {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}</p>
              {e.details && Object.keys(e.details).length > 0 && (
                <pre className="text-[10px] mt-1 bg-muted/50 rounded px-2 py-1 overflow-x-auto">{JSON.stringify(e.details, null, 2)}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLog;
