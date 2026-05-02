import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import PurchaseModal from "@/components/PurchaseModal";
import { useAuth } from "@/context/AuthContext";
import { Slider } from "@/components/ui/slider";
import { Search, CheckSquare, Square, ChevronDown, Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Storefront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const refId = searchParams.get("ref");

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
        <aside className="hidden lg:block w-52 shrink-0 space-y-8">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Search</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 text-xs rounded-lg bg-secondary border-0" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all ${selectedCategory === cat.label ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  {selectedCategory === cat.label ? <CheckSquare className="h-3.5 w-3.5 text-primary" /> : <Square className="h-3.5 w-3.5" />}
                  <span className="flex-1 text-left text-xs">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Price</h3>
              <span className="text-[10px] font-semibold text-primary">${priceRange[0]}—${priceRange[1]}</span>
            </div>
            <Slider min={0} max={1500} step={10} value={priceRange} onValueChange={setPriceRange} />
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">{filtered.length} Products</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product: any, i: number) => (
                <ProductCard key={product.id} product={product} onBuy={setSelectedProduct} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
      <PurchaseModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Storefront;
