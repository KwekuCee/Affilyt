import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { logAudit } from "@/lib/audit";

const Refunds = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ order_id: "", amount: "", reason: "", reverse_commission: true });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("refunds").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.order_id || !form.amount) return toast({ title: "Order ID and amount required", variant: "destructive" });
    const { error } = await supabase.from("refunds").insert({ order_id: form.order_id, amount: Number(form.amount), reason: form.reason, reverse_commission: form.reverse_commission });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await logAudit("create_refund", "order", form.order_id, { amount: form.amount });
    toast({ title: "Refund logged" });
    setForm({ order_id: "", amount: "", reason: "", reverse_commission: true });
    setShowForm(false);
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("refunds").update({ status, processed_by: user?.id, processed_at: new Date().toISOString() }).eq("id", id);
    await logAudit(`refund_${status}`, "refund", id);
    toast({ title: `Marked ${status}` });
    load();
  };

  return (
    <div>
      <PageHeader title="Refunds" description="Process refund requests and reverse affiliate commissions." actions={
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />New refund</Button>
      } />
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-5 mb-6 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Order ID</label><Input value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })} placeholder="UUID" /></div>
            <div><label className="text-xs font-medium">Amount (USD)</label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          </div>
          <div><label className="text-xs font-medium">Reason</label><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.reverse_commission} onChange={(e) => setForm({ ...form, reverse_commission: e.target.checked })} />Reverse affiliate commission</label>
          <Button onClick={create} className="w-full">Log refund</Button>
        </div>
      )}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left px-4 py-3">Order</th><th className="text-left px-4 py-3">Amount</th><th className="text-left px-4 py-3">Reason</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-12">No refunds.</td></tr>}
            {items.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs">{r.order_id.slice(0, 8)}</td>
                <td className="px-4 py-3 font-medium">${Number(r.amount).toFixed(2)}</td>
                <td className="px-4 py-3 text-xs line-clamp-1 max-w-xs">{r.reason || "—"}</td>
                <td className="px-4 py-3"><Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  {r.status === "pending" && (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
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

export default Refunds;
