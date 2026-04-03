import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Activity,
  PieChart as PieIcon,
  BarChart3,
  Search,
  MoreVertical,
  Check,
  X,
  UserCheck,
  Zap,
  ShieldAlert,
  Lock,
  Cpu,
  Globe,
  Server,
  ArrowUpRight,
  Map as MapIcon,
  Shield,
  FileSearch,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Target,
  Filter
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type AdminTab = 'hud' | 'verification' | 'risk' | 'partners';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hud');
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (name: string) => {
    toast({
      title: "Partner Verified",
      description: `${name} has been granted high-level institutional access.`
    });
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="admin" />

      <main className="flex-1 overflow-auto bg-transparent">
        {/* HUD Header */}
        <header className="sticky top-0 z-30 bg-background/60 backdrop-blur-3xl border-b border-border px-10 py-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[2rem] bg-foreground flex items-center justify-center shadow-2xl shadow-foreground/20 relative group overflow-hidden">
                <Cpu className="h-8 w-8 text-background group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground italic uppercase tracking-tighter">Command Node 01.</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-success text-white border-none rounded-full px-4 text-[10px] font-black uppercase tracking-widest">Master Auth Enabled</Badge>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic flex items-center gap-2">
                    <Globe className="h-3 w-3" /> All systems operational
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="hidden lg:flex items-center gap-8 mr-8 border-r border-border pr-12">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 italic">Network Load</p>
                  <p className="text-sm font-black text-foreground">14.2% Capacity</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 italic">Active Leads</p>
                  <p className="text-sm font-black text-success">2,412 /min</p>
                </div>
              </div>
              <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                <Server className="h-5 w-5 text-primary group-hover:animate-bounce" />
                System Health Overview
              </Button>
            </div>
          </div>

          <nav className="flex gap-12 mt-12">
            {[
              { id: 'hud', label: 'Global HUD', icon: MapIcon },
              { id: 'verification', label: 'Verification Queue', icon: ShieldCheck },
              { id: 'risk', label: 'Risk Mitigation', icon: ShieldAlert },
              { id: 'partners', label: 'Partner Matrix', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-3 pb-4 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          <AnimatePresence mode="wait">
            {activeTab === 'hud' && (
              <motion.div
                key="hud"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Core Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Global Inflow" value="$842,501.20" icon={DollarSign} trend="+24.5% Growth" />
                  <StatsCard title="Unique Routing Nodes" value="482 Active" icon={Server} trend="All regions green" />
                  <StatsCard title="Fraud Suppression" value="99.98%" icon={Shield} trend="12 attempts blocked today" />
                  <StatsCard title="Pending Approvals" value="24" icon={FileSearch} trend="Critical priority: 4" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    {/* Global Traffic HUD Visual */}
                    <div className="rounded-[3.5rem] bg-slate-900/50 border-2 border-border p-12 shadow-3xl relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Live Traffic Matrix.</h3>
                          <p className="text-slate-400 font-medium text-sm">Real-time routing data from Dubai, NYC, and London Command Centers.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-success rounded-full animate-ping" />
                          <span className="text-[10px] font-black text-success uppercase tracking-widest">Live Flow Active</span>
                        </div>
                      </div>

                      {/* Simulated Map Visual */}
                      <div className="aspect-[16/8] relative bg-slate-950/80 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.1),transparent)]" />
                        <div className="absolute h-[2px] w-full bg-slate-800 top-1/2 left-0 opacity-20" />
                        <div className="absolute w-[2px] h-full bg-slate-800 left-1/2 top-0 opacity-20" />

                        {/* Floating Data Points */}
                        {[
                          { t: "15%", l: "20%", label: "Dubai Node", color: "bg-success" },
                          { t: "40%", l: "45%", label: "London Hub", color: "bg-primary" },
                          { t: "55%", l: "70%", label: "NY Center", color: "bg-primary" },
                          { t: "70%", l: "30%", label: "Tokyo Sync", color: "bg-success" }
                        ].map(point => (
                          <motion.div
                            key={point.label}
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute flex flex-col items-center gap-3"
                            style={{ top: point.t, left: point.l }}
                          >
                            <div className={`h-4 w-4 rounded-full ${point.color} shadow-[0_0_20px_rgba(34,197,94,0.5)]`} />
                            <Badge className="bg-slate-900/90 text-white border-white/10 text-[8px] font-black uppercase whitespace-nowrap">{point.label}</Badge>
                          </motion.div>
                        ))}

                        {/* Simulated Ping Lines */}
                        <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="text-zinc-700 font-black text-9xl select-none opacity-5">LEDGER.</div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 mt-12 relative z-10">
                        <div className="p-6 rounded-3xl bg-slate-950/40 border border-white/5">
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Request Velocity</p>
                          <p className="text-2xl font-black text-white italic">42,8k <span className="text-[10px] text-zinc-600">/sec</span></p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-950/40 border border-white/5">
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Route Integrity</p>
                          <p className="text-2xl font-black text-success italic">100.0%</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-950/40 border border-white/5">
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Lead Sync</p>
                          <p className="text-2xl font-black text-white italic">8ms <span className="text-[10px] text-zinc-600">delay</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-8">
                    <div className="rounded-[2.5rem] bg-foreground text-background p-10 shadow-3xl">
                      <div className="flex items-center gap-3 mb-8 text-primary">
                        <Target className="h-6 w-6" />
                        <h4 className="text-xl font-black italic uppercase">System Alerts.</h4>
                      </div>
                      <div className="space-y-4">
                        {[
                          { msg: "Unauthorized retry detected from Node 12", type: "CRITICAL", icon: ShieldAlert },
                          { msg: "New PRO Tier affiliate request: Julianne S", type: "QUEUE", icon: UserCheck },
                          { msg: "Weekly distribution cycle starting in 4h", type: "SYSTEM", icon: Zap }
                        ].map((alert, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-background/5 border border-background/10 flex gap-4 group hover:bg-background/10 transition-all cursor-pointer">
                            <alert.icon className={`h-5 w-5 mt-0.5 ${alert.type === 'CRITICAL' ? 'text-red-400' : 'text-primary'}`} />
                            <div>
                              <p className="text-[10px] font-black uppercase text-background opacity-40 mb-1">{alert.type}</p>
                              <p className="text-xs font-bold leading-relaxed">{alert.msg}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full mt-10 h-16 rounded-2xl bg-background text-foreground font-black text-[10px] uppercase tracking-widest border-2 border-foreground hover:bg-primary hover:text-white transition-all">Clear Priority Ops</Button>
                    </div>

                    <div className="rounded-[2.5rem] bg-card border-2 border-border p-10 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-lg font-black italic uppercase">Override Matrix.</h4>
                        <ShieldCheck className="h-5 w-5 text-success" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium mb-6 uppercase tracking-widest italic leading-relaxed">
                        Adjust commission coefficients cross-platform or per specific partner node.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-secondary flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest">Global Commission</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-primary">40%</span>
                            <button className="h-6 w-6 rounded-lg border border-border flex items-center justify-center hover:bg-border transition-all"><TrendingUp className="h-3 w-3" /></button>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest">Redirect Delay</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-foreground">0ms</span>
                            <button className="h-6 w-6 rounded-lg border border-border flex items-center justify-center hover:bg-border transition-all"><ChevronRight className="h-3 w-3" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                className="space-y-8"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Gatekeeper Queue.</h2>
                    <p className="text-muted-foreground font-medium italic">All potential partners must be verified against institutional compliance data.</p>
                  </div>
                  <Badge className="h-8 px-6 bg-primary text-[10px] font-black uppercase rounded-full">24 Pending Reviews</Badge>
                </div>

                <div className="rounded-[3rem] bg-card border-2 border-border shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left bg-secondary/30">
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Applied Profile</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Tier Origin</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Verified Payment</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Compliance Score</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic text-right">Gate Authorization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 1, name: "Julianne Pierce", email: "j.pierce@global.ly", tier: "PRO", pay: "$29.00", score: 98 },
                          { id: 2, name: "Marcus Thorne", email: "mth@ventures.co", tier: "STANDARD", pay: "$19.00", score: 92 },
                          { id: 3, name: "Sarah K-Labs", email: "sarah@klab.io", tier: "BASIC", pay: "$7.00", score: 88 },
                          { id: 4, name: "Alex Chen", email: "a.chen@data.xt", tier: "PRO", pay: "$29.00", score: 100 },
                        ].map(partner => (
                          <tr key={partner.id} className="border-b border-border transition-all hover:bg-primary/5 group">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center p-1 border border-border group-hover:scale-110 transition-transform">
                                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-400" />
                                </div>
                                <div>
                                  <p className="font-black text-foreground text-sm uppercase tracking-tight">{partner.name}</p>
                                  <p className="text-[10px] text-muted-foreground font-bold italic">{partner.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <Badge className={`${partner.tier === 'PRO' ? 'bg-foreground text-background' : 'bg-secondary text-foreground'} px-4 py-1 text-[8px] font-black tracking-widest`}>{partner.tier}</Badge>
                            </td>
                            <td className="px-10 py-8">
                              <p className="text-sm font-black text-success italic">{partner.pay}</p>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-black">{partner.score}%</span>
                                <div className="h-1 w-20 bg-secondary rounded-full overflow-hidden">
                                  <div className="h-full bg-success" style={{ width: `${partner.score}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right space-x-2">
                              <Button onClick={() => handleApprove(partner.name)} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"><X className="h-5 w-5" /></Button>
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {/* Advanced Risk Engine Cards would go here */}
                <div className="lg:col-span-3 p-20 rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center bg-secondary/20">
                  <ShieldAlert className="h-20 w-20 text-muted-foreground/30 mb-8" />
                  <h4 className="text-2xl font-black italic text-muted-foreground uppercase">Risk Mitigation Engine Active.</h4>
                  <p className="text-muted-foreground max-w-lg mt-4 font-medium italic">Automated suppression of high-frequency invalid click-streams and fraudulent lead generation is fully operational.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'partners' && (
              <motion.div
                key="partners"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex bg-card border-2 border-border p-4 rounded-3xl relative overflow-hidden group">
                  <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Scan partner matrix by ID, region, or inflow volume..."
                    className="h-16 pl-14 rounded-2xl bg-secondary/50 border-none font-bold text-lg focus-visible:ring-primary shadow-inner"
                  />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30"><Filter className="h-4 w-4" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 rounded-3xl border-2 border-border bg-card animate-pulse" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
