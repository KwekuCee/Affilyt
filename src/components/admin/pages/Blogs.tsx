import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const empty = { title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true };

const Blogs = () => {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.author) return toast({ title: "Title & author required", variant: "destructive" });
    const res = editId
      ? await supabase.from("blog_posts").update(form).eq("id", editId)
      : await supabase.from("blog_posts").insert(form);
    if (res.error) return toast({ title: "Error", description: res.error.message, variant: "destructive" });
    toast({ title: editId ? "Updated" : "Published" });
    setForm({ ...empty });
    setShow(false);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  const startEdit = (b: any) => {
    setForm({
      title: b.title, excerpt: b.excerpt || "", content: b.content || "",
      author: b.author, category: b.category || "General", image_url: b.image_url || "",
      is_published: b.is_published,
    });
    setEditId(b.id);
    setShow(true);
  };

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        description="Published posts appear on the landing page."
        actions={
          <Button size="sm" onClick={() => { setEditId(null); setForm({ ...empty }); setShow(!show); }}>
            <Plus className="h-4 w-4 mr-1" /> {show ? "Cancel" : "New post"}
          </Button>
        }
      />

      {show && (
        <div className="rounded-lg border border-border glass-subtle p-5 mb-6 space-y-4">
          <ImageUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="blogs" label="Cover image" />
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium">Author</label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="h-9" />
            </div>
            <div>
              <label className="text-xs font-medium">Category</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                Publish on landing page
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium">Excerpt</label>
            <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="h-9" />
          </div>
          <div>
            <label className="text-xs font-medium">Content</label>
            <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <Button onClick={save} className="w-full">{editId ? "Save changes" : "Publish post"}</Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="md:col-span-3 rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No blog posts yet.
          </div>
        )}
        {items.map((b) => (
          <div key={b.id} className="rounded-lg border border-border glass-subtle overflow-hidden">
            <div className="aspect-video bg-muted">
              {b.image_url && <img src={b.image_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{b.category}</Badge>
                {!b.is_published && <Badge variant="outline" className="text-[10px]">Draft</Badge>}
              </div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2">{b.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{b.excerpt}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-muted-foreground">By {b.author}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(b)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
