import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import PurchaseModal from "@/components/PurchaseModal";
import { useAuth } from "@/context/AuthContext";
import { Slider } from "@/components/ui/slider";
import { Search, CheckSquare, Square, ChevronDown, Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Storefront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const { productId: pathProductId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refId = searchParams.get("ref");
  const queryProductId = searchParams.get("product");
  const productId = pathProductId || queryProductId;
  const [referral, setReferral] = useState<{ affiliateId?: string; affiliateLinkId?: string; code?: string }>({});

  const { profile } = useAuth();
  const userTier = profile?.package_tier || "Basic";

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!refId) { setReferral({}); return; }
    (async () => {
      const { data: link } = await supabase
        .from("affiliate_links")
        .select("id, affiliate_id, product_id")
        .eq("short_code", refId)
        .maybeSingle();
      if (link) {
        setReferral({ affiliateId: link.affiliate_id, affiliateLinkId: link.id, code: refId });
        // Track click with utm/channel
        const utm_source = searchParams.get("utm_source");
        const utm_medium = searchParams.get("utm_medium");
        const utm_campaign = searchParams.get("utm_campaign");
        await supabase.from("link_clicks").insert({
          affiliate_id: link.affiliate_id,
          link_id: link.id,
          product_id: link.product_id,
          channel: utm_source || null,
          utm_source, utm_medium, utm_campaign,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          ip_address: "0.0.0.0",
        } as any);
        return;
      }


      const { data: affiliateId } = await supabase.rpc("resolve_affiliate_ref", { _ref: refId });
      setReferral(affiliateId ? { affiliateId: affiliateId as string, code: refId } : { code: refId });
    })();
  }, [refId]);


  useEffect(() => {
    if (!productId || products.length === 0) return;
    const match = products.find((product) => product.id === productId);
    if (match) setSelectedProduct(match);
  }, [productId, products]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p: any) => p.category))];
    return [
      { label: "All Products", count: products.length },
      ...cats.map(c => ({ label: c as string, count: products.filter((p: any) => p.category === c).length }))
    ];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Products" || p.category === selectedCategory;
      const matchesPrice = Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {refId && (
        <div className="border-b border-primary/20 bg-primary/5 py-2 text-center text-sm text-primary font-medium">
          <LinkIcon className="inline h-3.5 w-3.5 mr-1.5" />
          REFERRAL ACTIVE: SUPPORT OUR PARTNERS BY BUYING HERE
        </div>
      )}

      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight max-w-2xl">
              Digital <span className="text-white/50">Products.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              High-quality digital products designed to help you grow.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto flex gap-8 px-4 py-10">
        {!productId ? (
          <div className="flex-1 py-32 text-center">
            <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Private Ecosystem</h2>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">
              This storefront is restricted to direct affiliate referrals.
              Please follow an official link to purchase.
            </p>
            <Link to="/">
              <Button variant="outline" className="mt-8 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                Return to Home
              </Button>
            </Link>
          </div>
        ) : (
          <main className="flex-1">
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Securing product data...</p>
              </div>
            ) : !selectedProduct ? (
              <div className="py-20 text-center">
                <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
                <p className="text-muted-foreground">The product link you followed may be invalid or expired.</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto py-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  <div className="aspect-square rounded-[2.5rem] overflow-hidden glass shadow-2xl border-border relative group">
                    <img
                      src={selectedProduct.image_url || "/placeholder.svg"}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <Badge className="bg-primary/20 text-primary border-none uppercase tracking-widest text-[10px]">{selectedProduct.category}</Badge>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full italic">OFFER EXCLUSIVE</Badge>
                      <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                        {selectedProduct.title}
                      </h1>
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="p-8 rounded-[2rem] glass-subtle space-y-6">
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Investment</p>
                          <p className="text-5xl font-black italic tracking-tighter text-primary">
                            ${Number(selectedProduct.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => setSelectedProduct({ ...selectedProduct })}
                        className="w-full h-20 rounded-2xl text-xl font-black uppercase tracking-tight shadow-glow group"
                      >
                        Secure Access
                        <ChevronDown className="ml-2 h-5 w-5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
                        Standard Licensing & Support Included
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </main>
        )}
      </div>

      <Footer />
      <PurchaseModal product={selectedProduct} onClose={() => setSelectedProduct(null)} affiliateReferral={referral} />
    </div>
  );
};

export default Storefront;
