import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Routes, Route } from "react-router-dom";
import {
  DollarSign, MousePointerClick, Target, Award, Wallet, Copy, Check,
  LayoutDashboard, Store, CreditCard, Settings as SettingsIcon, Shield,
  LinkIcon, Download, FileText, Trophy, Star, Globe, Eye
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// --- Overview ---
const DashboardOverview = () => {
  const { profile, user } = useAuth();
  const { packages } = useData();
  const [stats, setStats] = useState({ earnings: 0, clicks: 0, orders: 0 });

  const userPkg = packages.find(p => p.name === profile?.package_tier) || packages[0];

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data: commissions } = await supabase.from("commissions").select("amount").eq("affiliate_id", user.id);
      const totalEarnings = (commissions || []).reduce((sum: number, c: any) => sum + Number(c.amount), 0);
      const { data: links } = await supabase.from("affiliate_links").select("clicks").eq("affiliate_id", user.id);
      const totalClicks = (links || []).reduce((sum: number, l: any) => sum + (l.clicks || 0), 0);
      const { count } = await supabase.from("orders").select("id", { count: "exact" }).eq("affiliate_id", user.id);
      setStats({ earnings: totalEarnings, clicks: totalClicks, orders: count || 0 });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Total Earnings" value={`$${stats.earnings.toLocaleString()}`} icon={Wallet} trend="From commissions" />
        <StatsCard title="Total Clicks" value={stats.clicks.toLocaleString()} icon={MousePointerClick} trend="Via your links" />
        <StatsCard title="Total Sales" value={stats.orders.toString()} icon={Target} trend="Completed orders" />
        <StatsCard title="Your Plan" value={profile?.package_tier || "Basic"} icon={Award} trend={`${userPkg?.commission}% Commission`} />
      </div>
    </div>
  );
};

// --- My Links ---
const AffiliateLinks = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const link = profile?.affiliate_link || `affilyt.lovable.app/marketplace?ref=${user?.id?.slice(0, 8)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${link}`);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Share it to start earning." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">My Affiliate Link</h2>
      <div className="p-10 rounded-[3rem] bg-card border-2 border-border space-y-8">
        <div className="p-6 rounded-2xl bg-secondary space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase opacity-60">Your Referral Link</span>
            <Badge className="bg-success/10 text-success border-none">Active</Badge>
          </div>
          <div className="flex items-center gap-4">
            <code className="flex-1 p-4 rounded-xl bg-background font-mono text-xs font-black text-primary overflow-x-auto whitespace-nowrap">https://{link}</code>
            <Button onClick={copyLink} className="h-12 w-12 rounded-xl p-0">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">This link is embedded in all products visible to your tier. When someone buys through your link, your commission is automatically credited.</p>
      </div>
    </div>
  );
};

// --- Products ---
const AffiliateProducts = () => {
  const { profile } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const tierRank: Record<string, number> = { Basic: 0, Standard: 1, Pro: 2 };
      const userRank = tierRank[profile?.package_tier || "Basic"] ?? 0;
      const { data } = await supabase.from("products").select("*").eq("status", "active");
      const filtered = (data || []).filter((p: any) => (tierRank[p.min_tier || "Basic"] ?? 0) <= userRank);
      setProducts(filtered);
    };
    fetchProducts();
  }, [profile]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="p-6 rounded-[2rem] bg-card border-2 border-border">
            {p.image_url && <img src={p.image_url} alt={p.title} className="h-32 w-full object-cover rounded-xl mb-4" />}
            <Badge className="bg-primary/10 text-primary border-none text-[10px] mb-2">{p.category}</Badge>
            <h3 className="font-black text-foreground mb-1">{p.title}</h3>
            <p className="text-2xl font-black text-foreground">${Number(p.price).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{p.commission_rate}% commission</p>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted-foreground col-span-3 text-center py-10">No products available for your tier yet.</p>}
      </div>
    </div>
  );
};

// --- Commissions ---
const AffiliateCommissions = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      const { data } = await supabase.from("commissions").select("*").eq("affiliate_id", user.id).order("created_at", { ascending: false });
      setCommissions(data || []);
    };
    fetch_();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Commissions</h2>
      {commissions.length === 0 ? (
        <div className="p-10 rounded-[2rem] bg-card border-2 border-border text-center">
          <p className="text-muted-foreground">No commissions yet. Share your affiliate link to start earning!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commissions.map(c => (
            <div key={c.id} className="p-6 rounded-[2rem] bg-card border-2 border-border flex items-center justify-between">
              <div>
                <p className="font-black text-foreground">${Number(c.amount).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <Badge className={`border-none text-[10px] ${c.status === "pending" ? "bg-amber-500/10 text-amber-500" : "bg-success/10 text-success"}`}>{c.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Settings ---
const AffiliateSettings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: "", phone: "", country: "", momo_number: "", momo_provider: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        country: profile.country || "",
        momo_number: profile.momo_number || "",
        momo_provider: profile.momo_provider || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await refreshProfile();
    toast({ title: "Settings Saved!" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Settings</h2>
      <div className="p-8 rounded-[2rem] bg-card border-2 border-border space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Full Name</label>
            <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Email</label>
            <Input value={user?.email || ""} disabled className="h-14 rounded-2xl bg-secondary border-none font-bold opacity-60" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Phone</label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="+233..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Country</label>
            <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="Ghana" />
          </div>
        </div>

        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary pt-4">Payment Details (Mobile Money)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">MoMo Number</label>
            <Input value={form.momo_number} onChange={e => setForm({ ...form, momo_number: e.target.value })} className="h-14 rounded-2xl bg-secondary border-none font-bold" placeholder="024XXXXXXX" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground">Provider</label>
            <select value={form.momo_provider} onChange={e => setForm({ ...form, momo_provider: e.target.value })} className="h-14 w-full rounded-2xl bg-secondary border-none font-bold px-4 text-foreground">
              <option value="">Select Provider</option>
              <option value="MTN">MTN Mobile Money</option>
              <option value="Vodafone">Vodafone Cash</option>
              <option value="AirtelTigo">AirtelTigo Money</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <div className="p-4 rounded-2xl bg-secondary/50 mb-6">
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Current Package</p>
            <p className="text-lg font-black text-primary">{profile?.package_tier || "Basic"} Tier</p>
          </div>
        </div>

        <Button onClick={handleSave} className="h-14 rounded-2xl font-black text-sm uppercase px-10">Save Settings</Button>
      </div>
    </div>
  );
};

// --- Main ---
const AffiliateDashboard = () => {
  const { user, isLoading, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    if (!isLoading && user && !profile?.package_tier) {
      navigate("/become-affiliate");
    }
  }, [user, isLoading, profile, navigate]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !profile?.package_tier) return null;

  const sidebarItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard/affiliate" },
    { label: "My Links", icon: LinkIcon, path: "/dashboard/affiliate/links" },
    { label: "Products", icon: Store, path: "/dashboard/affiliate/products" },
    { label: "Commissions", icon: CreditCard, path: "/dashboard/affiliate/commissions" },
    { label: "Settings", icon: SettingsIcon, path: "/dashboard/affiliate/settings" },
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
          <p className="text-xs font-black text-foreground">{profile?.full_name || "Affiliate"}</p>
          <p className="text-[10px] text-primary font-bold">{profile?.package_tier} Partner</p>
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
          <Route index element={<DashboardOverview />} />
          <Route path="links" element={<AffiliateLinks />} />
          <Route path="products" element={<AffiliateProducts />} />
          <Route path="commissions" element={<AffiliateCommissions />} />
          <Route path="settings" element={<AffiliateSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
