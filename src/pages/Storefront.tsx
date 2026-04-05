import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import PurchaseModal from "@/components/PurchaseModal";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Slider } from "@/components/ui/slider";
import { Search, CheckSquare, Square, ChevronDown, Link as LinkIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const Storefront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  const { role, packageType } = useAuth();
  const { products: systemProducts } = useData();
  const isLoading = false;

  const categories = useMemo(() => {
    const cats = [...new Set(systemProducts.map(p => p.category))];
    return [
      { label: "All Products", count: systemProducts.length },
      ...cats.map(c => ({ label: c, count: systemProducts.filter(p => p.category === c).length }))
    ];
  }, [systemProducts]);

  const filtered = useMemo(() => {
    return systemProducts.filter((p) => {
      // Package rules:
      // Pro: all (Basic + Standard + Pro)
      // Standard: Basic + Standard
      // Basic / Guest: Basic
      const tierRank = { "Basic": 0, "Standard": 1, "Pro": 2 };
      const userTier = role === "SUPERADMIN" ? "Pro" : (packageType || "Basic");
      const userRank = tierRank[userTier as keyof typeof tierRank];
      const productRank = tierRank[p.minimumTier as keyof typeof tierRank];

      if (productRank > userRank) return false;

      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Products" || p.category === selectedCategory;
      const matchesPrice = Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [systemProducts, searchQuery, selectedCategory, priceRange, packageType, role]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {refId && (
        <div className="border-b border-primary/20 bg-primary/5 py-2 text-center text-sm text-primary font-medium">
          <LinkIcon className="inline h-3.5 w-3.5 mr-1.5" />
          REFERRAL ACTIVE: SUPPORT OUR PARTNERS BY BUYING HERE
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">
              <span>MARKETPLACE</span>
              <span>/</span>
              <span className="text-white/90">OUR PRODUCTS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight max-w-2xl">
              Digital <span className="text-white/50">Products.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/60 max-w-xl leading-relaxed">
              High-quality digital products designed to help you grow your personal and professional business.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto flex gap-8 px-4 py-10">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-52 shrink-0 space-y-8">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Discovery</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs rounded-lg bg-secondary border-0"
              />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Classification</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-all ${selectedCategory === cat.label
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {selectedCategory === cat.label ? (
                    <CheckSquare className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Square className="h-3.5 w-3.5" />
                  )}
                  <span className="flex-1 text-left text-xs">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Investment</h3>
              <span className="text-[10px] font-semibold text-primary">${priceRange[0]}—${priceRange[1]}</span>
            </div>
            <Slider min={0} max={1500} step={10} value={priceRange} onValueChange={setPriceRange} />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">{filtered.length} Active Listings</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>SORT BY:</span>
              <button className="font-medium text-foreground flex items-center gap-0.5">
                Highest Rated <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading assets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, i) => (
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
