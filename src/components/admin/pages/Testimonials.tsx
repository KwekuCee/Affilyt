import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Star } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const empty = { name: "", role: "", content: "", image_url: "", rating: 5, is_active: true };

const Testimonials = () => {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.content) {
      toast({ title: "Name & content required", variant: "destructive" });
      return;
    }
    const payload = { ...form, rating: Number(form.rating) };
    const res = editId
      ? await supabase.from("testimonials").update(payload).eq("id", editId)
      : await supabase.from("testimonials").insert(payload);
    if (res.error) return toast({ title: "Error", description: res.error.message, variant: "destructive" });
    toast({ title: editId ? "Updated" : "Published" });
    setForm({ ...empty });
    setShow(false);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  const startEdit = (t: any) => {
    setForm({ name: t.name, role: t.role, content: t.content, image_url: t.image_url || "", rating: t.rating, is_active: t.is_active });
    setEditId(t.id);
    setShow(true);
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="These appear on the landing page."
        actions={
          <Button size="sm" onClick={() => { setEditId(null); setForm({ ...empty }); setShow(!show); }}>
            <Plus className="h-4 w-4 mr-1" /> {show ? "Cancel" : "New testimonial"}
          </Button>
        }
      />

      {show && (
        <div className="rounded-lg border border-border bg-card p-5 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <ImageUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="testimonials" label="Avatar" />
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-9" />
              </div>
              <div>
                <label className="text-xs font-medium">Role / Title</label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-9" />
              </div>
              <div>
                <label className="text-xs font-medium">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="h-9 w-full px-2 rounded-md border border-border bg-background text-sm">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Quote</label>
            <Textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Visible on landing page
          </label>
          <Button onClick={save} className="w-full">{editId ? "Save changes" : "Publish"}</Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && (
          <div className="md:col-span-2 rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No testimonials yet.
          </div>
        )}
        {items.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {!t.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(t)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <p className="text-sm text-foreground mb-4 italic">"{t.content}"</p>
            <div className="flex items-center gap-3">
              {t.image_url ? (
                <img src={t.image_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-muted" />
              )}
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
