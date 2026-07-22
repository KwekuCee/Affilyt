import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Routes, Route } from "react-router-dom";
import {
  DollarSign, MousePointerClick, Target, Award, Wallet, Copy,
  LayoutDashboard, Store, Settings as SettingsIcon,
  LinkIcon, Download, FileText, Trophy, Star, Globe, Eye, Zap, Gift, MessageSquare, Flame, TrendingUp, BarChart3,
  User as UserIcon, BookOpen, Megaphone, LifeBuoy, ExternalLink, Crown, ArrowRight, Clock, TrendingDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import HelpAI from "@/components/HelpAI";
import SmartLinkCustomizer from "@/components/affiliate/SmartLinkCustomizer";

import EarningsCalendar from "@/components/affiliate/EarningsCalendar";
import ConversionFunnel from "@/components/affiliate/ConversionFunnel";
import TopProductsCarousel from "@/components/affiliate/TopProductsCarousel";
import NotificationsCenter from "@/components/affiliate/NotificationsCenter";
import MarketingResources from "@/components/affiliate/MarketingResources";
import GoalTracker from "@/components/affiliate/GoalTracker";
import ChannelAttribution from "@/components/affiliate/ChannelAttribution";
import ReferralProgram from "@/components/affiliate/ReferralProgram";
import TaxDocumentGenerator from "@/components/affiliate/TaxDocumentGenerator";
import DeepLinkGenerator from "@/components/affiliate/DeepLinkGenerator";
import WithdrawalBalanceCard from "@/components/affiliate/WithdrawalBalanceCard";
import EarningsProjection from "@/components/affiliate/EarningsProjection";

// --- Overview ---
const DashboardOverview = () => {
  const { profile, user } = useAuth();
  const { packages } = useData();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ earnings: 0, clicks: 0, orders: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topLinks, setTopLinks] = useState<any[]>([]);
  const [goalStats, setGoalStats] = useState({ current: 0, target: 1000 });

  const userPkg = packages.find(p => p.name === profile?.package_tier) || packages[0];

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      // Basic Stats
      const { data: commissions } = await supabase.from("commissions").select("*").eq("affiliate_id", user.id).order("created_at", { ascending: false });
      const totalEarnings = (commissions || []).reduce((sum: number, c: any) => sum + Number(c.amount), 0);

      const { data: links } = await supabase.from("affiliate_links").select("*, products(title)").eq("affiliate_id", user.id).order("clicks", { ascending: false });
      setTopLinks((links || []).slice(0, 3));

      const totalClicks = (links || []).reduce((sum: number, l: any) => sum + (l.clicks || 0), 0);
      const { count } = await supabase.from("orders").select("id", { count: "exact" }).eq("affiliate_id", user.id);

      setStats({ earnings: totalEarnings, clicks: totalClicks, orders: count || 0 });

      // Chart Data (Last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('en-US', { weekday: 'short' }),
          rawDate: d.setHours(0, 0, 0, 0),
          amount: 0
        };
      });

      (commissions || []).forEach((c: any) => {
        const cDate = new Date(c.created_at).setHours(0, 0, 0, 0);
        const day = last7Days.find(d => d.rawDate === cDate);
        if (day) day.amount += Number(c.amount);
      });
      setChartData(last7Days);

      // Recent Activity
      setRecentActivity((commissions || []).slice(0, 4));

      // Goal Stats (mock monthly target)
      setGoalStats({ current: totalEarnings, target: 5000 });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">Command Center</h2>
          <p className="text-muted-foreground font-medium">Welcome back, {profile?.full_name || "Hunter"}.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Earnings" value={`$${stats.earnings.toLocaleString()}`} icon={Wallet} trend="From commissions" />
        <StatsCard title="Total Clicks" value={stats.clicks.toLocaleString()} icon={MousePointerClick} trend="Via your links" />
        <StatsCard title="Total Sales" value={stats.orders.toString()} icon={Target} trend="Completed orders" />
        <StatsCard title="Your Plan" value={profile?.package_tier || "Basic"} icon={Award} trend={`${userPkg?.commission}% Commission`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area: Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[2rem] glass">
            <h3 className="text-lg font-black uppercase italic mb-6">Earnings Trend (7 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={40} tickFormatter={(v) => `$${v}`} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', background: 'hsl(var(--background))', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Links */}
            <div className="p-8 rounded-[2rem] glass space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">Top Links</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/affiliate/links")} className="text-[10px] uppercase">View All</Button>
              </div>
              <div className="space-y-4">
                {topLinks.map((link: any) => (
                  <div key={link.id} className="flex items-center justify-between p-3 rounded-2xl glass-subtle hover:bg-secondary/20 transition-colors">
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-sm truncate">{link.products?.title || "Marketplace Link"}</p>
                      <p className="text-[10px] text-primary truncate">{link.short_code}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black">{link.clicks}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Clicks</p>
                    </div>
                  </div>
                ))}
                {topLinks.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">No active links yet.</p>}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-8 rounded-[2rem] glass space-y-6">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((c: any) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">Commission Earned</p>
                      <p className="text-[10px] text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-black text-success">+${Number(c.amount).toFixed(2)}</p>
                  </div>
                ))}
                {recentActivity.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">No recent activity.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Aside */}
        <div className="space-y-8 lg:col-span-1">
          {/* Quick Actions */}
          <div className="p-8 rounded-[2rem] glass-primary overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="h-32 w-32 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black uppercase italic tracking-tight">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button onClick={() => navigate("/dashboard/affiliate/products")} className="h-12 justify-start px-4 w-full bg-background/20 hover:bg-background/40 border-none text-foreground backdrop-blur font-bold"><Store className="mr-3 h-4 w-4" /> Browse Inventory</Button>
                <Button onClick={() => navigate("/dashboard/affiliate/links")} className="h-12 justify-start px-4 w-full bg-background/20 hover:bg-background/40 border-none text-foreground backdrop-blur font-bold"><LinkIcon className="mr-3 h-4 w-4" /> Your Links</Button>
                <Button onClick={() => navigate("/dashboard/affiliate/payments")} className="h-12 justify-start px-4 w-full bg-background/20 hover:bg-background/40 border-none text-foreground backdrop-blur font-bold"><Wallet className="mr-3 h-4 w-4" /> Request Payout</Button>
              </div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="p-8 rounded-[2rem] glass space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">Monthly Target</h3>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-3xl font-black italic">${goalStats.current.toLocaleString()}</p>
                <p className="text-sm font-bold text-muted-foreground mb-1">/ ${goalStats.target.toLocaleString()}</p>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(100, (goalStats.current / goalStats.target) * 100)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase text-right tracking-widest">{Math.round((goalStats.current / goalStats.target) * 100)}% Achieved</p>
            </div>
            <Button onClick={() => navigate("/dashboard/affiliate/goals")} variant="outline" className="w-full h-11 text-[10px] uppercase tracking-widest rounded-xl">View Goal Details <ArrowRight className="ml-2 h-3 w-3" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Links ---
const AffiliateLinks = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<any[]>([]);
  // Using user_id slice or custom slug if exists
  const refId = profile?.affiliate_link || user?.id?.slice(0, 8);
  const baseUrl = window.location.origin;
  const link = `${baseUrl}/product/${refId}`; // General referral link logic needs to be careful here, maybe redirect to home with ref?
  // User said affiliate-only model. Usually links go to home or specific products.
  // I'll make the link go to home with ref for now if it's the "Marketplace Hub" link
  const homeLink = `${baseUrl}/?ref=${refId}`;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("affiliate_links")
        .select("*, products(title, price, commission_rate, image_url, category)")
        .eq("affiliate_id", user.id)
        .order("created_at", { ascending: false });
      setLinks(data || []);
    })();
  }, [user]);

  const copy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast({ title: "Copied!", description: "Link ready to share." });
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Hunter URLs</h2>
        <p className="text-muted-foreground font-medium">Your unique tracking links to claim commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3rem] glass-primary shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <LinkIcon className="h-20 w-20 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <Badge className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full italic">PRIMARY TRACKER</Badge>
            <h3 className="text-3xl font-black text-foreground uppercase italic leading-none tracking-tighter">Platform Hub</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Directs customers to the home page while tracking your ID.</p>

            <div className="flex items-center gap-4 p-4 rounded-2xl glass-subtle">
              <code className="text-xs font-bold text-primary truncate flex-1">{homeLink}</code>
              <Button onClick={() => copy(homeLink)} size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors">
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={() => copy(homeLink)} className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20">Copy Link</Button>
              <Button variant="secondary" className="h-14 w-14 rounded-2xl flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] glass-subtle border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <Zap className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-black text-foreground uppercase italic">Product-Specific Links</h4>
            <p className="text-xs text-muted-foreground font-medium max-w-[220px] mx-auto">Open Products, pick any approved product, then generate a deep tracking link.</p>
          </div>
          <Link to="/dashboard/affiliate/marketplace"><Button variant="outline" className="rounded-xl font-bold text-[10px] uppercase tracking-widest">Browse Products</Button></Link>
        </div>
      </div>

      <div className="rounded-[2rem] glass overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="col-span-4">Product</span>
          <span className="col-span-2">Clicks</span>
          <span className="col-span-3">Referral Link</span>
          <span className="col-span-3 text-right">Actions</span>
        </div>
        {links.map((row) => {
          const deepLink = row.product_id
            ? `${baseUrl}/product/${row.product_id}?ref=${row.short_code}`
            : `${baseUrl}/?ref=${row.short_code}`;
          const estCommission = row.products
            ? (Number(row.products.price) * Number(row.products.commission_rate || 0)) / 100
            : 0;
          return (
            <div key={row.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-t border-border text-sm">
              <div className="col-span-4 min-w-0">
                <p className="font-black truncate">{row.products?.title || "General referral"}</p>
                <p className="text-xs text-muted-foreground">
                  ${Number(row.products?.price || 0).toFixed(2)} • {row.products?.commission_rate || 0}%
                  {estCommission > 0 && <span className="text-primary font-bold"> · +${estCommission.toFixed(2)}/sale</span>}
                </p>
              </div>
              <p className="col-span-2 font-black">{row.clicks || 0}</p>
              <code className="col-span-3 text-xs text-primary truncate" title={deepLink}>{deepLink.replace(baseUrl, "")}</code>
              <div className="col-span-3 flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(deepLink)} className="rounded-lg">
                  <Copy className="h-3 w-3 mr-1" />Copy
                </Button>
                <a href={deepLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="secondary" className="rounded-lg">
                    <ExternalLink className="h-3 w-3 mr-1" />Open
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
        {links.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No product links yet. Visit the Marketplace to generate one.</p>}
      </div>
    </div>
  );
};

// --- Products ---
const AffiliateProducts = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [linkMap, setLinkMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const tierRank: Record<string, number> = { Basic: 0, Standard: 1, Pro: 2 };
      const userRank = tierRank[profile?.package_tier || "Basic"] ?? 0;
      const { data } = await supabase.from("products").select("*").eq("status", "active").eq("approval_status", "approved");
      const filtered = (data || []).filter((p: any) => (tierRank[p.min_tier || "Basic"] ?? 0) <= userRank);
      setProducts(filtered);
    };
    fetchProducts();
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("affiliate_links").select("*").eq("affiliate_id", user.id);
      const next: Record<string, any> = {};
      (data || []).forEach((link: any) => { next[link.product_id] = link; });
      setLinkMap(next);
    })();
  }, [user]);

  const createLink = async (product: any) => {
    if (!user) return;
    const existing = linkMap[product.id];
    const code = existing?.short_code || `${(profile?.affiliate_link || user.id.slice(0, 8)).replace(/[^a-z0-9]/gi, "").slice(0, 12)}-${product.id.slice(0, 6)}`.toLowerCase();

    if (!existing) {
      const { data, error } = await supabase.from("affiliate_links").insert({ affiliate_id: user.id, product_id: product.id, short_code: code }).select().single();
      if (error) return toast({ title: "Link error", description: error.message, variant: "destructive" });
      setLinkMap({ ...linkMap, [product.id]: data });
    }

    const deepLink = `${window.location.origin}/marketplace?ref=${code}&product=${product.id}`;
    await navigator.clipboard.writeText(deepLink);
    toast({ title: "Tracking link copied", description: product.title });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Available Products</h2>
          <p className="text-sm text-muted-foreground">Only products approved for your {profile?.package_tier || "Basic"} tier are shown.</p>
        </div>
        <Badge className="w-fit bg-primary/10 text-primary border-none">{profile?.package_tier || "Basic"} Marketplace</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="p-6 rounded-[2rem] glass flex flex-col">
            {p.image_url && <img src={p.image_url} alt={p.title} className="h-32 w-full object-cover rounded-xl mb-4" />}
            <div className="flex gap-2 mb-2"><Badge className="bg-primary/10 text-primary border-none text-[10px]">{p.category}</Badge><Badge variant="secondary" className="text-[10px]">{p.min_tier || "Basic"}+</Badge></div>
            <h3 className="font-black text-foreground mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{p.description}</p>
            <p className="text-2xl font-black text-foreground">${Number(p.price).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mb-4">{p.commission_rate}% commission • est. ${(Number(p.price) * Number(p.commission_rate || 0) / 100).toFixed(2)} per sale</p>
            <Button onClick={() => createLink(p)} className="h-11 rounded-xl font-black text-xs uppercase"><LinkIcon className="h-4 w-4 mr-2" />{linkMap[p.id] ? "Copy Link" : "Generate Link"}</Button>
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
        <div className="p-10 rounded-[2rem] glass text-center">
          <p className="text-muted-foreground">No commissions yet. Share your affiliate link to start earning!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {commissions.map(c => (
            <div key={c.id} className="p-6 rounded-[2rem] glass flex items-center justify-between">
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
      <div className="p-8 rounded-[2rem] glass space-y-6">
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

// --- Leaderboard ---
const AffiliateLeaderboard = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    const fetch_ = async () => {
      const { data } = await (supabase.from("leaderboard_stats" as any) as any).select("*").order("total_earnings", { ascending: false }).limit(10);
      setEntries(data || []);
    };
    fetch_();
  }, []);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Elite Wall</h2>
          <p className="text-muted-foreground font-medium">Top hunters getting paid this month.</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-xl font-bold">MONTHLY</Badge>
          <Badge className="bg-secondary text-muted-foreground border-none px-4 py-2 rounded-xl font-bold">ALL-TIME</Badge>
        </div>
      </div>

      <div className="p-10 rounded-[3rem] glass-primary shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Trophy className="h-24 w-24 text-primary/10 rotate-12" />
        </div>
        <div className="space-y-4 relative z-10">
          {entries.map((entry, idx) => {
            const rank = idx + 1;
            const isMe = entry.user_id === profile?.user_id;
            return (
              <div key={entry.user_id} className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${rank === 1 ? 'bg-primary/10 border-primary/20 shadow-xl' : isMe ? 'bg-primary/5 border-primary/10' : 'bg-secondary/30 border-transparent hover:bg-secondary/50'}`}>
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black italic w-10 ${rank === 1 ? 'text-primary' : rank === 2 ? 'text-amber-500' : rank === 3 ? 'text-slate-400' : 'text-muted-foreground'}`}>#{rank}</span>
                  <div className="h-12 w-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center overflow-hidden">
                    {entry.avatar_url ? <img src={entry.avatar_url} className="h-full w-full object-cover" /> : <UserIcon className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-black text-foreground">{entry.full_name || "Anonymous Hunter"}{isMe && " (You)"}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{entry.package_tier} Partner</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-foreground italic">${Number(entry.total_earnings).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{entry.sales_count} Sales</p>
                </div>
              </div>
            );
          })}
          {entries.length === 0 && <p className="text-center py-10 text-muted-foreground font-medium italic">The leaderboard is wide open. Start selling to claim your spot!</p>}
        </div>
      </div>
    </div>
  );
};

// --- Rewards/Prizes ---
const AffiliatePrizes = () => {
  const [contests, setContests] = useState<any[]>([]);
  useEffect(() => {
    const fetch_ = async () => {
      const { data } = await supabase.from("contests").select("*").eq("status", "active");
      setContests(data || []);
    };
    fetch_();
  }, []);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Loot Hub</h2>
          <p className="text-muted-foreground font-medium">Active wars and guaranteed rewards.</p>
        </div>
        <Gift className="h-10 w-10 text-primary animate-bounce" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contests.map(c => (
          <div key={c.id} className="group p-10 rounded-[3rem] glass-primary shadow-2xl relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <div className="relative z-10">
              <Badge className="bg-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full mb-6 italic">ACTIVE WAR</Badge>
              <h3 className="text-3xl font-black text-foreground mb-4 uppercase italic tracking-tighter">{c.title}</h3>
              <p className="text-sm text-muted-foreground font-medium mb-8 leading-relaxed">{c.description}</p>
              <div className="p-6 rounded-[2rem] bg-secondary/50 border border-border mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Main Prize</span>
                  <span className="text-2xl font-black text-primary italic">${Number(c.reward_value).toLocaleString()}</span>
                </div>
                <div className="h-3 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" style={{ width: '30%' }} />
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-4">30% Sales Milestone Reached</p>
              </div>
              <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20">Join the War</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Withdrawals/Payments ---
// --- Withdrawals/Payments ---
const AffiliatePayments = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [stats, setStats] = useState({ available: 0, pending: 0, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");

  const fetch_ = async () => {
    if (!user) return;

    // 1. Fetch Withdrawals
    const { data: wData } = await (supabase.from("withdrawals" as any) as any).select("*").eq("affiliate_id", user.id).order("created_at", { ascending: false });
    setWithdrawals(wData || []);

    // 2. Fetch Completed Commissions
    const { data: cData } = await supabase.from("commissions").select("amount").eq("affiliate_id", user.id).eq("status", "completed");
    const totalEarned = (cData || []).reduce((sum, c: any) => sum + Number(c.amount), 0);

    // 3. Fetch Processed/Pending Withdrawals
    const withdrawn = (wData || []).filter((w: any) => w.status !== "failed").reduce((sum, w: any) => sum + Number(w.amount), 0);
    const pendingW = (wData || []).filter((w: any) => w.status === "pending" || w.status === "processing").reduce((sum, w: any) => sum + Number(w.amount), 0);

    setStats({
      available: Math.max(0, totalEarned - withdrawn),
      pending: pendingW,
      total: withdrawn
    });
  };

  useEffect(() => { fetch_(); }, [user]);

  const handleWithdraw = async () => {
    if (!user || !profile) return;
    const val = Number(amount);
    if (val < 10) { toast({ title: "Minimum $10", variant: "destructive" }); return; }
    if (val > stats.available) { toast({ title: "Insufficient Balance", variant: "destructive" }); return; }
    if (!profile.momo_number) { toast({ title: "Setup Payment Details", description: "Go to Settings to add your MoMo number.", variant: "destructive" }); return; }

    const { error } = await supabase.functions.invoke("korapay-payout", {
      body: { amount: val, role: 'affiliate' }
    });

    if (error) {
      toast({ title: "Withdrawal Failed", description: error.message || "An error occurred with the payout.", variant: "destructive" });
      return;
    }

    toast({ title: "Withdrawal Processed!", description: "Funds have been sent to your wallet." });
    setAmount("");
    setShowForm(false);
    fetch_();
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Vault Control</h2>
          <p className="text-muted-foreground font-medium">Manage your earnings and request payouts.</p>
        </div>
        <div className="p-8 rounded-[3rem] bg-primary text-white shadow-2xl shadow-primary/30 flex items-center gap-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Available to Withdraw</p>
            <p className="text-4xl font-black italic">${stats.available.toLocaleString()}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="h-14 rounded-2xl font-black text-sm uppercase px-8">
            {showForm ? "Cancel" : "Withdraw Now"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="p-10 rounded-[3rem] glass shadow-2xl animate-in zoom-in-95 duration-500 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-primary tracking-widest pl-2">Withdrawal Amount ($)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">$</span>
              <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="h-20 rounded-[1.5rem] bg-secondary/50 border-none font-black text-3xl pl-12 pr-6" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground pl-2 italic">Funds will be sent to: {profile?.momo_number} ({profile?.momo_provider})</p>
          </div>
          <Button onClick={handleWithdraw} className="w-full h-20 rounded-[1.5rem] font-black text-xl uppercase tracking-tight shadow-xl shadow-primary/20">Initate Transfer</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-[3.5rem] glass space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Summary Stats</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase">Pending Clear</p>
              <p className="text-2xl font-black text-foreground">${stats.pending.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase">Lifetime Paid</p>
              <p className="text-2xl font-black text-foreground">${stats.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3.5rem] glass space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Recent Transfers</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
            {withdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-all">
                <div>
                  <p className="font-extrabold text-foreground italic">-${Number(w.amount).toFixed(2)}</p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">{new Date(w.created_at).toLocaleDateString()}</p>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border-none ${w.status === 'completed' ? 'bg-success/20 text-success' : w.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                  {w.status}
                </Badge>
              </div>
            ))}
            {withdrawals.length === 0 && <p className="text-center text-muted-foreground text-xs font-medium italic py-10">No withdrawal history yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const AffiliateReports = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      const { data } = await supabase.from("commissions").select("*").eq("affiliate_id", user.id).order("created_at", { ascending: false });
      setReport(data || []);
    };
    fetch_();
  }, [user]);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Combat Ledger</h2>
          <p className="text-muted-foreground font-medium">Detailed performance and conversion tracking.</p>
        </div>
        <BarChart3 className="h-10 w-10 text-primary" />
      </div>

      <div className="p-10 rounded-[3.5rem] glass overflow-hidden">
        <div className="grid grid-cols-1 gap-4">
          {report.map(r => (
            <div key={r.id} className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30 border border-transparent hover:border-border transition-all">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-black text-foreground italic">Sale Commission</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase">{new Date(r.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-foreground italic">+${Number(r.amount).toFixed(2)}</p>
                <Badge className={`border-none text-[8px] font-black uppercase ${r.status === 'completed' ? 'bg-success/20 text-success' : 'bg-amber-500/10 text-amber-500'}`}>{r.status}</Badge>
              </div>
            </div>
          ))}
          {report.length === 0 && <p className="text-center py-20 text-muted-foreground font-medium italic">No combat data recorded yet. Get out there and hunt!</p>}
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
const AffiliateDashboard = () => {
  const { user, isLoading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else if (!profile?.package_tier) {
        navigate("/become-affiliate");
      }
    }
  }, [user, isLoading, profile, navigate]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !profile?.package_tier) return null;

  return (
    <>
      <Routes>
        <Route element={<DashboardLayout type="affiliate" />}>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<AffiliateProducts />} />
          <Route path="links" element={<AffiliateLinks />} />
          <Route path="deep-links" element={<DeepLinkGenerator />} />
          <Route path="balance" element={<WithdrawalBalanceCard />} />
          <Route path="projection" element={<EarningsProjection />} />
          <Route path="smart-links" element={<SmartLinkCustomizer />} />
          
          <Route path="calendar" element={<EarningsCalendar />} />
          <Route path="funnel" element={<ConversionFunnel />} />
          <Route path="top-products" element={<TopProductsCarousel />} />
          <Route path="notifications" element={<NotificationsCenter />} />
          <Route path="resources" element={<MarketingResources />} />
          <Route path="goals" element={<GoalTracker />} />
          <Route path="channels" element={<ChannelAttribution />} />
          <Route path="referrals" element={<ReferralProgram />} />
          <Route path="tax-docs" element={<TaxDocumentGenerator />} />
          <Route path="reports" element={<AffiliateReports />} />
          <Route path="contests" element={<AffiliatePrizes />} />
          <Route path="leaderboard" element={<AffiliateLeaderboard />} />
          <Route path="membership" element={<div>Membership Module (Coming Soon)</div>} />
          <Route path="prizes" element={<AffiliatePrizes />} />
          <Route path="payments" element={<AffiliatePayments />} />
          <Route path="community" element={<div>Community Module (Coming Soon)</div>} />
          <Route path="blogs" element={<div>News Module (Coming Soon)</div>} />
          <Route path="settings" element={<AffiliateSettings />} />
        </Route>
      </Routes>
      <HelpAI />
    </>
  );
};

export default AffiliateDashboard;
