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
  ArrowRight,
  MessageSquare,
  Globe,
  Edit
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
import StatsCard from "@/components/StatsCard";
import { products, earningsData, milestones, Product } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const topSellers = [
  { name: "Julianne Pierce", subtitle: "Digital Assets Expert", badge: "WEEKLY LEAD", color: "text-success" },
  { name: "Marcus Thorne", subtitle: "SaaS Strategist", badge: "LEVEL 4", color: "text-muted-foreground" },
  { name: "Sarah K.", subtitle: "Cloud Solutions", badge: "LEVEL 3", color: "text-muted-foreground" },
];

const DashboardOverview = () => {
  const { affiliateId } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Prediction logic (simulated)
  const predictionData = useMemo(() => {
    const avgDaily = earningsData.reduce((acc, curr) => acc + curr.earnings, 0) / earningsData.length;
    return [
      { name: 'Current Month', value: avgDaily * 30 },
      { name: 'Predicted Growth', value: avgDaily * 30 * 1.25 }
    ];
  }, []);

  const copyLink = (productId: string) => {
    const link = `${window.location.origin}/product/${productId}?ref=${affiliateId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(productId);
    toast({ title: "Link Copied", description: "Your unique tracking URL is ready." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Earnings" value="$12,450.00" icon={DollarSign} trend="+18.2% from last month" />
        <StatsCard title="Total Clicks" value="14,892" icon={MousePointerClick} trend="+12.4% active sessions" />
        <StatsCard title="Conversion Rate %" value="3.8%" icon={TrendingUp} trend="+0.5% boost" />
        <StatsCard title="Pending Payouts" value="$2,145.50" icon={Wallet} subtitle="Scheduled for Friday" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {/* AI Revenue Predictor */}
          <div className="rounded-[2.5rem] border-2 border-border bg-card p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain className="h-40 w-40" />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                  <h2 className="text-2xl font-black text-foreground italic">AI Revenue Projection.</h2>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Predicting $ inflow velocity based on current conversion patterns.</p>
              </div>
              <Badge className="bg-primary px-4 py-1 text-[10px] uppercase font-black tracking-widest">+25% GROWTH PREDICTED</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center relative z-10">
              <div className="md:col-span-2 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(240, 60%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(240, 60%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="earnings" stroke="hsl(240, 60%, 42%)" strokeWidth={4} fill="url(#colorEarnings)" />
                    <Area type="monotone" dataKey="earnings" stroke="hsl(240, 60%, 42%)" strokeDasharray="5 5" opacity={0.3} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Current Velocity</p>
                  <p className="text-xl font-bold">$450.00 <span className="text-[10px] text-muted-foreground">/avg daily</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Projected Month-End</p>
                  <p className="text-xl font-black text-primary">$15,420.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approved Campaigns Table */}
          <div className="rounded-[2.5rem] border-2 border-border bg-card overflow-hidden shadow-xl">
            <div className="border-b border-border px-8 py-6 flex items-center justify-between bg-secondary/30">
              <div>
                <h2 className="text-xl font-black text-foreground italic uppercase">Campaign Control Hub.</h2>
                <p className="text-xs text-muted-foreground font-medium">Institutional assets ready for immediate referral routing.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Portfolio</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Inflow %</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Trust Index</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Route</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 4).map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 transition-all hover:bg-secondary/50 group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover rounded-md" />
                          </div>
                          <div>
                            <p className="font-black text-foreground text-sm uppercase tracking-tight">{p.title}</p>
                            <p className="text-[10px] text-muted-foreground font-bold italic">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <Badge className="bg-success/10 text-success border-none text-[10px] font-black uppercase px-2">{p.cr > 4 ? '50%' : '40%'} CUT</Badge>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-black text-foreground">{p.trustScore}%</span>
                          <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${p.trustScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Button
                          size="sm"
                          className="h-10 rounded-xl bg-primary text-[10px] font-black uppercase px-4 shadow-lg shadow-primary/20"
                          onClick={() => copyLink(p.id)}
                        >
                          {copiedId === p.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedId === p.id ? "Copied" : "Link"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Tier Roadmap */}
          <div className="rounded-[2.5rem] border-2 border-border bg-foreground p-8 text-background shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic">Tier Evolution.</h3>
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-background/60">
                  <span>Standard Partner</span>
                  <span>Pro Level Access</span>
                </div>
                <div className="relative h-4 bg-background/10 rounded-full border border-background/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-primary relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
                <p className="text-[10px] font-medium text-background/50 leading-relaxed italic">
                  Generate <span className="text-white font-bold">$2,850.50</span> more in earnings to unlock Pro Institutional benefits & 50% fixed commission.
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 p-8 opacity-5">
              <Rocket className="h-32 w-32" />
            </div>
          </div>

          {/* Milestone Achievements */}
          <div className="rounded-[2.5rem] border-2 border-border bg-card p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-warning" />
                <h2 className="text-xl font-black text-foreground italic">Milestones.</h2>
              </div>
              <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline italic">All Badges</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border-2 transition-all group relative cursor-pointer ${m.achieved ? 'bg-secondary border-border hover:border-primary/30' : 'bg-transparent border-dashed border-border opacity-50 grayscale hover:grayscale-0'}`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${m.achieved ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <Star className={`h-5 w-5 ${m.achieved ? 'fill-primary' : ''}`} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">{m.title}</h4>
                  {m.rewardLabel && m.achieved && (
                    <Badge className="absolute -top-2 -right-2 bg-success text-[8px] px-1 py-0">{m.rewardLabel}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="rounded-[2.5rem] bg-secondary p-8 border-2 border-border shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black text-foreground italic uppercase">Live Node Telemetry.</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Execution Speed", val: "4ms", color: "text-success" },
                { label: "Active Connections", val: "1.2k+", color: "text-foreground" },
                { label: "Routing Stability", val: "99.98%", color: "text-success" }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-card/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-black ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { affiliateId } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customLinkSlug, setCustomLinkSlug] = useState("");

  const handleCopy = (prod: Product) => {
    const slug = customLinkSlug || prod.id;
    const link = `${window.location.origin}/partner/${slug}?ref=${affiliateId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Asset Route Secured",
      description: `Branded link ${slug} is now live on your clipboard.`,
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic">Institutional Inventory.</h2>
          <p className="text-muted-foreground font-medium">Select high-yield digital assets and leverage your institutional reach.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter secure assets..."
              className="h-14 pl-12 rounded-2xl bg-card border-2 border-border focus-visible:ring-primary font-bold shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col h-full rounded-[3rem] overflow-hidden bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl shadow-primary/5"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none px-3 py-1.5 text-[10px] font-black uppercase rounded-full">
                  {p.category}
                </Badge>
                <Badge className="bg-success text-white border-none px-3 py-1.5 text-[10px] font-black uppercase rounded-full">
                  {p.trustScore}% Trust
                </Badge>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-black text-foreground italic">${p.price}</p>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black text-primary">${p.epc} <span className="text-[10px] text-muted-foreground">EPC</span></span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-tight">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed italic font-medium">
                {p.description}
              </p>

              {/* Short Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Refund Risk</p>
                  <p className="text-xs font-black text-red-500">{p.refundRate}% <span className="text-[8px] font-medium text-muted-foreground italic">(Ultra Low)</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Conver. CR</p>
                  <p className="text-xs font-black text-success">{p.cr}% <span className="text-[8px] font-medium text-muted-foreground italic">(High Yield)</span></p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Button onClick={() => setSelectedProduct(p)} variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 bg-secondary hover:bg-primary hover:text-white border-none transition-all">
                  <FileText className="h-4 w-4" /> Open Content Repository
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => handleCopy(p)} className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                    Secure Link <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Alpha Repository Modal (Simulated) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card w-full max-w-5xl rounded-[4rem] border-2 border-border shadow-3xl overflow-hidden relative z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 h-[80vh]">
                <div className="lg:col-span-4 bg-primary p-12 text-white flex flex-col justify-between">
                  <div>
                    <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center mb-8">
                      <Layers className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black italic mb-4 uppercase">Alpha Assets.</h3>
                    <p className="text-sm opacity-60 leading-relaxed font-medium">Pre-optimized promotional material for {selectedProduct.title}. Institutional quality guaranteed.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-black uppercase text-white/40 mb-2">Routing Configuration</p>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/60">Branded Link Slug</label>
                        <Input
                          value={customLinkSlug}
                          onChange={(e) => setCustomLinkSlug(e.target.value)}
                          placeholder={selectedProduct.id}
                          className="h-10 rounded-xl bg-white/10 border-none text-xs font-bold focus-visible:ring-white/20"
                        />
                      </div>
                    </div>
                    <Button onClick={() => handleCopy(selectedProduct)} className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase text-xs">Authorize Link</Button>
                  </div>
                </div>
                <div className="lg:col-span-8 p-12 overflow-y-auto space-y-12">
                  {/* Email Templates */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <Mail className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-black uppercase italic">Email Blueprints</h4>
                    </div>
                    <div className="space-y-4">
                      {selectedProduct.contentAssets.emails.map((email, j) => (
                        <div key={j} className="p-6 rounded-3xl bg-secondary border border-border group hover:border-primary/50 transition-all cursor-pointer">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.2em]">{j === 0 ? 'Aggressive' : 'Educational'}</Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0"><Copy className="h-4 w-4" /></Button>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium italic">"{email}"</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Social Content */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <Share2 className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-black uppercase italic">Social Viral Clips</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProduct.contentAssets.socialPosts.map((post, j) => (
                        <div key={j} className="p-6 rounded-3xl bg-secondary border border-border">
                          <p className="text-xs text-muted-foreground font-medium mb-4 line-clamp-3">"{post}"</p>
                          <Button variant="outline" className="w-full h-10 rounded-xl text-[10px] font-black uppercase border-2">Copy Post</Button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Banners */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FileImage className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-black uppercase italic">Institutional Banners</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProduct.contentAssets.banners.map((banner, j) => (
                        <div key={j} className="aspect-video rounded-2xl overflow-hidden border-2 border-border group relative">
                          <img src={banner} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button className="h-10 rounded-xl bg-white text-primary font-black uppercase text-[10px]">Download Asset</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InnerCircle = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">The Inner Circle.</h2>
          <p className="text-muted-foreground font-medium italic">Exclusive intelligence hub for elite institutional partners.</p>
        </div>
        <Badge className="bg-primary px-8 py-3 rounded-full text-xs font-black uppercase text-white shadow-xl shadow-primary/20">PRO ONLY ACCESS</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-[3rem] bg-card border-2 border-border p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageSquare className="h-40 w-40" />
            </div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-2xl font-black italic uppercase">Live Intelligence Feed.</h3>
            </div>
            <div className="space-y-6">
              {[
                { user: "Julianne P.", time: "12m ago", msg: "Just scaled the Quantum Ledger campaign to 40% CR using the new Pro Email template.", icon: "JP" },
                { user: "Marcus T.", time: "42m ago", msg: "London node is seeing high velocity on SaaS Infra. Anyone else scaling there?", icon: "MT" },
                { user: "Sarah K.", time: "1h ago", msg: "Converted my first high-ticket whale! $1,200 commission in a single hit.", icon: "SK" }
              ].map((chat, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-[2rem] bg-secondary/50 border border-border group hover:bg-white/5 transition-all">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg">{chat.icon}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black uppercase text-foreground">{chat.user}</span>
                      <span className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest">{chat.time}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">"{chat.msg}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4">
              <Input placeholder="Transmit intelligence..." className="h-14 rounded-2xl bg-secondary border-none font-bold" />
              <Button className="h-14 w-14 rounded-2xl bg-primary text-white p-0 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                <ArrowUpRight className="h-6 w-6" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[2.5rem] bg-foreground text-background p-10 shadow-3xl">
            <h4 className="text-xl font-black italic uppercase mb-6">Partner Leaderboard.</h4>
            <div className="space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/5 border border-background/10 group hover:bg-background/10 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-primary opacity-40">#{i + 1}</span>
                    <div>
                      <p className="text-xs font-black uppercase text-background">{s.name}</p>
                      <Badge className="bg-primary/20 text-white border-none text-[8px] font-bold mt-1 px-1">{s.badge}</Badge>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 h-14 rounded-2xl border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-primary">Global Rankings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayoutPortal = () => {
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase">Financial Node.</h2>
          <p className="text-muted-foreground font-medium italic">Automated institutional-grade payout infrastructure.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2">Export Ledger</Button>
          <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Quick Withdrawal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          {/* Invoice Table */}
          <div className="rounded-[3rem] bg-card border-2 border-border shadow-2xl overflow-hidden">
            <div className="border-b border-border px-10 py-8 flex items-center justify-between bg-secondary/30">
              <h3 className="text-xl font-black italic uppercase">Distribution History.</h3>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Notification Config Attached</span>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invoice ID</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cycle period</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gross Inflow</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status protocol</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Ledger Asset</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "INV-9021-X", period: "Mar 1 - Mar 7, 2024", amt: "$4,250.00", status: "CLEARED" },
                    { id: "INV-9020-X", period: "Feb 23 - Feb 28, 2024", amt: "$2,840.50", status: "CLEARED" },
                    { id: "INV-9019-X", period: "Feb 15 - Feb 22, 2024", amt: "$5,120.00", status: "CLEARED" },
                  ].map(inv => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-secondary/50 group transition-all">
                      <td className="px-10 py-8">
                        <span className="text-xs font-black text-foreground italic">{inv.id}</span>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-sm font-bold text-muted-foreground uppercase">{inv.period}</p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-lg font-black text-foreground">{inv.amt}</p>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <Badge className="bg-success/10 text-success border-none text-[8px] font-black uppercase px-4 py-1 rounded-full">Gate CLEARED</Badge>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <Button variant="ghost" className="h-10 rounded-xl gap-2 text-[10px] font-black uppercase border border-border group-hover:border-primary/50">
                          <FileText className="h-4 w-4" /> Download PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerProfile = () => (
  <div className="space-y-10 max-w-4xl">
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Partner Identity.</h2>
        <p className="text-muted-foreground font-medium italic">Manage your institutional credentials and public profile within the Hub.</p>
      </div>
      <Button className="h-14 px-8 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest gap-3 shadow-xl">
        <Edit className="h-4 w-4" /> Edit Profile
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 rounded-[3rem] bg-card border-2 border-border p-10 flex flex-col items-center">
        <div className="h-40 w-40 rounded-[3rem] overflow-hidden border-4 border-primary shadow-2xl mb-8 relative">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
        <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tighter">Alex Chen</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Pro-Tier Partner</p>
      </div>
      <div className="md:col-span-2 space-y-6">
        <div className="p-8 rounded-[2.5rem] bg-card border-2 border-border">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Verification Metadata</h4>
          <div className="space-y-4">
            {[
              { label: "Partner ID", value: "EL-NODE-4829-X" },
              { label: "Account Status", value: "Verified Institutional" },
              { label: "Member Since", value: "January 2024" },
              { label: "Default Currency", value: "USD - Ledger Standard" },
            ].map(item => (
              <div key={item.label} className="flex justify-between border-b border-border/50 pb-4">
                <span className="text-[10px] font-black uppercase text-muted-foreground">{item.label}</span>
                <span className="text-xs font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PartnerSettings = () => (
  <div className="space-y-10 max-w-4xl">
    <div>
      <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-2">Node Protocols.</h2>
      <p className="text-muted-foreground font-medium italic">Configure your security, notifications, and operational preferences.</p>
    </div>

    <div className="space-y-6">
      {[
        { title: "Security Matrix", desc: "Multi-factor authentication and hardware key management.", icon: ShieldCheck },
        { title: "Notification Tunnels", desc: "Webhook endpoints and push configuration for live inflow events.", icon: Globe },
        { title: "Financial Routing", desc: "Default payout methods and automated distribution schedules.", icon: CreditCard },
      ].map((item, i) => (
        <div key={i} className="group p-8 rounded-[2.5rem] bg-card border-2 border-border hover:border-primary/50 transition-all flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-black text-foreground uppercase tracking-tight italic">{item.title}</h4>
              <p className="text-xs text-muted-foreground font-medium italic">{item.desc}</p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
        </div>
      ))}
    </div>
  </div>
);

const AffiliateDashboard = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-transparent">
      <DashboardSidebar type="affiliate" />
      <main className="flex-1 overflow-auto bg-transparent">
        {/* Header Experience */}
        <div className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl border-b border-border px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[2.2rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/30 relative">
                <LayoutDashboard className="h-8 w-8 text-white" />
                <div className="absolute top-0 right-0 h-4 w-4 bg-success rounded-full border-4 border-background" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground italic tracking-tight uppercase">Executive portal.</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline" className="text-[10px] font-black uppercase px-3 py-0.5 rounded-full border-2 bg-success/5 text-success border-success/20">Operational</Badge>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-nowrap">
                    <div className="flex items-center gap-2"><Globe className="h-3 w-3" /> Node: 42-X</div>
                    <div className="flex items-center gap-2 text-primary"><ShieldCheck className="h-3 w-3" /> Encrypted</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-border pr-8">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Next Payout</p>
                  <p className="text-sm font-black text-foreground italic whitespace-nowrap">April 12, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Global Rank</p>
                  <p className="text-sm font-black text-primary">#142</p>
                </div>
              </div>
              <Button className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest gap-3 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                <Wallet className="h-5 w-5" />
                Request Withdrawal
              </Button>
            </div>
          </div>

          <nav className="flex gap-8 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: "Overview", to: "/dashboard/affiliate", icon: LayoutDashboard },
              { label: "Marketplace", to: "/dashboard/affiliate/marketplace", icon: Store },
              { label: "Inner Circle", to: "/dashboard/affiliate/circle", icon: Users },
              { label: "Payouts", to: "/dashboard/affiliate/payouts", icon: CreditCard },
              { label: "Partner Profile", to: "/dashboard/affiliate/profile", icon: Users },
              { label: "Settings", to: "/dashboard/affiliate/settings", icon: Settings },
            ].map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pb-4 border-b-4 transition-all whitespace-nowrap ${active ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-10">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="marketplace" element={<DashboardMarketplace />} />
            <Route path="circle" element={<InnerCircle />} />
            <Route path="payouts" element={<PayoutPortal />} />
            <Route path="profile" element={<PartnerProfile />} />
            <Route path="settings" element={<PartnerSettings />} />
            <Route path="*" element={<DashboardOverview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
