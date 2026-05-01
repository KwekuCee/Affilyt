import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, Users, ShieldCheck, Zap, Globe, Plus, Search, Eye, Trash2,
  LayoutDashboard, Store, CreditCard, Settings as SettingsIcon, FileText,
  MessageSquare, Star, Award, Trophy, Shield, Edit, RefreshCw
} from "lucide-react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import HelpAI from "@/components/HelpAI";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { supabase } from "@/integrations/supabase/client";

// --- Overview ---
const AdminHUD = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, affiliates: 0, products: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, productsRes, profilesRes] = await Promise.all([
        supabase.from("orders").select("amount", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }).not("package_tier", "is", null),
      ]);
      const revenue = (ordersRes.data || []).reduce((sum: number, o: any) => sum + Number(o.amount), 0);
      setStats({
        orders: ordersRes.count || 0,
        revenue,
        affiliates: profilesRes.count || 0,
        products: productsRes.count || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} trend="From all sales" />
        <StatsCard title="Active Affiliates" value={stats.affiliates.toString()} icon={Users} trend="Paid members" />
        <StatsCard title="Total Orders" value={stats.orders.toString()} icon={CreditCard} trend="Completed orders" />
        <StatsCard title="Products" value={stats.products.toString()} icon={Store} trend="Active listings" />
      </div>
    </div>
  );
};

// --- Products Management ---
const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "Courses",
    commission_rate: "50", min_tier: "Basic", image_url: ""
  });
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async () => {
    const payload = {
      title: form.title, description: form.description, price: Number(form.price),
      category: form.category, commission_rate: Number(form.commission_rate),
      min_tier: form.min_tier, image_url: form.image_url || null, status: "active",
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product Updated!" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product Added to Marketplace!" });
    }

    setForm({ title: "", description: "", price: "", category: "Courses", commission_rate: "50", min_tier: "Basic", image_url: "" });
    setShowForm(false);
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product Deleted" });
    fetchProducts();
  };

  const startEdit = (p: any) => {
    setForm({
      title: p.title, description: p.description || "", price: p.price.toString(),
      category: p.category || "Courses", commission_rate: p.commission_rate.toString(),
      min_tier: p.min_tier || "Basic", image_url: p.image_url || ""
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Marketplace Inventory</h2>
          <p className="text-muted-foreground font-medium">Control the products available for affiliates to promote.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", description: "", price: "", category: "Courses", commission_rate: "50", min_tier: "Basic", image_url: "" }); }} className="rounded-2xl font-black text-sm uppercase py-6 px-8 shadow-xl shadow-primary/20">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> Add Product</>}
        </Button>
      </div>

      {showForm && (
        <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Product Name</label>
              <Input placeholder="Mastering High-Ticket Sales" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Price (USD)</label>
              <Input placeholder="99.00" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Product Description</label>
            <Textarea placeholder="What's included in this package?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-[2rem] bg-secondary/50 border-none p-8 font-medium min-h-[120px] text-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Category</label>
              <Input placeholder="Courses" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Commission %</label>
              <Input placeholder="50" type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Required Tier</label>
              <select value={form.min_tier} onChange={e => setForm({ ...form, min_tier: e.target.value })} className="h-16 w-full rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6 text-foreground text-sm uppercase">
                <option value="Basic">Basic Tier</option>
                <option value="Standard">Standard Tier</option>
                <option value="Pro">Pro Tier</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Image URL</label>
              <Input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
          </div>
          <Button onClick={handleAdd} className="h-16 w-full rounded-[1.5rem] font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20">
            {editingId ? "Update Product Data" : "Deploy Product"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="group rounded-[3rem] bg-card/30 backdrop-blur-sm border-2 border-border overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="h-48 w-full overflow-hidden relative">
              {p.image_url ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="h-full w-full bg-secondary flex items-center justify-center text-muted-foreground/20 italic font-black text-4xl uppercase">No Cover</div>}
              <div className="absolute top-6 right-6 flex gap-2">
                <Badge className="bg-primary/20 text-primary backdrop-blur-md border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {p.min_tier || "Basic"}
                </Badge>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{p.category}</span>
                <h3 className="text-2xl font-black text-foreground leading-tight line-clamp-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2 mt-2">{p.description}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-foreground tracking-tighter">${Number(p.price).toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-success uppercase">{p.commission_rate}% payout rate</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(p)} variant="secondary" size="icon" className="h-12 w-12 rounded-2xl"><Edit className="h-5 w-5" /></Button>
                  <Button onClick={() => handleDelete(p.id)} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-500/10"><Trash2 className="h-5 w-5" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-3 p-20 rounded-[3rem] bg-card/20 border-2 border-dashed border-border text-center">
            <Store className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-xl font-bold text-muted-foreground">Marketplace is empty. Start adding products.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Testimonials Management ---
const AdminTestimonials = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", content: "", image_url: "", rating: "5", is_active: true });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (editingId) {
      const { error } = await supabase.from("testimonials").update({ ...form, rating: Number(form.rating) }).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Testimonial Updated!" });
    } else {
      const { error } = await supabase.from("testimonials").insert({ ...form, rating: Number(form.rating) });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Testimonial Added!" });
    }
    setForm({ name: "", role: "", content: "", image_url: "", rating: "5", is_active: true });
    setShowForm(false);
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  const startEdit = (t: any) => {
    setForm({ name: t.name, role: t.role, content: t.content, image_url: t.image_url || "", rating: t.rating.toString(), is_active: t.is_active });
    setEditingId(t.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Testimonials</h2>
          <p className="text-muted-foreground font-medium">Manage social proof and success stories.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", role: "", content: "", image_url: "", rating: "5", is_active: true }); }} className="rounded-2xl font-black text-sm uppercase py-6 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> Add Story</>}
        </Button>
      </div>

      {showForm && (
        <div className="p-8 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Name</label>
              <Input placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6 focus:ring-2 ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Role / Title</label>
              <Input placeholder="Pro Affiliate" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6 focus:ring-2 ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Image URL</label>
              <Input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6 focus:ring-2 ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Rating (1-5)</label>
              <select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="h-16 w-full rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6 focus:ring-2 ring-primary text-foreground">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">The Story</label>
            <Textarea placeholder="How has our platform helped them?" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="rounded-[2rem] bg-secondary/50 border-none p-8 font-medium min-h-[150px] text-lg focus:ring-2 ring-primary" />
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleAdd} className="h-16 flex-1 rounded-[1.5rem] font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20">
              {editingId ? "Update Story" : "Publish Story"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map(t => (
          <div key={t.id} className="group p-8 rounded-[3rem] bg-card/30 backdrop-blur-sm border-2 border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button onClick={() => startEdit(t)} variant="secondary" size="icon" className="h-10 w-10 rounded-xl"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleDelete(t.id)} variant="destructive" size="icon" className="h-10 w-10 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <p className="text-xl font-medium text-foreground italic mb-8 leading-relaxed">"{t.content}"</p>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden border-2 border-primary/10">
                {t.image_url ? <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" /> : <Users className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div>
                <p className="font-black text-lg text-foreground tracking-tight">{t.name}</p>
                <p className="text-xs font-black uppercase text-primary tracking-widest">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 p-20 rounded-[3rem] bg-card/20 border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
            <Star className="h-16 w-16 text-muted-foreground/20 mb-6" />
            <p className="text-xl font-bold text-muted-foreground">No testimonials yet. Be the first to share a success story.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Blog Management ---
const AdminBlogs = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (editingId) {
      const { error } = await supabase.from("blog_posts").update(form).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Post Updated!" });
    } else {
      const { error } = await supabase.from("blog_posts").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Blog Post Published!" });
    }
    setForm({ title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true });
    setShowForm(false);
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  const startEdit = (b: any) => {
    setForm({ title: b.title, excerpt: b.excerpt || "", content: b.content || "", author: b.author, category: b.category || "General", image_url: b.image_url || "", is_published: b.is_published });
    setEditingId(b.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Library & Insights</h2>
          <p className="text-muted-foreground font-medium">Publish educational content and platform updates.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true }); }} className="rounded-2xl font-black text-sm uppercase py-6 px-8 shadow-xl shadow-primary/20">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> New Post</>}
        </Button>
      </div>

      {showForm && (
        <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Headline</label>
              <Input placeholder="The future of affiliate marketing..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Author</label>
              <Input placeholder="Admin Name" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Short Excerpt</label>
            <Input placeholder="A brief summary for the preview card..." value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Full Content</label>
            <Textarea placeholder="Write your masterpiece here..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="rounded-[2rem] bg-secondary/50 border-none p-8 font-medium min-h-[300px] text-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Category</label>
              <Input placeholder="Marketing, News, etc." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Cover Image URL</label>
              <Input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="flex items-center gap-4 pt-8">
              <label className="flex items-center gap-3 text-sm font-black text-foreground cursor-pointer group">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="h-6 w-6 rounded-lg border-2 border-primary accent-primary transition-all" />
                <span className="uppercase tracking-tighter">Visible to Public</span>
              </label>
            </div>
          </div>
          <Button onClick={handleAdd} className="h-16 w-full rounded-[1.5rem] font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20">
            {editingId ? "Save Changes" : "Publish to Library"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(b => (
          <div key={b.id} className="group rounded-[3rem] bg-card/30 backdrop-blur-sm border-2 border-border overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl">
            <div className="h-48 w-full overflow-hidden relative">
              {b.image_url ? <img src={b.image_url} alt={b.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="h-full w-full bg-secondary flex items-center justify-center"><FileText className="h-12 w-12 text-muted-foreground/30" /></div>}
              <div className="absolute top-6 right-6">
                <Badge className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${b.is_published ? 'bg-success/20 text-success backdrop-blur-md' : 'bg-amber-500/20 text-amber-500 backdrop-blur-md'}`}>
                  {b.is_published ? "Live" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">{b.category}</span>
              <h3 className="text-2xl font-black text-foreground leading-tight line-clamp-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">{b.excerpt}</p>
              <div className="pt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground">By {b.author}</span>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(b)} variant="secondary" size="icon" className="h-10 w-10 rounded-xl"><Edit className="h-4 w-4" /></Button>
                  <Button onClick={() => handleDelete(b.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Resources Management ---
const AdminResources = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", file_url: "", category: "PDF", min_tier: "Basic" });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (editingId) {
      const { error } = await supabase.from("resources").update(form).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Resource Updated!" });
    } else {
      const { error } = await supabase.from("resources").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Resource Added!" });
    }
    setForm({ title: "", description: "", file_url: "", category: "PDF", min_tier: "Basic" });
    setShowForm(false);
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) return;
    await supabase.from("resources").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  const startEdit = (r: any) => {
    setForm({ title: r.title, description: r.description || "", file_url: r.file_url || "", category: r.category || "PDF", min_tier: r.min_tier || "Basic" });
    setEditingId(r.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Vault & Assets</h2>
          <p className="text-muted-foreground font-medium">Upload swipe files, templates, and training materials.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", description: "", file_url: "", category: "PDF", min_tier: "Basic" }); }} className="rounded-2xl font-black text-sm uppercase py-6 px-8 shadow-xl shadow-primary/20">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> Add Resource</>}
        </Button>
      </div>

      {showForm && (
        <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Resource Title</label>
              <Input placeholder="High-Ticket Script Pack" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Asset Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-16 w-full rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6 text-foreground text-sm uppercase">
                <option value="PDF">PDF Guide</option>
                <option value="Templates">Templates</option>
                <option value="Video">Video Training</option>
                <option value="Bonus">Exclusive Bonus</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Download URL / Link</label>
            <Input placeholder="https://..." value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Required Access Tier</label>
              <select value={form.min_tier} onChange={e => setForm({ ...form, min_tier: e.target.value })} className="h-16 w-full rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6 text-foreground text-sm uppercase">
                <option value="Basic">Basic Access</option>
                <option value="Standard">Standard Access</option>
                <option value="Pro">Pro Access</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Quick Description</label>
              <Input placeholder="Briefly describe what this asset is..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
          </div>
          <Button onClick={handleAdd} className="h-16 w-full rounded-[1.5rem] font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20">
            {editingId ? "Update Asset" : "Add to Vault"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(r => (
          <div key={r.id} className="group p-8 rounded-[3rem] bg-card/30 backdrop-blur-sm border-2 border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-primary shadow-glow" />
            </div>
            <Badge className="mb-4 bg-secondary text-muted-foreground border-none text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
              {r.category} • {r.min_tier}
            </Badge>
            <h3 className="text-xl font-black text-foreground mb-2 line-clamp-1 italic uppercase tracking-tighter">{r.title}</h3>
            <p className="text-xs text-muted-foreground font-medium mb-6 line-clamp-2">{r.description || "No description provided."}</p>
            <div className="flex items-center justify-between">
              <Button onClick={() => window.open(r.file_url, "_blank")} variant="outline" className="rounded-xl font-bold text-[10px] uppercase h-10 px-4">View Asset</Button>
              <div className="flex gap-1">
                <Button onClick={() => startEdit(r)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleDelete(r.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Contests Management ---
const AdminContests = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", target: "100", reward_value: "500", start_date: "", end_date: "", status: "active" });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("contests").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    const payload = {
      ...form, target: Number(form.target), reward_value: Number(form.reward_value),
    };
    if (editingId) {
      const { error } = await supabase.from("contests").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Contest Optimized!" });
    } else {
      const { error } = await supabase.from("contests").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Contest Launched!" });
    }
    setForm({ title: "", description: "", target: "100", reward_value: "500", start_date: "", end_date: "", status: "active" });
    setShowForm(false);
    setEditingId(null);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this contest?")) return;
    await supabase.from("contests").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  const startEdit = (c: any) => {
    setForm({
      title: c.title, description: c.description || "", target: c.target.toString(),
      reward_value: c.reward_value.toString(), start_date: c.start_date || "",
      end_date: c.end_date || "", status: c.status || "active"
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Leaderboard Wars</h2>
          <p className="text-muted-foreground font-medium">Create and manage affiliate competitions and rewards.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", description: "", target: "100", reward_value: "500", start_date: "", end_date: "", status: "active" }); }} className="rounded-2xl font-black text-sm uppercase py-6 px-8 shadow-xl shadow-primary/20">
          {showForm ? "Cancel" : <><Plus className="mr-2 h-5 w-5" /> Launch Contest</>}
        </Button>
      </div>

      {showForm && (
        <div className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Contest Title</label>
              <Input placeholder="July Leaderboard Sprint" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Reward Value ($)</label>
              <Input placeholder="500" type="number" value={form.reward_value} onChange={e => setForm({ ...form, reward_value: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold text-lg px-6" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Rules & Description</label>
            <Textarea placeholder="How can they win?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-[2rem] bg-secondary/50 border-none p-8 font-medium min-h-[120px] text-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="h-16 w-full rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6 text-foreground text-sm uppercase">
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Target Sales</label>
              <Input type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Start Date</label>
              <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">End Date</label>
              <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="h-16 rounded-[1.25rem] bg-secondary/50 border-none font-bold px-6" />
            </div>
          </div>
          <Button onClick={handleAdd} className="h-16 w-full rounded-[1.5rem] font-black text-lg uppercase tracking-tight shadow-xl shadow-primary/20">
            {editingId ? "Update War Rules" : "Launch Contest War"}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map(c => (
          <div key={c.id} className="group p-10 rounded-[3rem] bg-card/30 backdrop-blur-sm border-2 border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex justify-between items-start mb-8">
              <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <Badge className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${c.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                {c.status}
              </Badge>
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4 italic uppercase tracking-tighter">{c.title}</h3>
            <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed line-clamp-3">{c.description}</p>
            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Main Reward</span>
                <span className="text-lg font-black text-foreground italic">${Number(c.reward_value).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Target</p>
                <p className="text-xs font-bold text-foreground">{c.target} Sales</p>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => startEdit(c)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl"><Edit className="h-4 w-4" /></Button>
                <Button onClick={() => handleDelete(c.id)} variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Settings ---
const AdminSettings = () => {
  const { profile, user } = useAuth();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Admin Settings</h2>
      <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Admin Name</p>
            <p className="text-lg font-black text-foreground">{profile?.full_name || "Admin"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Email</p>
            <p className="text-lg font-bold text-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "Admin privileges required.", variant: "destructive" });
        navigate("/dashboard/affiliate");
      }
    }
  }, [user, isAdmin, isLoading, navigate, toast]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !isAdmin) return null;

  const currentPath = location.pathname.replace("/dashboard/admin", "") || "/";

  const sidebarItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
    { label: "Products", icon: Store, path: "/dashboard/admin/products" },
    { label: "Testimonials", icon: Star, path: "/dashboard/admin/testimonials" },
    { label: "Blog Posts", icon: FileText, path: "/dashboard/admin/blogs" },
    { label: "Resources", icon: Award, path: "/dashboard/admin/resources" },
    { label: "Contests", icon: Trophy, path: "/dashboard/admin/contests" },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar type="admin" />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-gradient-to-br from-background via-background/95 to-secondary/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <Routes>
            <Route index element={<AdminHUD />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="contests" element={<AdminContests />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
      <HelpAI />
    </div>
  );
};

export default AdminDashboard;
