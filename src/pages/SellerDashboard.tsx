import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Routes, Route } from "react-router-dom";
import {
  DollarSign, Package, ShoppingCart, Users, Wallet, FileText, Settings as SettingsIcon,
  LayoutDashboard, Shield, Plus, Pencil, Trash2, Download, Store, TrendingUp, AlertTriangle,
  MessageSquare, Boxes, BarChart3, ChevronRight, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/DashboardSidebar";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

// ─── External Seller Components ───────────────────────────────────────
import InventoryAnalytics from "@/components/seller/InventoryAnalytics";
import OrderManagement from "@/components/seller/OrderManagement";
import AffiliateLeaderboard from "@/components/seller/AffiliateLeaderboard";
import CommissionOverrides from "@/components/seller/CommissionOverrides";
import CouponCodes from "@/components/seller/CouponCodes";
import StorefrontSettings from "@/components/seller/StorefrontSettings";
import StockManagement from "@/components/seller/StockManagement";
import CustomerReviews from "@/components/seller/CustomerReviews";
import TaxSettings from "@/components/seller/TaxSettings";
import SubscriptionManagement from "@/components/seller/SubscriptionManagement";
import BulkImport from "@/components/seller/BulkImport";
import ABTesting from "@/components/seller/ABTesting";

// ─── Overview ─────────────────────────────────────────────────────────
const SellerOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, affiliates: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<{ type: string; count: number; icon: any; link: string; color: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // 1. Fetch main stats
      const { data: orders } = await supabase.from("orders").select("id, amount, seller_earnings, affiliate_id, buyer_email, created_at, status").eq("seller_id", user.id).order('created_at', { ascending: false });
      const revenue = (orders || []).reduce((s: number, o: any) => s + Number(o.seller_earnings || 0), 0);
      const affiliateSet = new Set((orders || []).map((o: any) => o.affiliate_id).filter(Boolean));
      const { count: products } = await supabase.from("products").select("id", { count: "exact" }).eq("seller_id", user.id);

      setStats({ revenue, orders: (orders || []).length, products: products || 0, affiliates: affiliateSet.size });
      setRecentOrders((orders || []).slice(0, 4));

      // 2. Fetch pending tasks (Low stock, Pending Reviews)
      const tasks = [];
      const { count: lowStock } = await supabase.from("products").select("id", { count: "exact" })
        .eq("seller_id", user.id)
        .not("stock_quantity", "is", null)
        .lte("stock_quantity", 10); // Mocking comparing directly to a low stock number, normally you'd fetch and filter or use rpc.

      if (lowStock && lowStock > 0) {
        tasks.push({ type: "Low Stock Items", count: lowStock, icon: AlertTriangle, link: "/dashboard/seller/stock", color: "text-warning" });
      }

      const { count: reviews } = await supabase.from("product_reviews").select("id", { count: "exact" })
        .eq("seller_response", null); // Just a mock check

      if (reviews && reviews > 0) {
        tasks.push({ type: "Unanswered Reviews", count: reviews, icon: MessageSquare, link: "/dashboard/seller/reviews", color: "text-primary" });
      }

      setPendingTasks(tasks);
    })();
  }, [user]);

  const QUICK_ACTIONS = [
    { label: "New Product", icon: Plus, link: "/dashboard/seller/products", color: "bg-primary/20 text-primary" },
    { label: "View Analytics", icon: BarChart3, link: "/dashboard/seller/analytics", color: "bg-success/20 text-success" },
    { label: "Storefront", icon: Store, link: "/dashboard/seller/storefront", color: "bg-amber-500/20 text-amber-500" },
    { label: "Create Coupon", icon: DollarSign, link: "/dashboard/seller/coupons", color: "bg-blue-500/20 text-blue-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight mb-1">Command Center</h2>
          <p className="text-muted-foreground font-medium">Your business velocity at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-xl h-12 uppercase font-black text-xs tracking-widest"><Link to="/dashboard/seller/orders">View Orders</Link></Button>
          <Button asChild className="rounded-xl h-12 uppercase font-black text-xs tracking-widest"><Link to="/dashboard/seller/products"><Plus className="w-4 h-4 mr-2" /> Add Product</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Net Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={Wallet} trend="↑ 12.5% vs last period" />
        <StatsCard title="Total Volume" value={stats.orders.toString()} icon={ShoppingCart} trend="Total orders processed" />
        <StatsCard title="Active Listings" value={stats.products.toString()} icon={Package} trend="Live on marketplace" />
        <StatsCard title="Promoters" value={stats.affiliates.toString()} icon={Activity} trend="Affiliates driving sales" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions & Tasks Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] glass">
            <h3 className="text-xs uppercase font-black tracking-widest text-muted-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {QUICK_ACTIONS.map(action => (
                <Link key={action.label} to={action.link} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/30 hover:bg-secondary transition-colors group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-black text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {pendingTasks.length > 0 && (
            <div className="p-6 rounded-[2rem] glass border border-warning/20">
              <h3 className="text-xs uppercase font-black tracking-widest text-muted-foreground mb-4">Requires Attention</h3>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <Link key={task.type} to={task.link} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-background ${task.color}`}><task.icon className="w-4 h-4" /></div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{task.type}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{task.count} pending items</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="xl:col-span-2 p-6 rounded-[2rem] glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs uppercase font-black tracking-widest text-muted-foreground">Recent Transactions</h3>
            <Link to="/dashboard/seller/orders" className="text-[10px] uppercase font-black text-primary hover:underline">View All</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-primary/20 rounded-2xl">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
              <p className="font-medium text-sm">No recent orders found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px] sm:max-w-[300px]">{order.buyer_email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-primary/30" />
                        <span className={`text-[10px] font-black uppercase ${order.status === 'completed' ? 'text-success' : 'text-warning'}`}>{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg">${Number(order.amount).toFixed(2)}</p>
                    <p className="text-[10px] font-black uppercase text-success tracking-widest">Net +${Number(order.seller_earnings).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Products CRUD ────────────────────────────────────────────────────
const SellerProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", price: 0, commission_rate: 50,
    min_tier: "Basic", category: "Courses", image_url: "",
  });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
    setProducts(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const reset = () => {
    setEditing(null);
    setForm({ title: "", description: "", price: 0, commission_rate: 50, min_tier: "Basic", category: "Courses", image_url: "" });
  };

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description || "", price: Number(p.price), commission_rate: Number(p.commission_rate),
      min_tier: p.min_tier || "Basic", category: p.category, image_url: p.image_url || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!user) return;
    const payload = { ...form, seller_id: user.id, status: "active", approval_status: "pending" };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: editing ? "Product updated" : "Product submitted", description: "Admin approval is required before it appears in the marketplace." });
    setOpen(false); reset(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Deleted" }); load();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">My Products</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-12 font-black uppercase text-xs"><Plus className="h-4 w-4 mr-2" />New Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit Product" : "Create Product"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Price (USD)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                <Input type="number" placeholder="Commission %" value={form.commission_rate} onChange={(e) => setForm({ ...form, commission_rate: Number(e.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.min_tier} onChange={(e) => setForm({ ...form, min_tier: e.target.value })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="Basic">Basic Marketplace</option>
                  <option value="Standard">Standard Marketplace</option>
                  <option value="Pro">Pro Marketplace</option>
                </select>
                <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <ImageUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder={`products/${user?.id || "seller"}`} label="Product image" />
              <Button onClick={save} className="w-full">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="p-6 rounded-[2rem] glass space-y-3">
            {p.image_url && <img src={p.image_url} alt={p.title} className="h-32 w-full object-cover rounded-xl" />}
            <div className="flex gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[10px]">{p.category}</Badge>
              <Badge className="bg-secondary border-none text-[10px]">{p.min_tier}</Badge>
              <Badge className={p.approval_status === "approved" ? "bg-success/10 text-success border-none text-[10px]" : p.approval_status === "rejected" ? "bg-destructive/10 text-destructive border-none text-[10px]" : "bg-warning/10 text-warning border-none text-[10px]"}>{p.approval_status}</Badge>
            </div>
            <h3 className="font-black text-foreground">{p.title}</h3>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-black">${Number(p.price).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{p.commission_rate}% commission</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(p)}><Pencil className="h-3 w-3 mr-1" />Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-3 p-10 rounded-[2rem] glass-subtle border-dashed text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products yet. Create your first product to start selling.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Orders ───────────────────────────────────────────────────────────
const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("orders").select("*, products(title)").eq("seller_id", user.id).order("created_at", { ascending: false });
      setOrders(data || []);
    })();
  }, [user]);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Orders</h2>
      {orders.length === 0 ? (
        <div className="p-10 rounded-[2rem] glass text-center text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="p-6 rounded-[2rem] glass grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
              <div><p className="text-[10px] uppercase text-muted-foreground">Product</p><p className="font-black text-sm">{o.products?.title || "—"}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Buyer</p><p className="text-sm">{o.buyer_email}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Total</p><p className="font-black">${Number(o.amount).toFixed(2)}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Your Earnings</p><p className="font-black text-success">${Number(o.seller_earnings || 0).toFixed(2)}</p></div>
              <Badge className="bg-success/10 text-success border-none w-fit">{o.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Affiliates promoting me ──────────────────────────────────────────
const SellerAffiliates = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: orders } = await supabase.from("orders").select("affiliate_id, seller_earnings, amount").eq("seller_id", user.id);
      const map: Record<string, { sales: number; revenue: number }> = {};
      (orders || []).forEach((o: any) => {
        if (!o.affiliate_id) return;
        map[o.affiliate_id] = map[o.affiliate_id] || { sales: 0, revenue: 0 };
        map[o.affiliate_id].sales += 1;
        map[o.affiliate_id].revenue += Number(o.amount);
      });
      const ids = Object.keys(map);
      if (ids.length === 0) { setRows([]); return; }
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, package_tier").in("user_id", ids);
      setRows((profiles || []).map((p: any) => ({ ...p, ...map[p.user_id] })));
    })();
  }, [user]);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Affiliates Promoting You</h2>
      {rows.length === 0 ? (
        <div className="p-10 rounded-[2rem] glass text-center text-muted-foreground">No affiliates have made a sale yet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.user_id} className="p-6 rounded-[2rem] glass grid grid-cols-4 gap-4 items-center">
              <div><p className="font-black">{r.full_name || "Affiliate"}</p><p className="text-xs text-muted-foreground">{r.package_tier} tier</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Sales</p><p className="font-black">{r.sales}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Revenue Generated</p><p className="font-black">${r.revenue.toFixed(2)}</p></div>
              <Badge className="bg-success/10 text-success border-none w-fit">Active</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Payouts ──────────────────────────────────────────────────────────
const SellerPayouts = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [available, setAvailable] = useState(0);
  const [amount, setAmount] = useState(0);

  const load = async () => {
    if (!user) return;
    const { data: orders } = await supabase.from("orders").select("seller_earnings").eq("seller_id", user.id);
    const earned = (orders || []).reduce((s: number, o: any) => s + Number(o.seller_earnings || 0), 0);
    const { data: payoutsData } = await supabase.from("seller_payouts").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
    const paid = (payoutsData || []).filter((p: any) => p.status !== "rejected").reduce((s: number, p: any) => s + Number(p.amount), 0);
    setPayouts(payoutsData || []);
    setAvailable(earned - paid);
  };
  useEffect(() => { load(); }, [user]);

  const request = async () => {
    if (!user) return;
    if (!profile?.momo_number && !profile?.skrill_email) {
      toast({ title: "Add payout details", description: "Set your MoMo or Skrill in Settings first.", variant: "destructive" });
      return;
    }
    if (amount <= 0 || amount > available) return toast({ title: "Invalid amount", variant: "destructive" });

    const { error } = await supabase.functions.invoke("korapay-payout", {
      body: { amount, role: 'seller' }
    });

    if (error) {
      toast({ title: "Payout Failed", description: error.message || "An error occurred with payout.", variant: "destructive" });
      return;
    }

    toast({ title: "Payout Processed!", description: "Funds have been sent to your wallet." });
    setAmount(0);
    load();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Payouts</h2>
      <div className="p-8 rounded-[2rem] glass">
        <p className="text-[10px] uppercase text-muted-foreground mb-2">Available Balance</p>
        <p className="text-4xl font-black text-success mb-6">${available.toFixed(2)}</p>
        <div className="flex gap-4 max-w-md">
          <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="h-12 rounded-xl" />
          <Button onClick={request} className="h-12 rounded-xl font-black uppercase text-xs">Request</Button>
        </div>
      </div>
      <div className="space-y-3">
        {payouts.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl glass flex justify-between items-center">
            <div>
              <p className="font-black">${Number(p.amount).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
            </div>
            <Badge className={`border-none ${p.status === "completed" ? "bg-success/10 text-success" : p.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"}`}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────
const SellerReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const downloadCSV = async (type: "sales" | "payouts") => {
    if (!user) return;
    let rows: any[] = [];
    let header = "";
    if (type === "sales") {
      const { data } = await supabase.from("orders").select("*, products(title)").eq("seller_id", user.id);
      header = "Date,Product,Buyer,Amount,Your Earnings,Platform Fee,Status\n";
      rows = (data || []).map((o: any) => [
        new Date(o.created_at).toISOString().slice(0, 10), o.products?.title || "", o.buyer_email,
        Number(o.amount).toFixed(2), Number(o.seller_earnings || 0).toFixed(2),
        Number(o.platform_fee || 0).toFixed(2), o.status,
      ]);
    } else {
      const { data } = await supabase.from("seller_payouts").select("*").eq("seller_id", user.id);
      header = "Date,Amount,Status\n";
      rows = (data || []).map((p: any) => [new Date(p.created_at).toISOString().slice(0, 10), Number(p.amount).toFixed(2), p.status]);
    }
    const csv = header + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `affilyt-${type}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { type: "sales" as const, title: "Sales Report", desc: "All orders, earnings, and fees as CSV." },
          { type: "payouts" as const, title: "Payouts Report", desc: "All payout requests and statuses as CSV." },
        ].map((r) => (
          <div key={r.type} className="p-8 rounded-[2rem] glass">
            <FileText className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-black text-lg mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{r.desc}</p>
            <Button onClick={() => downloadCSV(r.type)} className="rounded-xl font-black uppercase text-xs"><Download className="h-4 w-4 mr-2" />Download CSV</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────
const SellerSettings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: "", phone: "", country: "",
    business_name: "", business_description: "", business_website: "",
    momo_number: "", momo_provider: "", skrill_email: "",
  });

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name || "", phone: profile.phone || "", country: profile.country || "",
      business_name: profile.business_name || "", business_description: profile.business_description || "",
      business_website: profile.business_website || "", momo_number: profile.momo_number || "",
      momo_provider: profile.momo_provider || "", skrill_email: profile.skrill_email || "",
    });
  }, [profile]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await refreshProfile(); toast({ title: "Settings saved" });
  };

  const Field = ({ label, value, onChange, ...rest }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-muted-foreground">{label}</label>
      <Input value={value} onChange={onChange} className="h-14 rounded-2xl bg-secondary border-none font-bold" {...rest} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Settings</h2>
      <div className="p-8 rounded-[2rem] glass space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Full Name" value={form.full_name} onChange={(e: any) => setForm({ ...form, full_name: e.target.value })} />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Email</label>
            <Input value={user?.email || ""} disabled className="h-14 rounded-2xl bg-secondary border-none font-bold opacity-60" />
          </div>
          <Field label="Phone" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
          <Field label="Country" value={form.country} onChange={(e: any) => setForm({ ...form, country: e.target.value })} />
        </div>

        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary pt-4">Business</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Business Name" value={form.business_name} onChange={(e: any) => setForm({ ...form, business_name: e.target.value })} />
          <Field label="Website" value={form.business_website} onChange={(e: any) => setForm({ ...form, business_website: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-muted-foreground">Business Description</label>
          <Textarea value={form.business_description} onChange={(e) => setForm({ ...form, business_description: e.target.value })} className="rounded-2xl bg-secondary border-none font-bold min-h-[100px]" />
        </div>

        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary pt-4">Payout Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="MoMo Number" value={form.momo_number} onChange={(e: any) => setForm({ ...form, momo_number: e.target.value })} placeholder="024XXXXXXX" />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">MoMo Provider</label>
            <select value={form.momo_provider} onChange={(e) => setForm({ ...form, momo_provider: e.target.value })} className="h-14 w-full rounded-2xl bg-secondary border-none font-bold px-4 text-foreground">
              <option value="">Select Provider</option>
              <option value="MTN">MTN Mobile Money</option>
              <option value="Vodafone">Vodafone Cash</option>
              <option value="AirtelTigo">AirtelTigo Money</option>
            </select>
          </div>
          <Field label="Skrill Email" value={form.skrill_email} onChange={(e: any) => setForm({ ...form, skrill_email: e.target.value })} placeholder="you@skrill.com" />
        </div>

        <Button onClick={save} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save Settings</Button>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────
const SellerDashboard = () => {
  const { user, isLoading, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSeller, setIsSeller] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "seller" as any).maybeSingle();
      setIsSeller(!!data);
      if (!data) navigate("/become-seller");
    })();
  }, [user, navigate]);

  if (isLoading || isSeller === null) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !isSeller) return null;

  const items = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard/seller" },
    { label: "Products", icon: Package, path: "/dashboard/seller/products" },
    { label: "Orders", icon: ShoppingCart, path: "/dashboard/seller/orders" },
    { label: "Affiliates", icon: Users, path: "/dashboard/seller/affiliates" },
    { label: "Payouts", icon: Wallet, path: "/dashboard/seller/payouts" },
    { label: "Reports", icon: FileText, path: "/dashboard/seller/reports" },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard/seller/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-background theme-seller relative overflow-hidden text-foreground">
      {/* Glassmorphic Animated Background Blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <DashboardSidebar type="seller" />
      <main className="flex-1 pt-16 lg:pt-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 overflow-y-auto min-h-screen relative z-10 scrollbar-hide">
        <Routes>
          <Route index element={<SellerOverview />} />
          <Route path="analytics" element={<InventoryAnalytics />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="import" element={<BulkImport />} />
          <Route path="stock" element={<StockManagement />} />
          <Route path="ab-testing" element={<ABTesting />} />
          <Route path="leaderboard" element={<AffiliateLeaderboard />} />
          <Route path="commissions" element={<CommissionOverrides />} />
          <Route path="coupons" element={<CouponCodes />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="storefront" element={<StorefrontSettings />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
          <Route path="tax" element={<TaxSettings />} />
          <Route path="affiliates" element={<SellerAffiliates />} />
          <Route path="payouts" element={<SellerPayouts />} />
          <Route path="reports" element={<SellerReports />} />
          <Route path="settings" element={<SellerSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default SellerDashboard;
