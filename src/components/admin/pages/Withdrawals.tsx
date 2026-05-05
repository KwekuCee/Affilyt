import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Withdrawals = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [tab, setTab] = useState<"affiliate" | "seller">("affiliate");
  const { toast } = useToast();

  const load = async () => {
    if (tab === "affiliate") {
      const { data } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });
      setRows(data || []);
    } else {
      const { data } = await supabase
        .from("seller_payouts")
        .select("*")
        .order("created_at", { ascending: false });
      setRows(data || []);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const setStatus = async (id: string, status: string) => {
    const table = tab === "affiliate" ? "withdrawals" : "seller_payouts";
    const update: any = { status };
    if (status === "completed") update.processed_at = new Date().toISOString();
    const { error } = await supabase.from(table).update(update).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Marked ${status}` }); load(); }
  };

  return (
    <div>
      <PageHeader title="Withdrawals" description="Approve or reject payout requests." />

      <div className="flex gap-1 mb-4">
        {(["affiliate", "seller"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {t} payouts
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border glass-subtle overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              {tab === "affiliate" && <th className="text-left px-4 py-3 font-medium">Method</th>}
              {tab === "affiliate" && <th className="text-left px-4 py-3 font-medium">Account</th>}
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Requested</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No payouts.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{(r.affiliate_id || r.seller_id || "").slice(0, 8)}…</td>
                <td className="px-4 py-3 font-semibold">${Number(r.amount).toFixed(2)}</td>
                {tab === "affiliate" && <td className="px-4 py-3">{r.method || "—"}</td>}
                {tab === "affiliate" && (
                  <td className="px-4 py-3 text-xs">
                    <div>{r.account_name}</div>
                    <div className="text-muted-foreground">{r.account_number}</div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <Badge variant={r.status === "completed" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {r.status === "pending" && (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" className="h-8 text-emerald-600" onClick={() => setStatus(r.id, "completed")}>Approve</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Withdrawals;
