import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { logAudit } from "@/lib/audit";

const Moderation = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("products").select("*").eq("approval_status", "pending").not("seller_id", "is", null).order("created_at", { ascending: false });
    setItems(data || []);
    setSelected(new Set());
  };
  useEffect(() => { load(); }, []);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));

  const bulk = async (status: "approved" | "rejected") => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    if (status === "rejected" && !reason.trim()) { toast({ title: "Add a rejection reason", variant: "destructive" }); return; }
    const { error } = await supabase.from("products").update({ approval_status: status }).in("id", ids);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await logAudit(`bulk_${status}_products`, "products", ids.join(","), { count: ids.length, reason: status === "rejected" ? reason : null });
    toast({ title: `${ids.length} ${status}` });
    setReason("");
    load();
  };

  return (
    <div>
      <PageHeader title="Bulk Product Moderation" description="Review and approve/reject seller submissions in batch." actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={!selected.size} onClick={() => bulk("approved")}><Check className="h-4 w-4 mr-1" />Approve {selected.size || ""}</Button>
          <Button size="sm" variant="destructive" disabled={!selected.size} onClick={() => bulk("rejected")}><X className="h-4 w-4 mr-1" />Reject {selected.size || ""}</Button>
        </div>
      } />
      {selected.size > 0 && (
        <div className="mb-4">
          <Textarea placeholder="Rejection reason (required if rejecting)" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
        </div>
      )}
      <div className="rounded-lg border border-border glass-subtle overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 w-10"><input type="checkbox" checked={!!items.length && selected.size === items.length} onChange={toggleAll} /></th>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Seller</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-12">No pending submissions. 🎉</td></tr>}
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
                <td className="px-4 py-3"><div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">{p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}</div>
                  <div><div className="font-medium line-clamp-1">{p.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{p.description}</div></div>
                </div></td>
                <td className="px-4 py-3 text-xs"><Badge variant="outline">{p.business_name || p.seller_id?.slice(0, 8)}</Badge></td>
                <td className="px-4 py-3 font-medium">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Moderation;
