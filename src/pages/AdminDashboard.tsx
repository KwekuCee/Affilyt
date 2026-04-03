import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  DollarSign,
  Activity,
  Search,
  Globe,
  Server,
  Cpu,
  Map as MapIcon,
  ShieldAlert,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Target,
  Zap,
  Globe2,
  LayoutDashboard,
  Store,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight,
  Filter,
  Star
} from "lucide-react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { testimonials as initialTestimonials, products } from "@/lib/data";

const AdminHUD = () => {
  const [activeTab, setActiveTab] = useState('hud');
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (name: string) => {
    toast({
      title: "Partner Verified",
      description: `${name} has been granted high-level institutional access.`
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <nav className="flex gap-12 overflow-x-auto pb-4 scrollbar-hide border-b border-border">
        {[
          { id: 'hud', label: 'Global HUD', icon: MapIcon },
          { id: 'verification', label: 'Verification', icon: ShieldCheck },
          { id: 'risk', label: 'Risk Control', icon: ShieldAlert },
          { id: 'partners', label: 'Partner Matrix', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 pb-4 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'hud' && (
          <motion.div
            key="hud"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatsCard title="Real-time Inflow" value="$142.8K" icon={DollarSign} trend="+12.4% Growth" />
              <StatsCard title="Active Nodes" value="8,412" icon={Globe} trend="All regions green" />
              <StatsCard title="Conversion Velocity" value="8.4%" icon={Zap} trend="-1.2% vs last cycle" />
              <StatsCard title="Risk Level" value="Minimal" icon={ShieldCheck} trend="0 threats detected" />
            </div>
            <div className="h-[500px] rounded-[3rem] border-2 border-border bg-card p-10 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] group-hover:scale-110 transition-transform duration-1000" />
              <div className="text-center relative z-10 max-w-2xl">
                <Globe2 className="h-24 w-24 text-primary mx-auto mb-8 animate-pulse" />
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Global Traffic Matrix Active</h3>
                <p className="text-muted-foreground font-medium italic mt-4 text-lg">Visualizing 14.2M packets per second across elite partner edges. Institutional routing secured via quantum ledger synchronization.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="rounded-[3rem] border-2 border-border bg-card overflow-hidden">
              <div className="p-10 border-b border-border bg-secondary/20 flex items-center justify-between">
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Pending Authorizations.</h3>
                <Badge className="bg-primary/20 text-primary border-primary/20 rounded-full px-4 py-1">14 Operations Pending</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Target Principal</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Operational Package</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Security Score</th>
                      <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { name: "John Smith", tier: "Standard Tier", score: 94 },
                      { name: "Global Finance Ltd", tier: "Ultimate Tier", score: 98 },
                      { name: "Sarah Connor", tier: "Basic Tier", score: 82 },
                    ].map((partner) => (
                      <tr key={partner.name} className="group hover:bg-secondary/10 transition-colors">
                        <td className="px-10 py-8 font-black italic uppercase tracking-tight text-foreground">{partner.name}</td>
                        <td className="px-10 py-8">
                          <Badge variant="outline" className="text-[10px] font-bold border-2 px-3 py-1 bg-primary/5 text-primary border-primary/10 rounded-full">{partner.tier}</Badge>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black">{partner.score}%</span>
                            <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-success" style={{ width: `${partner.score}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <Button onClick={() => handleApprove(partner.name)} className="h-10 px-6 rounded-xl bg-success hover:bg-success/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-success/20">Authorize</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'risk' && (
          <motion.div
            key="risk"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-3 p-24 rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center bg-secondary/20">
              <ShieldAlert className="h-24 w-24 text-muted-foreground/30 mb-8" />
              <h4 className="text-3xl font-black italic text-muted-foreground uppercase">Risk Mitigation Engine Active.</h4>
              <p className="text-muted-foreground max-w-xl mt-4 font-medium italic text-lg leading-relaxed">Automated suppression of high-frequency invalid click-streams and fraudulent lead generation is fully operational. Zero-trust environment enforced.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'partners' && (
          <motion.div
            key="partners"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex bg-card border-2 border-border p-4 rounded-3xl relative overflow-hidden group max-w-2xl">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan partner matrix by ID or region..."
                className="h-14 pl-14 rounded-2xl bg-secondary/50 border-none font-bold text-lg focus-visible:ring-primary"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-[3rem] border-2 border-border bg-card p-10 flex flex-col items-center justify-center group hover:border-primary/50 transition-all cursor-crosshair">
                  <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform mb-4 border border-border">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Segment 0{i}-X</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminInventory = () => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Vault Catalog.</h2>
        <p className="text-muted-foreground font-medium italic">Manage high-yield institutional assets and product distribution nodes.</p>
      </div>
      <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl">
        <Plus className="h-5 w-5" /> Deploy New Asset
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => (
        <div key={p.id} className="p-8 rounded-[3rem] bg-card border-2 border-border hover:border-primary/30 transition-all group relative overflow-hidden">
          <div className="h-48 rounded-3xl overflow-hidden mb-6 relative">
            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 right-4 h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Store className="h-5 w-5 text-white" />
            </div>
          </div>
          <h4 className="text-xl font-black text-foreground italic uppercase tracking-tighter mb-2">{p.title}</h4>
          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <span className="text-2xl font-black text-primary">${p.price}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-10 w-10 px-0 rounded-xl border-2"><Edit className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" className="h-10 w-10 px-0 rounded-xl border-2 text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminPayouts = () => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Payout Terminal.</h2>
        <p className="text-muted-foreground font-medium italic">Execute global capital distributions across verified institutional nodes.</p>
      </div>
      <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest gap-3">
        <RefreshCw className="h-5 w-5" /> Sync Global Balance
      </Button>
    </div>

    <div className="rounded-[4rem] border-2 border-border bg-card p-24 flex flex-col items-center justify-center text-center">
      <CreditCard className="h-24 w-24 text-muted-foreground/30 mb-8" />
      <h4 className="text-3xl font-black italic text-muted-foreground uppercase">Liquidity Pool Operational.</h4>
      <p className="text-muted-foreground max-w-lg mt-4 font-medium italic text-lg leading-relaxed">Pending requests: 0. All verified distributions have been successfully transmitted via the quantum-ledger distribution protocol.</p>
    </div>
  </div>
);

const AdminSettings = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const { toast } = useToast();
  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    toast({ title: "Node Purged", description: "Proof entry removed." });
  };

  return (
    <div className="space-y-14 animate-in fade-in duration-700">
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Institutional Proof.</h2>
            <p className="text-muted-foreground font-medium italic">Audit and manage client success stories displayed on the public interface.</p>
          </div>
          <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl">
            <Plus className="h-5 w-5" /> Add Log Entry
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="p-10 rounded-[3rem] bg-card border-2 border-border hover:border-primary/50 transition-all group relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-border"><img src={t.image} className="w-full h-full object-cover" /></div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div><h4 className="text-xl font-black italic uppercase text-white">{t.name}</h4><p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t.role}</p></div>
                    <Button onClick={() => deleteTestimonial(t.id)} variant="ghost" size="sm" className="h-12 w-12 p-0 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"><Trash2 className="h-5 w-5" /></Button>
                  </div>
                  <p className="text-base italic font-medium text-muted-foreground leading-relaxed">"{t.content}"</p>
                  <div className="flex gap-1.5 pt-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400 shadow-amber-400/50 shadow-sm" />)}
                  </div>
                </div>
              </div>
              <MessageSquare className="absolute -bottom-10 -right-10 h-40 w-40 text-primary/5 rotate-12" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AdminSellers = () => {
  const { toast } = useToast();
  const [sellers] = useState([
    { id: '1', name: 'Elite Marketing Group', volume: '$1.2M', growth: '+24%', status: 'VERIFIED' },
    { id: '2', name: 'Global Traffic Hub', volume: '$840K', growth: '+12%', status: 'PENDING' },
    { id: '3', name: 'Sarah Jenkins Pro', volume: '$420K', growth: '+45%', status: 'VERIFIED' },
    { id: '4', name: 'Venture Partners LLC', volume: '$0', growth: '0%', status: 'PENDING' },
  ]);

  const handleAction = (id: string, action: string) => {
    toast({ title: `Action: ${action}`, description: `Seller ${id} protocol updated.` });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Partner Matrix.</h2>
          <p className="text-muted-foreground font-medium italic text-lg">Managing the decentralized network of verified referral nodes.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black uppercase text-xs tracking-widest gap-2"><Filter className="h-4 w-4" /> Filter Matrix</Button>
          <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-2 shadow-xl shadow-primary/20"><Plus className="h-4 w-4" /> Provision Node</Button>
        </div>
      </div>

      <div className="rounded-[4rem] border-2 border-border bg-card overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Node Principal</th>
              <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Aggregate Flow</th>
              <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Velocity</th>
              <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Auth Status</th>
              <th className="px-12 py-8 text-right text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Protocol Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sellers.map((s) => (
              <tr key={s.id} className="group hover:bg-primary/5 transition-all">
                <td className="px-12 py-10">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center border border-border group-hover:scale-110 transition-transform"><Users className="h-6 w-6 text-primary" /></div>
                    <div>
                      <p className="font-black text-foreground text-lg italic uppercase tracking-tighter">{s.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">ID: 0x{s.id}BF-Ledger</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-10 font-black italic text-xl text-primary">{s.volume}</td>
                <td className="px-12 py-10">
                  <Badge className="bg-success/20 text-success border-success/20 font-black text-[10px] tracking-widest">{s.growth}</Badge>
                </td>
                <td className="px-12 py-10">
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${s.status === 'VERIFIED' ? 'bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.status}</span>
                  </div>
                </td>
                <td className="px-12 py-10 text-right space-x-3">
                  <Button onClick={() => handleAction(s.id, 'SHADOW')} variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-secondary border border-transparent hover:border-border"><ShieldAlert className="h-5 w-5 opacity-40 group-hover:opacity-100" /></Button>
                  <Button onClick={() => handleAction(s.id, 'EDIT')} variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-secondary border border-transparent hover:border-border"><Edit className="h-5 w-5 opacity-40 group-hover:opacity-100" /></Button>
                  <Button onClick={() => handleAction(s.id, 'PURGE')} variant="ghost" className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"><Trash2 className="h-5 w-5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Intelligence Node.</h2>
          <p className="text-muted-foreground font-medium italic text-lg">Quantum telemetry of global platform performance and conversion heatmaps.</p>
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black uppercase text-xs tracking-widest gap-2">
          <RefreshCw className="h-5 w-5" /> Sync Global Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard title="Peak EPC" value="$42.80" icon={Zap} trend="+8.2% Intraday" />
        <StatsCard title="Node Retention" value="98.4%" icon={Target} trend="Optimal Threshold" />
        <StatsCard title="Traffic Pumping" value="1.4M /hr" icon={Activity} trend="Scaling Active" />
        <StatsCard title="System Integrity" value="100.0%" icon={ShieldCheck} trend="Zero Downtime" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-12 rounded-[4rem] border-2 border-border bg-card relative overflow-hidden group min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/10 to-transparent" />
          <div className="text-center relative z-10">
            <BarChart3 className="h-32 w-32 text-primary/20 mx-auto mb-8" />
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-muted-foreground">Historical Performance Matrix.</h4>
            <p className="text-muted-foreground mt-2 italic font-medium">Visualization engine currently synthesizing 12.4M past operations into a cohesive yield map.</p>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 rounded-[3rem] border-2 border-border bg-foreground text-background">
            <h4 className="text-xl font-black italic uppercase mb-8">Top Yield Nodes.</h4>
            <div className="space-y-6">
              {[
                { name: "Dubai Alpha", flow: "32%" },
                { name: "Tokyo Core", flow: "28%" },
                { name: "London Edge", flow: "24%" },
                { name: "NYC Proxy", flow: "16%" },
              ].map(node => (
                <div key={node.name} className="space-y-2">
                  <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-widest italic">
                    <span>{node.name}</span>
                    <span>{node.flow}</span>
                  </div>
                  <div className="h-1.5 w-full bg-background/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: node.flow }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-10 rounded-[3rem] border-2 border-border bg-card">
            <h4 className="text-xl font-black italic uppercase mb-8">Live Log Stream.</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-border last:border-0 opacity-60">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                  <p className="text-[10px] font-bold italic uppercase leading-tight">AUTH SUCCESS: Partner {i}024 initiated quantum link.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminAudit = () => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Audit Registry.</h2>
        <p className="text-muted-foreground font-medium italic text-lg">Immutable log of every administrative protocol executed on the ledger.</p>
      </div>
      <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black uppercase text-xs tracking-widest gap-2">
        <Server className="h-4 w-4" /> Export Ledger
      </Button>
    </div>

    <div className="rounded-[4rem] border-2 border-border bg-card overflow-hidden">
      <div className="divide-y divide-border/50">
        {[
          { event: 'NODE_AUTH', user: 'Admin_01', detail: 'Authorized Elite Marketing Group (Node 0x1)', time: '2m ago', risk: 'LOW' },
          { event: 'PAYOUT_RECONCILE', user: 'SYSTEM', detail: 'Bulk reconciliation of $142.8K inflow completed', time: '14m ago', risk: 'MINIMAL' },
          { event: 'ASSET_DEPLOY', user: 'Admin_02', detail: 'New Inventory Item "Quantum Ledger Pro" deployed', time: '1h ago', risk: 'LOW' },
          { event: 'RISK_SUPPRESSION', user: 'ENGINE', detail: 'Blocked 1,402 attempts from high-latency IP range', time: '2h ago', risk: 'CRITICAL' },
        ].map((log, i) => (
          <div key={i} className="p-10 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
            <div className="flex items-center gap-8">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-[10px] ${log.risk === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                {log.event[0]}
              </div>
              <div>
                <p className="font-black text-foreground uppercase tracking-tight">{log.event}</p>
                <p className="text-xs text-muted-foreground font-medium italic">{log.detail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-foreground">{log.user}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminSecurity = () => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Security Mesh.</h2>
        <p className="text-muted-foreground font-medium italic text-lg">System-wide risk suppression and anti-fraud protocol management.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-12 rounded-[4rem] bg-foreground text-background space-y-10 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
          <ShieldAlert className="h-48 w-48" />
        </div>
        <h4 className="text-3xl font-black italic uppercase tracking-tighter relative z-10">Suppression Matrix.</h4>
        <div className="space-y-6 relative z-10">
          {[
            { label: 'Click Injection Filter', status: 'ACTIVE', color: 'bg-primary' },
            { label: 'Proxy Node Blocking', status: 'ACTIVE', color: 'bg-primary' },
            { label: 'Latency Outlier Purge', status: 'LEARNING', color: 'bg-amber-400' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-6 rounded-3xl bg-background/10 border border-background/20">
              <span className="font-black text-xs uppercase tracking-widest italic">{item.label}</span>
              <Badge className={`${item.color} text-white font-black text-[8px] uppercase tracking-widest`}>{item.status}</Badge>
            </div>
          ))}
        </div>
        <Button className="w-full h-16 rounded-3xl bg-background text-foreground font-black uppercase text-xs tracking-[0.3em] hover:bg-primary hover:text-white transition-all">Recalibrate Intelligence Engine</Button>
      </div>

      <div className="p-12 rounded-[4rem] border-2 border-border bg-card space-y-10">
        <h4 className="text-3xl font-black italic uppercase tracking-tighter">Auth Protocols.</h4>
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-secondary/50 border border-border flex items-center justify-between">
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1">MFA Enforcement</p>
              <p className="text-[10px] text-muted-foreground font-medium italic">Require 2FA for all Super Admin actions.</p>
            </div>
            <div className="h-8 w-14 bg-success rounded-full flex items-center px-1 shadow-inner cursor-pointer hover:scale-105 transition-transform"><div className="h-6 w-6 bg-white rounded-full shadow-lg ml-auto" /></div>
          </div>
          <div className="p-8 rounded-3xl bg-secondary/50 border border-border flex items-center justify-between">
            <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1">Geofencing Nodes</p>
              <p className="text-[10px] text-muted-foreground font-medium italic">Restrict Admin access to verified IP blocks.</p>
            </div>
            <div className="h-8 w-14 bg-slate-700 rounded-full flex items-center px-1 shadow-inner cursor-pointer hover:scale-105 transition-transform"><div className="h-6 w-6 bg-slate-400 rounded-full shadow-lg" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="admin" />

      <main className="flex-1 overflow-auto bg-transparent">
        <header className="sticky top-0 z-30 bg-background/60 backdrop-blur-3xl border-b border-border px-10 py-10">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-[2.5rem] bg-foreground flex items-center justify-center shadow-2xl relative group overflow-hidden border border-border">
                <Cpu className="h-10 w-10 text-background group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Command Node 01.</h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <Badge className="bg-success text-white border-none rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest">Master Auth Active</Badge>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> Institutional Hub Secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-140px)] flex flex-col">
          <Routes>
            <Route index element={<AdminHUD />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="payouts" element={<AdminPayouts />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminHUD />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
