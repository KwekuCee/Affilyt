import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2, Link as LinkIcon, Lock, Copy, Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const TIER_RANK: Record<string, number> = { Basic: 1, Standard: 2, Pro: 3 };
const TIERS = ["Basic", "Standard", "Pro"] as const;
type Tier = typeof TIERS[number];

const normalizeTier = (t?: string | null): Tier => {
  if (!t) return "Basic";
  const cap = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  return (TIERS.includes(cap as Tier) ? cap : "Basic") as Tier;
};

const Marketplace = () => {
  const { tier: tierParam } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const activeTier: Tier | "All" = tierParam
    ? (normalizeTier(tierParam) as Tier)
    : "All";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const userTier = normalizeTier(profile?.package_tier);
  const userTierRank = TIER_RANK[userTier] ?? 0;
  const isAffiliate = !!user && !!profile?.package_tier;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const pTier = normalizeTier(p.min_tier);
      if (activeTier !== "All" && pTier !== activeTier) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && p.category !== category) return false;
      const price = Number(p.price);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [products, activeTier, search, category, priceRange]);

  const canPromote = (product: any) => {
    const req = TIER_RANK[normalizeTier(product.min_tier)] ?? 1;
    return isAffiliate && userTierRank >= req;
  };

  const handleGetLink = async (product: any) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Log in as an affiliate to generate links." });
      navigate("/login");
      return;
    }
    if (!canPromote(product)) {
      toast({
        title: "Upgrade required",
        description: `This product needs the ${normalizeTier(product.min_tier)} tier. Upgrade your plan to promote it.`,
        variant: "destructive",
      });
      return;
    }
    setGeneratingId(product.id);
    try {
      const { data: existing } = await supabase
        .from("affiliate_links")
        .select("short_code")
        .eq("affiliate_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      let shortCode = existing?.short_code;
      if (!shortCode) {
        shortCode = Math.random().toString(36).slice(2, 9);
        const { error } = await supabase.from("affiliate_links").insert({
          affiliate_id: user.id,
          product_id: product.id,
          short_code: shortCode,
        } as any);
        if (error) throw error;
      }

      const url = `${window.location.origin}/product/${product.id}?ref=${shortCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(product.id);
      toast({ title: "Link copied!", description: url });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e: any) {
      toast({ title: "Failed to generate link", description: e.message, variant: "destructive" });
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user ? <Navbar /> : <LandingNavbar />}

      <section className="hero-gradient text-white pt-24 pb-14">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-white/10 text-white border-white/20 uppercase tracking-widest text-[10px]">
              Marketplace
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl">
              {activeTier === "All" ? "All Products" : `${activeTier} Tier Marketplace`}
            </h1>
            <p className="mt-4 text-white/70 max-w-xl">
              Browse every approved product on Affilyt. Affiliates can generate a tracking link with one click.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/marketplace">
                <Button size="sm" variant={activeTier === "All" ? "secondary" : "outline"} className="rounded-full">
                  All
                </Button>
              </Link>
              {TIERS.map((t) => (
                <Link key={t} to={`/marketplace/${t.toLowerCase()}`}>
                  <Button size="sm" variant={activeTier === t ? "secondary" : "outline"} className="rounded-full">
                    {t}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="pl-9" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
            <div className="flex flex-col gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    category === c ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
              Price · ${priceRange[0]} – ${priceRange[1]}
            </label>
            <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={2000} step={10} />
          </div>
        </aside>

        <main>
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1">Try a different tier, category, or search term.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => {
                  const pTier = normalizeTier(p.min_tier);
                  const locked = isAffiliate && !canPromote(p);
                  const img = p.image_url;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-elevated transition-all flex flex-col"
                    >
                      <Link to={`/product/${p.id}`} className="block aspect-[16/10] bg-muted overflow-hidden relative">
                        {img ? (
                          <img src={img} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                        )}
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-background/90 text-foreground border border-border">
                          {p.category}
                        </span>
                        <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          pTier === "Pro" ? "bg-primary text-primary-foreground border-primary" :
                          pTier === "Standard" ? "bg-accent text-accent-foreground border-accent" :
                          "bg-background/90 text-foreground border-border"
                        }`}>
                          {pTier}
                        </span>
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-base leading-snug mb-1.5 line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{p.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-display text-xl font-bold">${Number(p.price).toFixed(2)}</p>
                            {p.commission_rate ? (
                              <p className="text-xs text-primary font-medium">{p.commission_rate}% commission</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/product/${p.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full gap-1.5">
                              View <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {isAffiliate && (
                            <Button
                              size="sm"
                              className="flex-1 gap-1.5"
                              disabled={locked || generatingId === p.id}
                              onClick={() => handleGetLink(p)}
                            >
                              {locked ? (
                                <><Lock className="h-3.5 w-3.5" /> {pTier}</>
                              ) : generatingId === p.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : copiedId === p.id ? (
                                <><Check className="h-3.5 w-3.5" /> Copied</>
                              ) : (
                                <><LinkIcon className="h-3.5 w-3.5" /> Get Link</>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
