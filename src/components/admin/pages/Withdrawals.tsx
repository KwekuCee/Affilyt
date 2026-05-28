import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

const Withdrawals = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [tab, setTab] = useState<"affiliate" | "seller">("affiliate");
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
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

  const setStatus = async (id: string, status: string, adminNotes?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const table = tab === "affiliate" ? "withdrawals" : "seller_payouts";
    const update: any = {
      status,
      admin_notes: adminNotes,
      approved_by: user?.id
    };
    if (status === "completed") update.processed_at = new Date().toISOString();
    const { error } = await (supabase.from(table) as any).update(update).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: `Marked ${status}` });
      setOpen(false);
      load();
    }
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
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelected(r);
                        setNotes(r.admin_notes || "");
                        setOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {r.status === "pending" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 text-emerald-600" onClick={() => setStatus(r.id, "completed")}>Approve</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-destructive" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review Payout</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">User ID</p><p className="font-mono">{selected?.affiliate_id || selected?.seller_id}</p></div>
              <div><p className="text-muted-foreground">Amount</p><p className="font-bold">${selected?.amount}</p></div>
              {tab === "affiliate" && (
                <>
                  <div><p className="text-muted-foreground">Method</p><p className="uppercase">{selected?.method}</p></div>
                  <div><p className="text-muted-foreground">Account</p><p>{selected?.account_number}</p></div>
                </>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Admin Notes</label>
              <Input
                placeholder="Internal notes or reason for rejection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStatus(selected.id, 'rejected', notes)}>Reject</Button>
            <Button className="flex-1" onClick={() => setStatus(selected.id, 'completed', notes)}>Approve & Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdrawals;
