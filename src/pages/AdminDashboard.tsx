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
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Courses", commission_rate: "50", min_tier: "Basic", image_url: "" });
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from("products").insert({
      title: form.title, description: form.description, price: Number(form.price),
      category: form.category, commission_rate: Number(form.commission_rate),
      min_tier: form.min_tier, image_url: form.image_url || null, status: "active",
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Product Added!" });
    setForm({ title: "", description: "", price: "", category: "Courses", commission_rate: "50", min_tier: "Basic", image_url: "" });
    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product Deleted" });
    fetchProducts();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Products</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl font-black text-xs uppercase gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {showForm && (
        <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input placeholder="Product Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Price (USD)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-2xl bg-secondary border-none font-medium min-h-[100px]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Commission %" type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <select value={form.min_tier} onChange={e => setForm({ ...form, min_tier: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold px-4 text-foreground">
              <option value="Basic">Basic Tier</option>
              <option value="Standard">Standard Tier</option>
              <option value="Pro">Pro Tier</option>
            </select>
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <Button onClick={handleAdd} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save Product</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="p-6 rounded-[2rem] bg-card border-2 border-border hover:border-primary/50 transition-all">
            {p.image_url && <img src={p.image_url} alt={p.title} className="h-32 w-full object-cover rounded-xl mb-4" />}
            <h3 className="font-black text-foreground mb-1">{p.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px]">{p.category}</Badge>
              <Badge className="bg-secondary text-muted-foreground border-none text-[10px]">{p.min_tier || "Basic"} Tier</Badge>
            </div>
            <p className="text-2xl font-black text-foreground">${Number(p.price).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mb-4">{p.commission_rate}% commission</p>
            <Button onClick={() => handleDelete(p.id)} variant="outline" size="sm" className="rounded-xl gap-1 text-[10px]">
              <Trash2 className="h-3 w-3" /> Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Testimonials Management ---
const AdminTestimonials = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", content: "", image_url: "", rating: "5" });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    await supabase.from("testimonials").insert({ name: form.name, role: form.role, content: form.content, image_url: form.image_url || null, rating: Number(form.rating) });
    toast({ title: "Testimonial Added!" });
    setForm({ name: "", role: "", content: "", image_url: "", rating: "5" });
    setShowForm(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Testimonials</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl font-black text-xs uppercase gap-2"><Plus className="h-4 w-4" /> Add</Button>
      </div>
      {showForm && (
        <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Role / Title" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <Textarea placeholder="Testimonial content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="rounded-2xl bg-secondary border-none min-h-[100px]" />
          <Button onClick={handleAdd} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(t => (
          <div key={t.id} className="p-6 rounded-[2rem] bg-card border-2 border-border">
            <p className="text-foreground font-medium italic mb-4">"{t.content}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <Button onClick={() => handleDelete(t.id)} variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Blog Management ---
const AdminBlogs = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    await supabase.from("blog_posts").insert(form);
    toast({ title: "Blog Post Added!" });
    setForm({ title: "", excerpt: "", content: "", author: "", category: "General", image_url: "", is_published: true });
    setShowForm(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch_();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Blog Posts</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl font-black text-xs uppercase gap-2"><Plus className="h-4 w-4" /> Add Post</Button>
      </div>
      {showForm && (
        <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <Input placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          <Textarea placeholder="Full content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="rounded-2xl bg-secondary border-none min-h-[150px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <label className="flex items-center gap-3 text-sm font-bold text-foreground">
              <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="h-5 w-5 rounded" /> Published
            </label>
          </div>
          <Button onClick={handleAdd} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save Post</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(b => (
          <div key={b.id} className="p-6 rounded-[2rem] bg-card border-2 border-border">
            {b.image_url && <img src={b.image_url} alt={b.title} className="h-32 w-full object-cover rounded-xl mb-4" />}
            <Badge className={`text-[10px] mb-2 ${b.is_published ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'} border-none`}>{b.is_published ? "Published" : "Draft"}</Badge>
            <h3 className="font-black text-foreground mb-1">{b.title}</h3>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{b.excerpt}</p>
            <Button onClick={() => handleDelete(b.id)} variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
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
  const [form, setForm] = useState({ title: "", description: "", file_url: "", category: "General", min_tier: "Basic" });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    await supabase.from("resources").insert(form);
    toast({ title: "Resource Added!" });
    setForm({ title: "", description: "", file_url: "", category: "General", min_tier: "Basic" });
    setShowForm(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    fetch_();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Resources</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl font-black text-xs uppercase gap-2"><Plus className="h-4 w-4" /> Add</Button>
      </div>
      {showForm && (
        <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-2xl bg-secondary border-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input placeholder="File URL" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <select value={form.min_tier} onChange={e => setForm({ ...form, min_tier: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold px-4 text-foreground">
              <option value="Basic">Basic</option><option value="Standard">Standard</option><option value="Pro">Pro</option>
            </select>
          </div>
          <Button onClick={handleAdd} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(r => (
          <div key={r.id} className="p-6 rounded-[2rem] bg-card border-2 border-border flex items-center justify-between">
            <div>
              <h3 className="font-black text-foreground">{r.title}</h3>
              <p className="text-xs text-muted-foreground">{r.category} · {r.min_tier} Tier</p>
            </div>
            <Button onClick={() => handleDelete(r.id)} variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
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
  const [form, setForm] = useState({ title: "", description: "", target: "100", reward_value: "500", start_date: "", end_date: "", status: "active" });
  const { toast } = useToast();

  const fetch_ = async () => {
    const { data } = await supabase.from("contests").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    await supabase.from("contests").insert({
      ...form, target: Number(form.target), reward_value: Number(form.reward_value),
    });
    toast({ title: "Contest Created!" });
    setShowForm(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contests").delete().eq("id", id);
    fetch_();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Contests</h2>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-2xl font-black text-xs uppercase gap-2"><Plus className="h-4 w-4" /> Create</Button>
      </div>
      {showForm && (
        <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
          <Input placeholder="Contest Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-2xl bg-secondary border-none" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Input placeholder="Target Sales" type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input placeholder="Reward ($)" type="number" value={form.reward_value} onChange={e => setForm({ ...form, reward_value: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
            <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <Button onClick={handleAdd} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Create Contest</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(c => (
          <div key={c.id} className="p-6 rounded-[2rem] bg-card border-2 border-border">
            <h3 className="font-black text-foreground mb-1">{c.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{c.description}</p>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none text-[10px]">Target: {c.target}</Badge>
              <Badge className="bg-success/10 text-success border-none text-[10px]">Reward: ${Number(c.reward_value).toFixed(2)}</Badge>
            </div>
            <Button onClick={() => handleDelete(c.id)} variant="ghost" size="sm" className="mt-4"><Trash2 className="h-4 w-4" /></Button>
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

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
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 p-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-10 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-black text-xl tracking-tighter text-foreground italic">AFFIL<span className="text-primary not-italic">YT.</span></span>
        </Link>
        <div className="mb-6 p-4 rounded-2xl bg-secondary/50">
          <p className="text-xs font-black text-foreground">{profile?.full_name || "Admin"}</p>
          <p className="text-[10px] text-muted-foreground">Super Admin</p>
        </div>
        <nav className="space-y-1 flex-1">
          {sidebarItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
        <Button onClick={() => { signOut(); navigate("/"); }} variant="outline" className="mt-4 rounded-xl font-black text-xs uppercase">Sign Out</Button>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Routes>
          <Route index element={<AdminHUD />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="contests" element={<AdminContests />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
