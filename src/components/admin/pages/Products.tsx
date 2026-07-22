import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Check, X, Star, Eye, EyeOff } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const empty = {
  title: "", description: "", price: "", category: "Courses",
  commission_rate: "50", min_tier: "Basic", image_url: "", approval_status: "approved",
  is_featured: false,
};

const Products = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.price) {
      toast({ title: "Title and price required", variant: "destructive" });
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      commission_rate: Number(form.commission_rate),
      min_tier: form.min_tier,
      image_url: form.image_url || null,
      approval_status: form.approval_status,
      is_featured: form.is_featured,
      status: "active",
    };
    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
      toast({ title: "Updated" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
      toast({ title: "Added" });
    }
    setForm({ ...empty });
    setShowForm(false);
    setEditingId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  const setStatus = async (id: string, status: string) => {
    await supabase.from("products").update({ approval_status: status }).eq("id", id);
    toast({ title: status === "approved" ? "Approved" : "Rejected" });
    load();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_featured: !current }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: !current ? "Featured" : "Unfeatured" });
    load();
  };

  const toggleVisibility = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    const { error } = await supabase.from("products").update({ status: next }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: next === "active" ? "Product is now visible" : "Product hidden from marketplace" });
    load();
  };

  const updateTier = async (id: string, min_tier: string) => {
    const { error } = await supabase.from("products").update({ min_tier }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: `Tier eligibility set to ${min_tier}` });
    load();
  };

  const startEdit = (p: any) => {
    setForm({
      title: p.title || "", description: p.description || "", price: String(p.price),
      category: p.category || "Courses", commission_rate: String(p.commission_rate),
      min_tier: p.min_tier || "Basic", image_url: p.image_url || "",
      approval_status: p.approval_status || "approved",
      is_featured: p.is_featured || false,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const filtered = items.filter((p) => filter === "all" || p.approval_status === filter);

  return (
    <div>
      <PageHeader
        title="Products"
        description="All products in the marketplace. Approve seller submissions or add platform products."
        actions={
          <Button size="sm" onClick={() => { setEditingId(null); setForm({ ...empty }); setShowForm(!showForm); }}>
            <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New product"}
          </Button>
        }
      />

      {showForm && (
        <div className="rounded-lg border border-border glass-subtle p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="products" label="Cover image" />
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-9" />
              </div>
              <div>
                <label className="text-xs font-medium">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs font-medium">Price (USD)</label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium">Commission %</label>
              <Input type="number" value={form.commission_rate} onChange={(e) => setForm({ ...form, commission_rate: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium">Category</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium">Min Tier</label>
              <select value={form.min_tier} onChange={(e) => setForm({ ...form, min_tier: e.target.value })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
                <option>Basic</option><option>Standard</option><option>Pro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium">Status</label>
              <select value={form.approval_status} onChange={(e) => setForm({ ...form, approval_status: e.target.value })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
                <option value="approved">Approved</option><option value="pending">Pending</option><option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="is_featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Feature this product on homepage
            </label>
          </div>
          <Button onClick={save} className="w-full">{editingId ? "Save changes" : "Create product"}</Button>
        </div>
      )}

      <div className="flex gap-1 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {f} {f !== "all" && `(${items.filter(i => i.approval_status === f).length})`}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border glass-subtle overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">Tier eligibility</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Commission</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-center px-4 py-3 font-medium">Visible</th>
              <th className="text-center px-4 py-3 font-medium">Featured</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No products.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted overflow-hidden shrink-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="font-medium line-clamp-1">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Select value={p.min_tier || "Basic"} onValueChange={(v) => updateTier(p.id, v)}>
                    <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 font-medium">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.commission_rate}%</td>
                <td className="px-4 py-3">
                  <Badge variant={p.approval_status === "approved" ? "default" : p.approval_status === "pending" ? "secondary" : "destructive"}>
                    {p.approval_status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 ${p.status === "active" ? "text-emerald-600" : "text-muted-foreground"}`}
                    onClick={() => toggleVisibility(p.id, p.status)}
                    title={p.status === "active" ? "Hide from marketplace" : "Show in marketplace"}
                  >
                    {p.status === "active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 ${p.is_featured ? 'text-amber-500' : 'text-muted-foreground'}`}
                    onClick={() => toggleFeatured(p.id, p.is_featured)}
                  >
                    <Star className={`h-4 w-4 ${p.is_featured ? 'fill-amber-500' : ''}`} />
                  </Button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    {p.approval_status !== "approved" && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => setStatus(p.id, "approved")}><Check className="h-4 w-4" /></Button>
                    )}
                    {p.approval_status !== "rejected" && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-600" onClick={() => setStatus(p.id, "rejected")}><X className="h-4 w-4" /></Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(p)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
