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
  Monitor,
  User as UserIcon,
  Shield,
  Settings as SettingsIcon,
  HelpCircle,
  Clock,
  Gift,
  Smartphone,
  Package,
  RefreshCw,
  AlertCircle
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
        <StatsCard title="Total Earnings" value={`$${earnings?.toLocaleString()}`} icon={Wallet} trend="+22.4% vs last period" />
        <StatsCard title="Total Clicks" value="12,842" icon={MousePointerClick} trend="+840 New Today" />
        <StatsCard title="Sales Rate" value="4.8%" icon={Target} trend="Market Avg: 3.2%" />
        <StatsCard title="Your Plan" value={packageType || 'Basic'} icon={Award} trend={`${userPkg?.commission}% Commission Rate`} />
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

const AffiliateContests = () => {
  const { contests } = useData();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Accelerator Lab.</h2>
        <p className="text-muted-foreground font-medium italic">High-yield operational targets with decentralized reward protocols.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contests.map(contest => (
          <div key={contest.id} className="p-8 rounded-[3rem] bg-card border-2 border-border relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center"><Trophy className="h-6 w-6 text-primary" /></div>
              <Badge className="bg-success text-white border-none uppercase font-black text-[8px] px-4 py-1">{contest.status}</Badge>
            </div>
            <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tight mb-3">{contest.title}</h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed italic">{contest.description}</p>
            <div className="space-y-6">
              <div className="flex justify-between text-xs font-black uppercase"><span className="text-muted-foreground">Target Score</span><span className="text-foreground">{contest.target.toLocaleString()} Conversions</span></div>
              <div className="flex justify-between text-xs font-black uppercase"><span className="text-muted-foreground">Fixed Reward</span><span className="text-primary text-xl">${contest.reward.toLocaleString()}</span></div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: '42%' }} /></div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase text-center italic">{contest.participants} Nodes Currently Competing</p>
              <Button className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-[10px]">Initialize Protocol</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AffiliatePrizes = () => {
  const { earnings } = useAuth();
  const { toast } = useToast();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Capital Portal.</h2>
        <p className="text-muted-foreground font-medium italic">Execute reward claims and capital extraction through verified routes.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Wallet className="h-32 w-32" /></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Total Redeemable Assets</p>
          <h3 className="text-6xl font-black tracking-tighter italic mb-10">${earnings.toLocaleString()}</h3>
          <div className="space-y-4">
            <Input placeholder="Authorized Wallet Address" className="h-16 bg-white/5 border-white/10 text-white rounded-2xl px-6 font-bold" />
            <Button onClick={() => toast({ title: "Extraction Initiated", description: "Authorization signal sent to the ledger." })} className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest">Execute Claim</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-8 rounded-[2rem] bg-card border-2 border-border shadow-xl">
            <h4 className="text-xs font-black uppercase italic mb-4">Auth Status</h4>
            <div className="flex items-center gap-3 text-success font-black text-sm uppercase"> <ShieldCheck className="h-4 w-4" /> Node Verified </div>
          </div>
          <div className="p-8 rounded-[2rem] bg-secondary/50 border-2 border-border">
            <p className="text-[10px] font-black uppercase italic text-muted-foreground leading-relaxed">Claims are processed within 2-4 operational hours following network validation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AffiliateMembership = () => {
  const { packageType, setPackageType } = useAuth();
  const { packages } = useData();
  const { toast } = useToast();

  const upgrade = (tier: string) => {
    setPackageType(tier as any);
    toast({ title: "Node Reconfigured", description: `Authorized to level ${tier.toUpperCase()}.` });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Node Capacity.</h2>
        <p className="text-muted-foreground font-medium italic">Upgrade your operational interface to access higher-yield rewards.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map(pkg => (
          <div key={pkg.name} className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col ${packageType === pkg.name ? "bg-primary text-white border-primary shadow-2xl" : "bg-card border-border hover:border-primary/50"}`}>
            <h3 className="text-xl font-black italic uppercase mb-2">{pkg.name} Tier</h3>
            <p className="text-3xl font-black mb-10 tracking-tighter">${pkg.price}<span className="text-xs font-bold opacity-60">/yr</span></p>
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-center gap-3 text-xs font-black uppercase"><Zap className="h-4 w-4 opacity-40" /> {pkg.commission}% Base Yield</div>
              <div className="flex items-center gap-3 text-xs font-black uppercase"><Clock className="h-4 w-4 opacity-40" /> {pkg.payoutSchedule}</div>
            </div>
            <Button
              disabled={packageType === pkg.name}
              onClick={() => upgrade(pkg.name)}
              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] ${packageType === pkg.name ? "bg-white/20 text-white border-none cursor-default" : "bg-foreground text-background"}`}
            >
              {packageType === pkg.name ? "Current Protocol" : "Authorize Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AffiliateLeaderboard = () => {
  const { leaderboard } = useData();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Social Ledger.</h2>
        <p className="text-muted-foreground font-medium italic">Global node rankings based on real-time conversion velocity.</p>
      </div>
      <div className="rounded-[3rem] border-2 border-border bg-card overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-secondary/30 border-b-2 border-border"><tr className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground"><th className="px-8 py-6">Operational Rank</th><th className="px-8 py-6">Partner Identity</th><th className="px-8 py-6">Yield Index</th><th className="px-8 py-6 text-right">Tier Status</th></tr></thead>
          <tbody className="divide-y-2 divide-border">
            {leaderboard.map(entry => (
              <tr key={entry.rank} className="hover:bg-secondary/10 transition-all font-bold text-sm h-24">
                <td className="px-8"><span className={`h-10 w-10 flex items-center justify-center rounded-full font-black italic border-2 ${entry.rank <= 3 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-secondary text-foreground border-border'}`}>{entry.rank}</span></td>
                <td className="px-8"><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center font-black text-xs text-background">{entry.name.charAt(0)}</div><p className="uppercase italic">{entry.name}</p></div></td>
                <td className="px-8"><p className="text-lg font-black text-foreground italic">${entry.earnings.toLocaleString()}</p></td>
                <td className="px-8 text-right"><Badge className="bg-secondary text-foreground border-none font-black text-[8px] uppercase">{entry.tier}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AffiliateCommunity = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Institutional Bridge active. How can I assist your operational scaling today?' }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    const userIn = input;
    setInput("");

    // Mock Gemini response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `Analyzing operational telemetry for: "${userIn}". I recommend optimizing your Route Links via the Vault module for a 15% increase in conversion velocity.` }]);
    }, 1000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Operational Bridge.</h2>
        <p className="text-muted-foreground font-medium italic">Direct relay to Gemini-powered institutional intelligence.</p>
      </div>
      <div className="h-[600px] rounded-[3rem] border-2 border-border bg-card flex flex-col shadow-2xl relative overflow-hidden">
        <div className="p-8 border-b border-border bg-secondary/30 flex items-center justify-between"><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center"><Brain className="h-6 w-6 text-white" /></div><h3 className="text-sm font-black uppercase tracking-widest">Gemini Operational Liaison</h3></div><Badge className="bg-success text-white border-none animate-pulse">Sync Active</Badge></div>
        <div className="flex-1 overflow-auto p-8 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed italic ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none border border-border'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 border-t border-border flex items-center gap-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Signal Gemini Intelligent Relay..." className="h-14 bg-secondary border-none rounded-2xl px-6 font-bold" />
          <Button onClick={sendMessage} className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-105 transition-transform"><MessageSquare className="h-5 w-5" /></Button>
        </div>
      </div>
    </div>
  );
};

const AffiliateBlogs = () => {
  const { blogs } = useData();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Market Insights.</h2>
        <p className="text-muted-foreground font-medium italic">Institutional intelligence streams for high-performance referral nodes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {blogs.map(blog => (
          <div key={blog.id} className="group cursor-pointer">
            <div className="aspect-[16/10] rounded-[3rem] overflow-hidden mb-6 relative border border-border">
              <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent p-10 flex flex-col justify-end">
                <Badge className="w-fit mb-4 bg-primary text-white border-none uppercase font-black text-[8px] px-4 py-1">{blog.category}</Badge>
                <h3 className="text-3xl font-black text-foreground tracking-tighter leading-none italic uppercase">{blog.title}</h3>
              </div>
            </div>
            <div className="flex items-center justify-between px-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">{blog.author} • {blog.date}</p>
              <ArrowUpRight className="h-5 w-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AffiliateSettings = () => {
  const { affiliateName, affiliateId } = useAuth();
  const { toast } = useToast();
  const [subTab, setSubTab] = useState("profile");

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-2">My Settings</h2>
        <p className="text-muted-foreground font-medium italic">Update your profile, account security, and payment information.</p>
      </div>

      <div className="flex gap-6 border-b border-border pb-6 overflow-x-auto scrollbar-hide">
        {[
          { id: "profile", label: "Profile", icon: UserIcon },
          { id: "account", label: "Account", icon: Shield },
          { id: "payment", label: "Payments", icon: Wallet },
          { id: "pref", label: "Preferences", icon: SettingsIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em] ${subTab === tab.id ? 'bg-primary text-white shadow-lg' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {subTab === "profile" && (
          <>
            <div className="p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label><Input defaultValue={affiliateName} className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Username</label><Input defaultValue={affiliateId} className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label><Input defaultValue="affiliate@example.com" className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone Number</label><Input placeholder="+233..." className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Bio / Bio-Brief</label><textarea className="w-full h-32 rounded-2xl bg-secondary border-none font-bold p-6 text-sm outline-none resize-none" placeholder="Tell us a little about your marketing experience..."></textarea></div>
              </div>
            </div>
            <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
              <div className="h-32 w-32 rounded-[2.5rem] bg-primary mx-auto mb-8 flex items-center justify-center text-5xl font-black"> {affiliateName?.charAt(0)} </div>
              <h4 className="text-2xl font-black italic uppercase text-white mb-2">{affiliateName}</h4>
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-10">Affiliate Account</p>
              <Button onClick={() => toast({ title: "Profile Updated", description: "All changes have been saved successfully." })} className="w-full h-16 rounded-3xl bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30">Save Profile changes</Button>
            </div>
          </>
        )}

        {subTab === "account" && (
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl space-y-10">
            <div className="flex items-center gap-4"> <h3 className="text-xl font-black uppercase tracking-tight">Security & Account</h3> </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-muted-foreground italic mb-4">Change Password</h4>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Current Password</label><Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">New Password</label><Input type="password" placeholder="••••••••" className="h-14 rounded-2xl bg-secondary border-none font-bold" /></div>
              </div>
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-muted-foreground italic mb-4">Account Protection</h4>
                <div className="p-8 rounded-3xl bg-secondary/50 border-2 border-dashed border-border flex flex-col justify-center space-y-4">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase opacity-60">Two-Factor Authentication (2FA)</span><Badge className="bg-success text-white border-none uppercase font-black text-[8px]">Enabled</Badge></div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed italic">Your account is highly secure. You'll need a code from your phone to login.</p>
                  <Button variant="outline" className="h-12 rounded-xl text-[10px] uppercase font-black">Manage 2FA Settings</Button>
                </div>
                <div className="p-8 rounded-3xl bg-red-500/5 border-2 border-red-500/10 space-y-4">
                  <div className="flex items-center gap-3"><AlertCircle className="h-4 w-4 text-red-500" /><span className="text-[10px] font-black uppercase text-red-500">Danger Zone</span></div>
                  <Button variant="ghost" className="w-full text-red-500 hover:bg-red-500/10 font-bold text-xs uppercase text-left justify-start">Delete My Affiliate Account</Button>
                </div>
              </div>
            </div>
            <Button onClick={() => toast({ title: "Account Secured", description: "Security settings have been applied." })} className="w-full h-16 rounded-3xl bg-foreground text-background font-black uppercase text-xs tracking-widest">Update Security Settings</Button>
          </div>
        )}

        {subTab === "payment" && (
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl space-y-10">
            <div className="flex items-center gap-4"> <h3 className="text-xl font-black uppercase tracking-tight">Payment Methods</h3> </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[2rem] bg-secondary/50 space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground italic">Preferred Withdrawal Channel</h4>
                  <div className="space-y-4">
                    {["Bank Transfer", "Mobile Money (MTN/AirtelTigo)", "Crypto Wallet (USDT)"].map(m => (
                      <div key={m} className="p-4 rounded-xl bg-background border border-border flex items-center justify-between cursor-pointer hover:border-primary">
                        <span className="text-[10px] font-black uppercase">{m}</span>
                        <div className="h-4 w-4 rounded-full border-2 border-primary" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-10 rounded-[2rem] border-2 border-border space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground italic">Payment Details</h4>
                  <div className="space-y-4">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-60">Full Bank / Account Name</label><Input className="h-12 rounded-xl bg-secondary border-none font-bold" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-60">Account Number / IBAN / Wallet ID</label><Input className="h-12 rounded-xl bg-secondary border-none font-bold" /></div>
                  </div>
                </div>
              </div>
              <div className="p-10 rounded-[2rem] bg-foreground text-background flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign className="h-20 w-20" /></div>
                <div>
                  <h4 className="text-lg font-black italic uppercase mb-1">Minimum Payment Threshold</h4>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">You will be paid once your balance hits this amount.</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-primary">$100.00</span>
                  <Button size="sm" variant="outline" className="h-10 px-4 rounded-xl border-white/20 bg-white/10 font-black text-[10px] uppercase">Edit</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {subTab === "pref" && (
          <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl space-y-10">
            <div className="flex items-center gap-4"> <h3 className="text-xl font-black uppercase tracking-tight">App Preferences</h3> </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Display Currency</label>
                  <select className="w-full h-14 rounded-2xl bg-secondary border-none font-bold px-6 text-sm outline-none appearance-none">
                    <option>USD ($)</option>
                    <option>GHS (₵)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-muted-foreground ml-2">System Language</label>
                  <select className="w-full h-14 rounded-2xl bg-secondary border-none font-bold px-6 text-sm outline-none appearance-none">
                    <option>English</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-secondary/30 space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground italic">Notification Settings</h4>
                  {["New Sale Notification", "Contest Update Alert", "Withdrawal Status Signal"].map(n => (
                    <div key={n} className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase">{n}</span>
                      <div className="h-6 w-11 bg-primary rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-md" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
    if (path.includes("/links")) return "links";
    if (path.includes("/contests")) return "contests";
    if (path.includes("/leaderboard")) return "leaderboard";
    if (path.includes("/membership")) return "membership";
    if (path.includes("/prizes")) return "prizes";
    if (path.includes("/payments")) return "payments";
    if (path.includes("/community")) return "community";
    if (path.includes("/blogs")) return "blogs";
    if (path.includes("/settings")) return "settings";
    return "overview";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="affiliate" />
      <main className="flex-1 overflow-auto bg-transparent">
        <header className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl border-b border-border px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[2.2rem] bg-foreground flex items-center justify-center shadow-2xl relative">
                <LayoutDashboard className="h-8 w-8 text-background" />
                <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full border-4 border-background animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">
                  {activeTab === "overview" && "Dashboard"}
                  {activeTab === "marketplace" && "Marketplace"}
                  {activeTab === "links" && "My Links"}
                  {activeTab === "contests" && "Contests"}
                  {activeTab === "leaderboard" && "Leaderboard"}
                  {activeTab === "membership" && "Membership"}
                  {activeTab === "prizes" && "Prizes / Rewards"}
                  {activeTab === "payments" && "Withdrawals"}
                  {activeTab === "community" && "Support Chat"}
                  {activeTab === "blogs" && "Blogs & news"}
                  {activeTab === "settings" && "My Settings"}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 bg-primary/10 text-primary border-primary/20">Ready</Badge>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-nowrap"><Activity className="h-3 w-3 text-success" /> System active</span>
                    <span className="flex items-center gap-2 text-nowrap"><Globe className="h-3 w-3" /> Global Network</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-widest gap-2">
                <Copy className="h-4 w-4 text-primary" /> Copy Link
              </Button>
            </div>
          </div>
        </header>
        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "marketplace" && <AffiliateMarketplace />}
          {activeTab === "links" && <AffiliateLinks />}
          {activeTab === "contests" && <AffiliateContests />}
          {activeTab === "leaderboard" && <AffiliateLeaderboard />}
          {activeTab === "membership" && <AffiliateMembership />}
          {activeTab === "prizes" && <AffiliatePrizes />}
          {activeTab === "payments" && <AffiliatePayments />}
          {activeTab === "community" && <AffiliateCommunity />}
          {activeTab === "blogs" && <AffiliateBlogs />}
          {activeTab === "settings" && <AffiliateSettings />}
        </div>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
