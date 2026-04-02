import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import PurchaseModal from "@/components/PurchaseModal";
import { products, Product } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

const categories = ["All", "E-books", "Software", "Courses"] as const;

const Storefront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {refId && (
        <div className="border-b border-primary/10 bg-primary/5 py-2 text-center text-sm text-primary font-medium">
          <Sparkles className="inline h-3.5 w-3.5 mr-1" />
          You're shopping via an affiliate referral link
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              <Zap className="h-3 w-3" /> Premium Digital Products
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
              Discover & Sell<br />
              <span className="gradient-text">Digital Products</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              The marketplace for creators. Browse premium e-books, software, and courses — or earn 50% commission as an affiliate.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Secure Payments</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /> 50% Commission</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Instant Access</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto flex gap-8 px-4 py-10">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-8">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Categories</h3>
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Price Range</h3>
            <Slider min={0} max={200} step={10} value={priceRange} onValueChange={setPriceRange} />
            <div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
              <span>₵{priceRange[0]}</span>
              <span>₵{priceRange[1]}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{filtered.length} Products</h2>
          </div>

          {filtered.length === 0 ? (
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

      <PurchaseModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Storefront;
