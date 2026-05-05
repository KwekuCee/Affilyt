import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { logAudit } from "@/lib/audit";

const empty = { code: "", description: "", discount_type: "percent", discount_value: "10", applies_to: "all", max_uses: "", expires_at: "" };

const Coupons = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const generate = () => {
    const code = "AFF" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setForm({ ...form, code });
  };

  const save = async () => {
    if (!form.code || !form.discount_value) return toast({ title: "Code and value required", variant: "destructive" });
    const payload: any = {
      code: form.code.toUpperCase(),
      description: form.description,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      applies_to: form.applies_to,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
    };
    const { error } = await supabase.from("coupons").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await logAudit("create_coupon", "coupon", form.code);
    toast({ title: "Coupon created" });
    setForm({ ...empty });
    setShowForm(false);
    load();
  };

  const remove = async (id: string, code: string) => {
    if (!confirm("Delete coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    await logAudit("delete_coupon", "coupon", code);
    load();
  };

  const toggle = async (c: any) => {
    await supabase.from("coupons").update({ is_active: !c.is_active }).eq("id", c.id);
    await logAudit("toggle_coupon", "coupon", c.code, { active: !c.is_active });
    load();
  };

  return (
    <div>
      <PageHeader title="Coupons" description="Site-wide discount codes for plans and products." actions={
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />{showForm ? "Cancel" : "New coupon"}</Button>
      } />
      {showForm && (
        <div className="rounded-lg border border-border glass-subtle p-5 mb-6 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium">Code</label>
              <div className="flex gap-2"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SAVE20" /><Button type="button" variant="outline" size="sm" onClick={generate}>Auto</Button></div>
            </div>
            <div><label className="text-xs font-medium">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
                <option value="percent">Percent (%)</option><option value="fixed">Fixed (USD)</option>
              </select></div>
            <div><label className="text-xs font-medium">Value</label><Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div><label className="text-xs font-medium">Applies to</label>
              <select value={form.applies_to} onChange={(e) => setForm({ ...form, applies_to: e.target.value })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
                <option value="all">All</option><option value="plans">Affiliate plans</option><option value="seller_plan">Seller plan</option><option value="products">Products</option>
              </select></div>
            <div><label className="text-xs font-medium">Max uses (optional)</label><Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} /></div>
            <div><label className="text-xs font-medium">Expires (optional)</label><Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
          </div>
          <div><label className="text-xs font-medium">Description</label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <Button onClick={save} className="w-full">Create coupon</Button>
        </div>
      )}
      <div className="rounded-lg border border-border glass-subtle overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left px-4 py-3">Code</th><th className="text-left px-4 py-3">Discount</th><th className="text-left px-4 py-3">Applies</th><th className="text-left px-4 py-3">Used</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && <tr><td colSpan={6} className="text-center text-muted-foreground py-12">No coupons.</td></tr>}
            {items.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.discount_type === "percent" ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                <td className="px-4 py-3 text-xs"><Badge variant="outline">{c.applies_to}</Badge></td>
                <td className="px-4 py-3 text-xs">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                <td className="px-4 py-3"><button onClick={() => toggle(c)}><Badge variant={c.is_active ? "default" : "secondary"}>{c.is_active ? "Active" : "Inactive"}</Badge></button></td>
                <td className="px-4 py-3 text-right"><Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(c.id, c.code)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
