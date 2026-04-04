import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Wallet,
  Copy,
  Check,
  Trophy,
  Award,
  LayoutDashboard,
  Store,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  ArrowUpRight,
  Zap,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Star,
  Brain,
  Rocket,
  ShieldCheck,
  Target,
  FileText,
  Mail,
  Share2,
  FileImage,
  Layers,
  Activity,
  ArrowRight,
  MessageSquare,
  Globe,
  Edit,
  Download,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Monitor
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Link, useLocation } from "react-router-dom";
import StatsCard from "@/components/StatsCard";
import { earningsData, Product } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- Sub-Components ---

const DashboardOverview = () => {
  const { affiliateLink, packageType, earnings } = useAuth();
  const { products: systemProducts, packages } = useData();
  const { toast } = useToast();

  const userPkg = packages.find(p => p.name === packageType) || packages[0];

  const filteredProducts = useMemo(() => {
    const tierRank = { "Basic": 0, "Standard": 1, "Pro": 2 };
    const userRank = tierRank[(packageType as any) || "Basic"];
    return systemProducts.filter(p => tierRank[p.minimumTier as keyof typeof tierRank] <= userRank);
  }, [systemProducts, packageType]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Gross Yield" value={`$${earnings?.toLocaleString()}`} icon={Wallet} trend="+22.4% vs last period" />
        <StatsCard title="Click Routing" value="12,842" icon={MousePointerClick} trend="+840 New Today" />
        <StatsCard title="Conv. Index" value="4.8%" icon={Target} trend="Market Avg: 3.2%" />
        <StatsCard title="Partner Tier" value={packageType || 'Basic'} icon={Award} trend={`${userPkg?.commission}% Baseline Yield`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Yield Velocity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Earnings</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '2px solid hsl(var(--border))', borderRadius: '1.5rem', fontWeight: 900 }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#yieldColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Brain className="h-24 w-24" /></div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Growth Engine</h3>
          <div className="space-y-6 flex-1">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-black uppercase opacity-60 mb-2">Recommended Strategy</p>
              <p className="text-sm font-bold italic leading-relaxed">System predicts a 15% yield increase if you deploy "Cloud Infrastructure" assets today.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase"><span>Tier Elevation</span><span>72%</span></div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: '72%' }} /></div>
            </div>
          </div>
          <Button onClick={() => toast({ title: "Module Deployed", description: "Optimization engine started." })} className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest mt-8">Scale Operation</Button>
        </div>
      </div>
    </div>
  );
};

const AffiliateLinks = () => {
  const { affiliateLink } = useAuth();
  const { toast } = useToast();
  const [customSlug, setCustomSlug] = useState("");

  const copyGeneralLink = () => {
    const link = `${window.location.origin}?ref=${affiliateLink}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Identity Root Copied", description: "Redirect protocol established." });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Link Generator.</h2>
        <p className="text-muted-foreground font-medium italic">Construct clean, cloaked routing identities for your campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] bg-card border-2 border-border space-y-8">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Standard Routing</h3>
          <div className="p-6 rounded-2xl bg-secondary space-y-4">
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase opacity-60 italic">Your Unique Protocol ID</span><Badge className="bg-primary/10 text-primary border-none">Active</Badge></div>
            <div className="flex items-center gap-4">
              <code className="flex-1 p-4 rounded-xl bg-background font-mono text-xs font-black text-primary overflow-x-auto whitespace-nowrap">{affiliateLink}</code>
              <Button onClick={copyGeneralLink} className="h-12 w-12 rounded-xl p-0"><Copy className="h-5 w-5" /></Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Custom Asset Slug (Cloaking)</label>
            <div className="flex items-center gap-4">
              <Input value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} placeholder="summer-sale" className="h-14 rounded-xl bg-secondary border-none font-bold" />
              <Button className="h-14 px-8 rounded-xl font-black text-xs uppercase tracking-widest">Generate</Button>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-foreground text-background space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-4"><Download className="h-8 w-8 text-primary" /><h3 className="text-xl font-black italic uppercase text-white">Resource Library</h3></div>
          <div className="space-y-4">
            {[
              { name: "Promotional Banner A (728x90)", type: "Digital Asset" },
              { name: "Executive Email Template", type: "Deployment Doc" },
              { name: "Social Media Identity Kit", type: "Brand Kit" }
            ].map(item => (
              <div key={item.name} className="p-5 border border-white/10 rounded-2xl bg-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                <div><p className="text-xs font-black uppercase text-white/80">{item.name}</p><p className="text-[10px] font-bold text-white/40 italic">{item.type}</p></div>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-2 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AffiliatePayments = () => {
  const { earnings } = useAuth();
  const { payouts } = useData();
  const userPayouts = payouts.filter(p => p.userId === "1"); // Simulating finding session user's payouts

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Payout Journal.</h2><p className="text-muted-foreground font-medium italic">Track your institutional capital distributions and history.</p></div>
        <div className="p-6 rounded-3xl bg-secondary flex items-center gap-8 shadow-xl border border-border">
          <div className="text-right border-r border-border pr-8"><p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Withdrawable</p><p className="text-2xl font-black text-foreground italic">${earnings?.toLocaleString()}</p></div>
          <Button className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20">Withdraw Protocal</Button>
        </div>
      </div>

      <div className="rounded-[3rem] border-2 border-border bg-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b-2 border-border bg-secondary/30"><tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"><th className="px-8 py-6">Trace ID</th><th className="px-8 py-6">Amount</th><th className="px-8 py-6">Vault Method</th><th className="px-8 py-6">Auth Status</th><th className="px-8 py-6">Invoice</th></tr></thead>
          <tbody className="divide-y-2 divide-border">
            {userPayouts.map((p) => (
              <tr key={p.id} className="group hover:bg-secondary/10 transition-all font-bold text-sm">
                <td className="px-8 py-6 text-foreground opacity-60">{p.invoiceId}</td>
                <td className="px-8 py-6 text-xl font-black italic text-foreground">${p.amount.toLocaleString()}</td>
                <td className="px-8 py-6 uppercase text-[10px] italic">{p.method}</td>
                <td className="px-8 py-6"><Badge className={`text-[8px] font-black uppercase border-none ${p.status === 'PROCESSED' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>{p.status}</Badge></td>
                <td className="px-8 py-6"><Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl"><FileText className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AffiliateAnalytics = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard title="Device Profile" value="64% Mobile" icon={Smartphone} trend="Optimal Inflow" />
        <StatsCard title="Traffic Nodes" value="Ghana, Nigeria" icon={Globe} trend="Africa Primary" />
        <StatsCard title="Uptime Index" value="100%" icon={ShieldCheck} trend="Zero Drops" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl">
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Performance Mix</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Direct', value: 400 }, { name: 'Social', value: 300 }, { name: 'Search', value: 300 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--secondary))" />
                  <Cell fill="hsl(var(--foreground))" />
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl">
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Click Frequency</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData.slice(-7)}>
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const AffiliateMarketplace = () => {
  const { packageType, affiliateLink } = useAuth();
  const { products: systemProducts } = useData();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    const tierRank = { "Basic": 0, "Standard": 1, "Pro": 2 };
    const userRank = tierRank[(packageType as any) || "Basic"];
    return systemProducts.filter(p => tierRank[p.minimumTier as keyof typeof tierRank] <= userRank);
  }, [systemProducts, packageType]);

  const copyLink = (productId: string) => {
    const link = `${window.location.origin}/product/${productId}?ref=${affiliateLink}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Protocol Copied", description: "Your unique tracking URL is ready for deployment." });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Vault Marketplace.</h2><p className="text-muted-foreground font-medium italic">Deploy institutional assets verified for your current tier.</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((p) => (
          <div key={p.id} className="p-8 rounded-[3rem] bg-card border-2 border-border hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="h-48 rounded-3xl overflow-hidden mb-6 relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20"><Store className="h-5 w-5 text-white" /></div>
              <div className="absolute bottom-4 left-4"><Badge className="bg-primary text-white border-none text-[8px] uppercase tracking-widest px-3 py-1 rounded-full">{p.minimumTier} Tier</Badge></div>
            </div>
            <h4 className="text-xl font-black text-foreground italic uppercase tracking-tighter mb-2">{p.title}</h4>
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <span className="text-2xl font-black text-primary">${p.price}</span>
              <Button onClick={() => copyLink(p.id)} className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-foreground text-background">Deploy Link</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AffiliateSupport = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl space-y-8">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Support Protocol</h3>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex items-center gap-4"><MessageSquare className="h-6 w-6 text-primary" /><div><p className="text-sm font-black uppercase">Technical Integration Issue</p><p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Ticket #4820 • Open</p></div></div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
          </div>
          <Button className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase text-xs tracking-widest">Construct New Request</Button>
        </div>
        <div className="p-10 rounded-[3rem] bg-foreground text-background space-y-8 relative overflow-hidden flex flex-col items-center text-center">
          <HelpCircle className="h-16 w-16 text-primary mb-2" />
          <h3 className="text-xl font-black italic uppercase text-white">Knowledge Mesh</h3>
          <p className="text-sm opacity-60 leading-relaxed font-medium italic mb-6">Access institutional tutorials and protocol documentation.</p>
          <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-xs tracking-widest text-primary">Access Vault</Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Affiliate Dashboard Component ---

const AffiliateDashboard = () => {
  const location = useLocation();

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/marketplace")) return "marketplace";
    if (path.includes("/routes") || path.includes("/links")) return "links";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/journal") || path.includes("/payouts")) return "payments";
    if (path.includes("/relay") || path.includes("/support")) return "support";
    if (path.includes("/settings")) return "settings";
    return "overview";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="affiliate" />
      <main className="flex-1 overflow-auto bg-transparent">
        <div className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl border-b border-border px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[2.2rem] bg-foreground flex items-center justify-center shadow-2xl relative">
                <LayoutDashboard className="h-8 w-8 text-background" />
                <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full border-4 border-background animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground italic tracking-tight uppercase">Partner Console.</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 bg-primary/10 text-primary border-primary/20">Operational</Badge>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-success" /> Live Streams</span>
                    <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> GH Hub Secured</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-widest gap-2">
                <Copy className="h-4 w-4 text-primary" /> Root Link
              </Button>
            </div>
          </div>
          <nav className="flex gap-8 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "overview", label: "HUD", to: "/dashboard/affiliate", icon: BarChart3 },
              { id: "marketplace", label: "Vault", to: "/dashboard/affiliate/marketplace", icon: Store },
              { id: "links", label: "Routes", to: "/dashboard/affiliate/links", icon: LinkIcon },
              { id: "analytics", label: "Insights", to: "/dashboard/affiliate/analytics", icon: Activity },
              { id: "payments", label: "Journal", to: "/dashboard/affiliate/payments", icon: Wallet },
              { id: "support", label: "Relay", to: "/dashboard/affiliate/support", icon: MessageSquare },
              { id: "settings", label: "Settings", to: "/dashboard/affiliate/settings", icon: Settings },
            ].map(tab => (
              <Link key={tab.id} to={tab.to} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pb-4 border-b-4 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`} >
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "marketplace" && <AffiliateMarketplace />}
          {activeTab === "links" && <AffiliateLinks />}
          {activeTab === "analytics" && <AffiliateAnalytics />}
          {activeTab === "payments" && <AffiliatePayments />}
          {activeTab === "support" && <AffiliateSupport />}
          {activeTab === "settings" && <div className="text-center font-black italic opacity-20 uppercase mt-20">Settings Module Loading...</div>}
        </div>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
