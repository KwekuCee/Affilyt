import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  DollarSign,
  ShieldAlert,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  AlertCircle,
  FileText,
  UserCheck,
  Ban,
  Fingerprint,
  Cpu,
  ArrowUpRight,
  MousePointerClick,
  Smartphone,
  Monitor,
  Calendar,
  Plus,
  Filter,
  RefreshCw,
  Mail,
  Trash2,
  Eye,
  Activity,
  Zap,
  Map as MapIcon,
  MessageSquare,
  Edit,
  Target,
  Globe2,
  Store,
  Settings as SettingsIcon,
  ChevronRight,
  Star,
  Globe,
  CreditCard,
  Server,
  LayoutDashboard,
  Layers,
  Settings,
  TrendingUp,
  Award
} from "lucide-react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useData, SellerTier, UserStatus, User, Payout, AnalyticsEvent } from "@/context/DataContext";

// --- Sub-Components ---

const AdminHUD = () => {
  const { toast } = useToast();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Real-time Inflow" value="$142.8K" icon={DollarSign} trend="+12.4% Growth" />
        <StatsCard title="Active Nodes" value="8,412" icon={Globe} trend="All regions green" />
        <StatsCard title="Conversion Velocity" value="8.4%" icon={Zap} trend="-1.2% vs last cycle" />
        <StatsCard title="Risk Level" value="Minimal" icon={ShieldCheck} trend="0 threats detected" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] bg-card border-2 border-border shadow-xl">
          <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">System Verification Stream</h3>
          <div className="space-y-6">
            {[
              { name: "Satoshi_N", action: "Requested Pro Access", status: "PENDING", time: "2m ago" },
              { name: "Vitalik_B", action: "KYC Verified", status: "SUCCESS", time: "15m ago" },
              { name: "Charles_H", action: "Payout Authorized ($12k)", status: "SUCCESS", time: "1h ago" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-secondary/50 border border-border group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center font-black text-xs text-background">{item.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-black uppercase text-foreground">{item.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-[8px] font-black uppercase px-3 py-0.5 rounded-full ${item.status === 'SUCCESS' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>{item.status}</Badge>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Cpu className="h-32 w-32" />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-tight mb-8 text-white">Institutional Capacity</h3>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Node Fulfillment</span>
                <span>84%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '84%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Security Protocol Uptime</span>
                <span>99.98%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: '99.9%' }} />
              </div>
            </div>
          </div>
          <Button className="w-full h-16 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest mt-12 group">
            Deploy System Update <RefreshCw className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { users, setUsers } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const toggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus: Record<UserStatus, UserStatus> = { "ACTIVE": "SUSPENDED", "SUSPENDED": "ACTIVE", "PENDING": "ACTIVE", "ARCHIVED": "ACTIVE" };
        const newStatus = nextStatus[u.status];
        toast({ title: `User ${newStatus}`, description: `${u.name} is now ${newStatus}.` });
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">User Matrix.</h2>
          <p className="text-muted-foreground font-medium italic">Comprehensive management of the global affiliate pool.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search identity..." className="h-14 pl-12 rounded-2xl bg-card border-2 border-border font-bold" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="group p-8 rounded-[3rem] bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 shadow-xl flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center font-black text-2xl text-primary border border-border">{user.name.charAt(0)}</div>
              <div>
                <h3 className="text-xl font-black text-foreground italic uppercase tracking-tight">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border-none ${user.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>{user.status}</Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{user.packageTier}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground italic">Cumulative Inflow</span><span className="text-foreground font-black">${user.earnings.toLocaleString()}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground italic">Route Traffic</span><span className="text-foreground font-black">{user.clicks.toLocaleString()} Clicks</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground italic">Trust Index</span><span className="text-xs font-black">{user.performanceScore}%</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Button onClick={() => toggleStatus(user.id)} variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary hover:bg-red-500/10 border-none">
                {user.status === 'ACTIVE' ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />} {user.status === 'ACTIVE' ? "Suspend" : "Activate"}
              </Button>
              <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-foreground text-background border-none"> <Activity className="h-4 w-4" /> Inspect</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminInventory = () => {
  const { products: systemProducts, setProducts } = useData();
  const { toast } = useToast();

  const toggleTier = (productId: string) => {
    const tiers: SellerTier[] = ["Basic", "Standard", "Pro"];
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentIndex = tiers.indexOf(p.minimumTier);
        const nextTier = tiers[(currentIndex + 1) % tiers.length];
        return { ...p, minimumTier: nextTier };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Institutional Ledger.</h2>
          <p className="text-muted-foreground font-medium italic">Configure asset visibility across operational tiers.</p>
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl">
          <Plus className="h-5 w-5" /> Deploy New Asset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {systemProducts.map((p) => (
          <div key={p.id} className="p-8 rounded-[3rem] bg-card border-2 border-border hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className="h-48 rounded-3xl overflow-hidden mb-6 relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20"><Store className="h-5 w-5 text-white" /></div>
              <div className="absolute bottom-4 left-4">
                <Badge onClick={() => toggleTier(p.id)} className={`cursor-pointer border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full ${p.minimumTier === "Basic" ? "bg-slate-500 text-white" : p.minimumTier === "Standard" ? "bg-primary text-white" : "bg-amber-500 text-white"}`}>Tier: {p.minimumTier}</Badge>
              </div>
            </div>
            <h4 className="text-xl font-black text-foreground italic uppercase tracking-tighter mb-2">{p.title}</h4>
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <span className="text-2xl font-black text-primary">${p.price}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-10 w-10 px-0 rounded-xl border-2"><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" className="h-10 w-10 px-0 rounded-xl border-2 hover:bg-red-500/10 text-red-500 border-red-500/20"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminCommissions = () => {
  const { globalCommission, setGlobalCommission, minPayoutThreshold, setMinPayoutThreshold } = useData();
  const { toast } = useToast();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">Commission Mesh.</h2>
        <p className="text-muted-foreground font-medium italic">Configure institutional payout protocols and tier adjustments.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] bg-card border-2 border-border space-y-8">
          <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-primary" /></div><h3 className="text-xl font-black italic uppercase tracking-tight">Global Parameters</h3></div>
          <div className="space-y-6">
            <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Rate (%)</label><div className="flex items-center gap-4"><Input type="number" value={globalCommission} onChange={(e) => setGlobalCommission(Number(e.target.value))} className="h-16 rounded-2xl bg-secondary border-none font-black text-2xl px-6" /><Button onClick={() => toast({ title: "Settings Updated" })} className="h-16 px-8 rounded-2xl font-black uppercase text-xs tracking-widest">Seal</Button></div></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payout Threshold ($)</label><div className="flex items-center gap-4"><Input type="number" value={minPayoutThreshold} onChange={(e) => setMinPayoutThreshold(Number(e.target.value))} className="h-16 rounded-2xl bg-secondary border-none font-black text-2xl px-6" /><Button onClick={() => toast({ title: "Threshold Synchronized" })} className="h-16 px-8 rounded-2xl font-black uppercase text-xs tracking-widest">Seal</Button></div></div>
          </div>
        </div>
        <div className="p-10 rounded-[3rem] bg-foreground text-background space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4"><div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center"><Star className="h-6 w-6 text-primary" /></div><h3 className="text-xl font-black italic uppercase tracking-tight text-white">Tiered Bonus System</h3></div>
          <div className="space-y-4">
            {[{ label: "Elite (500+ Sales)", rate: "+5%" }, { label: "Veteran (200+ Sales)", rate: "+2%" }].map(tier => (
              <div key={tier.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest">{tier.label}</p><p className="text-2xl font-black text-primary">{tier.rate}</p></div><Badge className="bg-white/10 text-white border-none text-[8px] uppercase font-black px-4">Active</Badge></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPayouts = () => {
  const { payouts, setPayouts } = useData();
  const { toast } = useToast();
  const handleProcess = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "PROCESSED" } : p));
    toast({ title: "Funds Transmitted", description: "Capital has been routed successfully." });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Payout Portal.</h2><p className="text-muted-foreground font-medium italic">Approve and track global distributions.</p></div>
        <Button className="h-14 rounded-2xl bg-foreground text-background font-black uppercase text-xs tracking-widest gap-3 px-8 shadow-2xl"><Download className="h-5 w-5" /> Batch Protocol</Button>
      </div>
      <div className="rounded-[3rem] border-2 border-border bg-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b-2 border-border bg-secondary/30"><tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"><th className="px-8 py-6">Partner Identity</th><th className="px-8 py-6">Amount</th><th className="px-8 py-6">Method</th><th className="px-8 py-6">Status</th><th className="px-8 py-6 text-right">Auth</th></tr></thead>
          <tbody className="divide-y-2 divide-border">
            {payouts.map((p) => (
              <tr key={p.id} className="group hover:bg-secondary/10 transition-all font-bold text-sm">
                <td className="px-8 py-6"><p className="text-foreground italic uppercase">{p.userName}</p><p className="text-[10px] text-muted-foreground">{p.invoiceId}</p></td>
                <td className="px-8 py-6 text-lg font-black italic text-foreground">${p.amount}</td>
                <td className="px-8 py-6 uppercase text-[10px] opacity-60 italic">{p.method}</td>
                <td className="px-8 py-6"><Badge className={`text-[8px] font-black uppercase border-none ${p.status === 'PROCESSED' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>{p.status}</Badge></td>
                <td className="px-8 py-6 text-right">{p.status === 'PENDING' ? <Button onClick={() => handleProcess(p.id)} size="sm" className="h-10 px-6 rounded-xl font-black text-xs uppercase bg-primary text-white">Authorize</Button> : <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl"><FileText className="h-4 w-4" /></Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const { analytics } = useData();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Tracking Logs.</h2><p className="text-muted-foreground font-medium italic">High-fidelity real-time behavioral data streams.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Mean Depth" value="1.2M+" icon={Activity} trend="+15.4% Rise" />
        <StatsCard title="Mobile Route" value="64.2%" icon={Smartphone} trend="Majority Inflow" />
        <StatsCard title="Global Nodes" value="142" icon={Globe} trend="Active Regions" />
        <StatsCard title="Protocol Trust" value="99.98%" icon={ShieldCheck} trend="Verified" />
      </div>
      <div className="rounded-[3rem] border-2 border-border bg-card overflow-hidden">
        <div className="px-8 py-6 bg-secondary/30 border-b-2 border-border flex justify-between items-center"><h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Live Telemetry Stream</h3><Badge className="bg-success text-white border-none animate-pulse">Live</Badge></div>
        <div className="divide-y-2 divide-border">
          {analytics.slice(0, 10).map((event) => (
            <div key={event.id} className="p-6 flex items-center justify-between group hover:bg-secondary/10 transition-all">
              <div className="flex items-center gap-6"><div className={`h-12 w-12 rounded-xl flex items-center justify-center ${event.type === 'CONVERSION' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>{event.type === 'CONVERSION' ? <CheckCircle2 className="h-6 w-6" /> : <MousePointerClick className="h-6 w-6" />}</div><div><p className="font-black text-foreground italic uppercase text-sm">{event.type} Detected</p><p className="text-[10px] font-bold text-muted-foreground uppercase">IP: {event.ip} • Region: {event.geo}</p></div></div>
              <div className="text-right"><p className="text-sm font-black text-foreground">Auth: {event.affiliateId}</p><p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(event.timestamp).toLocaleTimeString()}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminFraud = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Risk Mesh.</h2><p className="text-muted-foreground font-medium italic">Autonomous fraud detection and compliance monitoring.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] border-2 border-border bg-card space-y-8">
          <div className="flex items-center gap-4"><ShieldAlert className="h-8 w-8 text-red-500" /><h3 className="text-xl font-black italic uppercase">Active Threats</h3></div>
          <div className="space-y-6">
            {[{ type: "IP COLLISION", desc: "Multiple identities sharing same route", level: "HIGH" }, { type: "VELOCITY GAP", desc: "Unusual click frequency detected", level: "MEDIUM" }].map(threat => (
              <div key={threat.type} className="p-6 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between"><div><p className="text-[10px] font-black text-red-500">{threat.type}</p><p className="text-sm font-bold text-muted-foreground italic">{threat.desc}</p></div><Badge variant="destructive" className="font-black text-[8px] uppercase">{threat.level}</Badge></div>
            ))}
          </div>
        </div>
        <div className="p-10 rounded-[3rem] bg-foreground text-background space-y-8 relative overflow-hidden"><div className="flex items-center gap-4"><UserCheck className="h-8 w-8 text-success" /><h3 className="text-xl font-black italic uppercase text-white">Compliance Protocols</h3></div><div className="space-y-4">{["GDPR Removal Protocol", "FTC Disclosure Monitor", "AML Verification Loop"].map(rule => (<div key={rule} className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-white/5"><CheckCircle2 className="h-5 w-5 text-success" /><span className="text-xs font-black uppercase text-white/80 italic">{rule}</span></div>))}</div></div>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const { landingContent, setLandingContent, exchangeRate, setExchangeRate } = useData();
  const { toast } = useToast();
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div><h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">System Config.</h2><p className="text-muted-foreground font-medium italic">Configure core platform parameters.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 rounded-[3rem] border-2 border-border bg-card space-y-6">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Exchange Mesh</h3>
          <div className="p-6 rounded-2xl bg-secondary space-y-4">
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase opacity-60 italic">USD / GHS (Live Rate)</span><Badge className="bg-primary/10 text-primary border-none">Active</Badge></div>
            <div className="flex items-center gap-4"><Input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} className="h-16 rounded-2xl bg-background border-none font-black text-2xl px-6" /><Button onClick={() => toast({ title: "Rate Synchronized" })} className="h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-widest">Update</Button></div>
          </div>
        </div>
        <div className="p-10 rounded-[3rem] border-2 border-border bg-card space-y-6">
          <h3 className="text-xl font-black italic uppercase tracking-tight">Front-End Protocol</h3>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-[10px] font-black uppercase text-muted-foreground">Heading Overlay</label><Input value={landingContent.heroTitle} onChange={(e) => setLandingContent({ ...landingContent, heroTitle: e.target.value })} className="h-14 rounded-xl bg-secondary border-none font-bold italic" /></div>
            <Button onClick={() => toast({ title: "Broadcast Successful" })} className="w-full h-14 rounded-xl font-black uppercase text-xs tracking-widest">Broadcast Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Dashboard Component ---

const AdminDashboard = () => {
  const location = useLocation();

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/users")) return "users";
    if (path.includes("/inventory")) return "inventory";
    if (path.includes("/commissions")) return "commissions";
    if (path.includes("/payouts")) return "payouts";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/fraud")) return "fraud";
    if (path.includes("/settings")) return "settings";
    return "overview";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="admin" />
      <main className="flex-1 overflow-auto bg-transparent">
        <div className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl border-b border-border px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[2.2rem] bg-foreground flex items-center justify-center shadow-2xl relative">
                <LayoutDashboard className="h-8 w-8 text-background" />
                <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full border-4 border-background animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground italic tracking-tight uppercase">SuperAdmin Console.</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 bg-primary/10 text-primary border-primary/20">System Root</Badge>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-nowrap">
                    <div className="flex items-center gap-2"><Globe className="h-3 w-3" /> Nodes Active</div>
                    <div className="flex items-center gap-2 text-success"><ShieldCheck className="h-3 w-3" /> Mesh Live</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-border pr-8 text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Global Treasury</p>
                <p className="text-lg font-black text-foreground italic">$2,142,500.00</p>
              </div>
              <Button className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] gap-3 shadow-2xl shadow-primary/20">
                <Cpu className="h-4 w-4" /> Hard Sync
              </Button>
            </div>
          </div>
          <nav className="flex gap-8 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "overview", label: "Overview", to: "/dashboard/admin", icon: BarChart3 },
              { id: "users", label: "Identity", to: "/dashboard/admin/users", icon: Users },
              { id: "inventory", label: "Assets", to: "/dashboard/admin/inventory", icon: Layers },
              { id: "commissions", label: "Rewards", to: "/dashboard/admin/commissions", icon: TrendingUp },
              { id: "payouts", label: "Capital", to: "/dashboard/admin/payouts", icon: CreditCard },
              { id: "analytics", label: "Behavior", to: "/dashboard/admin/analytics", icon: Activity },
              { id: "fraud", label: "Risk", to: "/dashboard/admin/fraud", icon: ShieldAlert },
              { id: "settings", label: "Config", to: "/dashboard/admin/settings", icon: Settings },
            ].map(tab => (
              <Link key={tab.id} to={tab.to} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pb-4 border-b-4 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`} >
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === "overview" && <AdminHUD />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "inventory" && <AdminInventory />}
          {activeTab === "commissions" && <AdminCommissions />}
          {activeTab === "payouts" && <AdminPayouts />}
          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "fraud" && <AdminFraud />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
